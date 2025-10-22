"use client"

import { useEffect, useState } from "react"
import { createClient, type AuthUser } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    // Initialize with current user
    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user))
      .finally(() => setLoading(false))

    // Maintain API compatibility (no-op subscription)
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session.user)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  return { user, loading }
}
