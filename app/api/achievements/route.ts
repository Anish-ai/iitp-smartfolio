import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, badRequestResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const achievements = await prisma.achievement.findMany({
      where: { userId: auth.userId },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(achievements)
  } catch (error) {
    return serverErrorResponse('Failed to fetch achievements')
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const body = await request.json()

    if (!body.title || !body.description || !body.date) {
      return badRequestResponse('Missing required fields')
    }

    const achievement = await prisma.achievement.create({
      data: {
        userId: auth.userId!,
        title: body.title,
        description: body.description,
        date: new Date(body.date),
      },
    })

    return NextResponse.json(achievement, { status: 201 })
  } catch (error) {
    return serverErrorResponse('Failed to create achievement')
  }
}
