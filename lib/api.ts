// API helper utilities for making authenticated requests to the backend

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('sf_auth_token')
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    
    const payload = JSON.parse(atob(parts[1]))
    if (!payload.exp) return false // No expiration set
    
    // Check if token is expired (with 60 second buffer)
    return Date.now() >= (payload.exp * 1000) - 60000
  } catch {
    return true
  }
}

function clearAuthAndRedirect() {
  if (typeof window === 'undefined') return
  
  // Clear authentication data
  localStorage.removeItem('sf_auth_token')
  localStorage.removeItem('sf_current_user')
  
  // Redirect to login
  window.location.href = '/login'
}

async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  // Check if token is expired before making request
  if (token && isTokenExpired(token)) {
    clearAuthAndRedirect()
    throw new ApiError(401, 'Session expired. Please login again.')
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    const errorMessage = error.error || `HTTP ${response.status}`
    
    // Handle token expiration
    if (response.status === 401 && (errorMessage.includes('Token expired') || errorMessage.includes('expired'))) {
      clearAuthAndRedirect()
      throw new ApiError(response.status, 'Session expired. Please login again.')
    }
    
    throw new ApiError(response.status, errorMessage)
  }

  return response.json()
}

// Profile API
export const profileApi = {
  get: () => fetchApi('/api/profile'),
  create: (data: any) => fetchApi('/api/profile', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => fetchApi('/api/profile', { method: 'PUT', body: JSON.stringify(data) }),
  delete: () => fetchApi('/api/profile', { method: 'DELETE' }),
}

// Projects API
export const projectsApi = {
  list: () => fetchApi('/api/projects'),
  get: (id: string) => fetchApi(`/api/projects/${id}`),
  create: (data: any) => fetchApi('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi(`/api/projects/${id}`, { method: 'DELETE' }),
}

// Education API
export const educationApi = {
  list: () => fetchApi('/api/education'),
  get: (id: string) => fetchApi(`/api/education/${id}`),
  create: (data: any) => fetchApi('/api/education', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/api/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi(`/api/education/${id}`, { method: 'DELETE' }),
}

// Courses API
export const coursesApi = {
  list: () => fetchApi('/api/courses'),
  get: (id: string) => fetchApi(`/api/courses/${id}`),
  create: (data: any) => fetchApi('/api/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi(`/api/courses/${id}`, { method: 'DELETE' }),
}

// Achievements API
export const achievementsApi = {
  list: () => fetchApi('/api/achievements'),
  get: (id: string) => fetchApi(`/api/achievements/${id}`),
  create: (data: any) => fetchApi('/api/achievements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/api/achievements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi(`/api/achievements/${id}`, { method: 'DELETE' }),
}

// Skills API
export const skillsApi = {
  list: () => fetchApi('/api/skills'),
  get: (id: string) => fetchApi(`/api/skills/${id}`),
  create: (data: any) => fetchApi('/api/skills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/api/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi(`/api/skills/${id}`, { method: 'DELETE' }),
}

// Positions API
export const positionsApi = {
  list: () => fetchApi('/api/positions'),
  get: (id: string) => fetchApi(`/api/positions/${id}`),
  create: (data: any) => fetchApi('/api/positions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/api/positions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi(`/api/positions/${id}`, { method: 'DELETE' }),
}

// Certifications API
export const certificationsApi = {
  list: () => fetchApi('/api/certifications'),
  get: (id: string) => fetchApi(`/api/certifications/${id}`),
  create: (data: any) => fetchApi('/api/certifications', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi(`/api/certifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi(`/api/certifications/${id}`, { method: 'DELETE' }),
}

// Utility to check if user is authenticated with valid token
export function isAuthenticated(): boolean {
  const token = getAuthToken()
  if (!token) return false
  return !isTokenExpired(token)
}

// Utility to manually clear auth and redirect to login
export function logout() {
  clearAuthAndRedirect()
}
