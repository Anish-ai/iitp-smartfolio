import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, badRequestResponse } from '@/lib/auth-middleware'

// GET /api/education - Get all education records
export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    const education = await prisma.education.findMany({
      where: { userId: auth.userId },
      orderBy: { startYear: 'desc' },
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    return serverErrorResponse('Failed to fetch education')
  }
}

// POST /api/education - Create a new education record
export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    const body = await request.json()

    if (!body.institute || !body.degree || !body.branch || !body.startYear || body.cgpaOrPercentage === undefined) {
      return badRequestResponse('Missing required fields')
    }

    const education = await prisma.education.create({
      data: {
        userId: auth.userId!,
        institute: body.institute,
        degree: body.degree,
        branch: body.branch,
        startYear: body.startYear,
        endYear: body.endYear,
        cgpaOrPercentage: body.cgpaOrPercentage,
      },
    })

    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error('Error creating education:', error)
    return serverErrorResponse('Failed to create education record')
  }
}
