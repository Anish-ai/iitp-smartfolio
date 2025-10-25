import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const achievement = await prisma.achievement.findUnique({ where: { achievementId: id } })
    if (!achievement) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (achievement.userId !== auth.userId) return forbiddenResponse()

    return NextResponse.json(achievement)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const existing = await prisma.achievement.findUnique({ where: { achievementId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    const body = await request.json()
    const { achievementId, userId, createdAt, ...updateData } = body
    if (updateData.date) updateData.date = new Date(updateData.date)

    const achievement = await prisma.achievement.update({ where: { achievementId: id }, data: updateData })
    return NextResponse.json(achievement)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const existing = await prisma.achievement.findUnique({ where: { achievementId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    await prisma.achievement.delete({ where: { achievementId: id } })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return serverErrorResponse()
  }
}
