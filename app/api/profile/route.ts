import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse } from '@/lib/auth-middleware'

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: auth.userId },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return serverErrorResponse('Failed to fetch profile')
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    const body = await request.json()
    
    // Remove fields that shouldn't be updated directly
    const { userId, createdAt, ...updateData } = body

    const profile = await prisma.profile.update({
      where: { userId: auth.userId },
      data: updateData,
    })

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Error updating profile:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    return serverErrorResponse('Failed to update profile')
  }
}

// POST /api/profile - Create user profile (called on first login)
export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    const body = await request.json()
    
    // Check if profile already exists
    const existing = await prisma.profile.findUnique({
      where: { userId: auth.userId },
    })

    if (existing) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 })
    }

    const profile = await prisma.profile.create({
      data: {
        userId: auth.userId!,
        email: auth.userEmail!,
        name: body.name || auth.userEmail!.split('@')[0],
        rollNumber: body.rollNumber,
        admissionYear: body.admissionYear,
        degree: body.degree,
        branch: body.branch,
        phone: body.phone,
        portfolioWebsite: body.portfolioWebsite,
        githubLink: body.githubLink,
        linkedinLink: body.linkedinLink,
        photoURL: body.photoURL,
        verified: body.verified || false,
      },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error: any) {
    console.error('Error creating profile:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }
    
    return serverErrorResponse('Failed to create profile')
  }
}

// DELETE /api/profile - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    await prisma.profile.delete({
      where: { userId: auth.userId },
    })

    return NextResponse.json({ message: 'Profile deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting profile:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    return serverErrorResponse('Failed to delete profile')
  }
}
