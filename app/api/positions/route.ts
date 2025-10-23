import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, badRequestResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const positions = await prisma.positionOfResponsibility.findMany({
      where: { userId: auth.userId },
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json(positions)
  } catch (error) {
    return serverErrorResponse('Failed to fetch positions')
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const body = await request.json()

    if (!body.title || !body.organization || !body.startDate) {
      return badRequestResponse('Missing required fields')
    }

    const position = await prisma.positionOfResponsibility.create({
      data: {
        userId: auth.userId!,
        title: body.title,
        organization: body.organization,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    })

    return NextResponse.json(position, { status: 201 })
  } catch (error) {
    return serverErrorResponse('Failed to create position')
  }
}
