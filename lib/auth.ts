// Authentication using IITP Auth Gateway (https://iitp-auth.vercel.app)
// This integrates with the centralized OTP authentication service for IITP students
// and provides localStorage-based data persistence for client-side queries.

export type AuthUser = {
  id: string
  email: string
  name: string
  rollNumber?: string
  admissionYear?: number
  degree?: string
  branch?: string
  verified?: boolean
  user_metadata?: { name?: string }
}

type Subscription = { unsubscribe: () => void }

const LS_KEYS = {
  currentUser: "sf_current_user",
  authToken: "sf_auth_token",
  table: (name: string) => `sf_table_${name}`,
}

const IITP_AUTH_GATEWAY = process.env.NEXT_PUBLIC_IITP_AUTH_GATEWAY || "https://iitp-auth.vercel.app"

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write errors
  }
}

function genId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore
    return crypto.randomUUID()
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

const pkMap: Record<string, string> = {
  education: "eduId",
  achievements: "achievementId",
  positionsOfResponsibility: "posId",
  projects: "projectId",
  skills: "skillId",
  courses: "courseId",
  certifications: "certId",
  profiles: "userId",
}

function readTable<T = any>(table: string): T[] {
  return readJSON<T[]>(LS_KEYS.table(table), [])
}

function writeTable<T = any>(table: string, rows: T[]) {
  writeJSON(LS_KEYS.table(table), rows)
}

export function createClient() {
  return {
    auth: {
      async signUp({ email, password, options }: { email: string; password: string; options?: { data?: { name?: string } } }) {
        // IITP Gateway doesn't use traditional signup - redirect to gateway instead
        const user: AuthUser = { 
          id: genId(), 
          email, 
          name: options?.data?.name || email.split('@')[0],
          user_metadata: { name: options?.data?.name } 
        }
        writeJSON(LS_KEYS.currentUser, user)
        return { data: { user }, error: null as any }
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        // IITP Gateway doesn't use password - redirect to gateway instead
        let user = readJSON<AuthUser | null>(LS_KEYS.currentUser, null)
        if (!user || user.email !== email) {
          user = { id: genId(), email, name: email.split('@')[0] }
          writeJSON(LS_KEYS.currentUser, user)
        }
        return { data: { user }, error: null as any }
      },
      async signOut() {
        writeJSON<AuthUser | null>(LS_KEYS.currentUser, null)
        writeJSON<string | null>(LS_KEYS.authToken, null)
        return { error: null as any }
      },
      async getUser() {
        const user = readJSON<AuthUser | null>(LS_KEYS.currentUser, null)
        return { data: { user }, error: null as any }
      },
      onAuthStateChange(_cb: (event: string, session: { user: AuthUser | null }) => void) {
          const user = readJSON<AuthUser | null>(LS_KEYS.currentUser, null)
          // Immediately invoke the callback with current user
          try {
            _cb("INITIAL_SESSION", { user })
          } catch {}
          return { data: { subscription: { unsubscribe() {} } as Subscription } }
        },
    },
    from(table: string) {
      const pk = pkMap[table] || "id"

      const api = {
        select(_columns?: string) {
          const data = readTable<any>(table)
          return new Query(data)
        },
        insert(rows: any[]) {
          const data = readTable<any>(table)
          const toInsert = rows.map((r) => (r[pk] ? r : { ...r, [pk]: genId() }))
          const next = [...data, ...toInsert]
          writeTable(table, next)
          return { data: toInsert, error: null as any }
        },
        update(patch: Record<string, any>) {
          return {
            eq(field: string, value: any) {
              const data = readTable<any>(table)
              const next = data.map((row) => (row[field] === value ? { ...row, ...patch } : row))
              writeTable(table, next)
              return { data: null, error: null as any }
            },
          }
        },
        delete() {
          return {
            eq(field: string, value: any) {
              const data = readTable<any>(table)
              const next = data.filter((row) => row[field] !== value)
              writeTable(table, next)
              return { data: null, error: null as any }
            },
          }
        },
      }

      class Query<T = any> {
        constructor(public data: T[], public error: any = null) {}
        eq(field: string, value: any) {
          this.data = this.data.filter((row: any) => row?.[field] === value)
          return this
        }
        order(field: string, opts?: { ascending?: boolean }) {
          const asc = opts?.ascending !== false
          const sorted = [...this.data].sort((a: any, b: any) => {
            const av = a?.[field]
            const bv = b?.[field]
            if (av === bv) return 0
            return (av > bv ? 1 : -1) * (asc ? 1 : -1)
          })
          return { data: sorted, error: this.error }
        }
        single() {
          return { data: (this.data[0] as any) ?? null, error: this.error }
        }
      }

      return api
    },
  }
}

// Helper to redirect to IITP Auth Gateway for login
export function redirectToIITPAuth() {
  if (typeof window === "undefined") return
  const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`)
  window.location.href = `${IITP_AUTH_GATEWAY}/auth?redirect_uri=${callbackUrl}`
}

// Helper to handle callback from IITP Auth Gateway
export function handleIITPCallback(token: string): AuthUser | null {
  if (!token) return null
  
  try {
    // Decode JWT (basic base64 decode without verification for client-side)
    // In production, verify signature on server-side
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    
    const user: AuthUser = {
      id: payload.rollNumber || payload.email || genId(),
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      rollNumber: payload.rollNumber,
      admissionYear: payload.admissionYear,
      degree: payload.degree,
      branch: payload.branch,
      verified: payload.verified || true,
    }
    
    writeJSON(LS_KEYS.currentUser, user)
    writeJSON(LS_KEYS.authToken, token)
    
    return user
  } catch (error) {
    console.error('Failed to parse IITP auth token:', error)
    return null
  }
}

// Get stored auth token
export function getAuthToken(): string | null {
  return readJSON<string | null>(LS_KEYS.authToken, null)
}

export async function signUp(email: string, password: string, name: string) {
  // For IITP Gateway, redirect instead of traditional signup
  redirectToIITPAuth()
  // Return placeholder to maintain API compatibility
  return { data: null, error: { message: "Redirecting to IITP Auth Gateway..." } }
}

export async function signIn(email: string, password: string) {
  // For IITP Gateway, redirect instead of password signin
  redirectToIITPAuth()
  // Return placeholder to maintain API compatibility
  return { data: null, error: { message: "Redirecting to IITP Auth Gateway..." } }
}

export async function signOut() {
  const supabase = createClient()
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}
