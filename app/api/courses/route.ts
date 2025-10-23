import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, badRequestResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const courses = await prisma.course.findMany({
      where: { userId: auth.userId },
      orderBy: { completionDate: 'desc' },
    })

    return NextResponse.json(courses)
  } catch (error) {
    return serverErrorResponse('Failed to fetch courses')
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const body = await request.json()

    if (!body.title || !body.provider || !body.completionDate) {
      return badRequestResponse('Missing required fields')
    }

    const course = await prisma.course.create({
      data: {
        userId: auth.userId!,
        title: body.title,
        provider: body.provider,
        certificateLink: body.certificateLink,
        completionDate: new Date(body.completionDate),
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    return serverErrorResponse('Failed to create course')
  }
}
