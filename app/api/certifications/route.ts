import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, badRequestResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const certifications = await prisma.certification.findMany({
      where: { userId: auth.userId },
      orderBy: { issueDate: 'desc' },
    })

    return NextResponse.json(certifications)
  } catch (error) {
    return serverErrorResponse('Failed to fetch certifications')
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const body = await request.json()

    if (!body.title || !body.issuer || !body.issueDate) {
      return badRequestResponse('Missing required fields')
    }

    const certification = await prisma.certification.create({
      data: {
        userId: auth.userId!,
        title: body.title,
        description: body.description,
        issuer: body.issuer,
        issueDate: new Date(body.issueDate),
        certificateLink: body.certificateLink,
      },
    })

    return NextResponse.json(certification, { status: 201 })
  } catch (error) {
    return serverErrorResponse('Failed to create certification')
  }
}
