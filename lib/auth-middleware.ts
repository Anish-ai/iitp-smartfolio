import { NextRequest, NextResponse } from 'next/server'

// Simple JWT decoder (for verification, we trust the IITP gateway signature)
function decodeJWT(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    const decoded = Buffer.from(payload, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export interface AuthenticatedRequest extends NextRequest {
  userId?: string
  userEmail?: string
}

/**
 * Authentication middleware for API routes
 * Extracts and validates JWT token from Authorization header
 * Sets userId on the request for downstream use
 */
export async function authenticate(
  request: NextRequest
): Promise<{ authenticated: boolean; userId?: string; userEmail?: string; error?: string }> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, error: 'Missing or invalid Authorization header' }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Decode JWT
    const decoded = decodeJWT(token)
    if (!decoded) {
      return { authenticated: false, error: 'Invalid token format' }
    }

    // Check expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return { authenticated: false, error: 'Token expired' }
    }

    // Extract user info
    // IITP Auth Gateway uses rollNumber as primary ID, fallback to email
    const userId = decoded.rollNumber || decoded.userId || decoded.id || decoded.sub || decoded.email
    const userEmail = decoded.email

    if (!userId) {
      return { authenticated: false, error: 'Missing userId in token' }
    }

    return {
      authenticated: true,
      userId,
      userEmail,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { authenticated: false, error: 'Authentication failed' }
  }
}

/**
 * Middleware wrapper for API routes
 * Usage:
 * 
 * export async function GET(request: NextRequest) {
 *   const auth = await withAuth(request)
 *   if (!auth.authenticated) {
 *     return NextResponse.json({ error: auth.error }, { status: 401 })
 *   }
 *   
 *   // Use auth.userId to query database
 *   const data = await prisma.profile.findUnique({ where: { userId: auth.userId } })
 *   return NextResponse.json(data)
 * }
 */
export async function withAuth(request: NextRequest) {
  return authenticate(request)
}

/**
 * Helper to create standardized error responses
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

export function forbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}

export function badRequestResponse(message: string = 'Bad Request') {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  )
}

export function serverErrorResponse(message: string = 'Internal Server Error') {
  return NextResponse.json(
    { error: message },
    { status: 500 }
  )
}
