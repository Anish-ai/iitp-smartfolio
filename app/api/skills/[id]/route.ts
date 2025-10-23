import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const skill = await prisma.skill.findUnique({ where: { skillId: params.id } })
    if (!skill) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (skill.userId !== auth.userId) return forbiddenResponse()

    return NextResponse.json(skill)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const existing = await prisma.skill.findUnique({ where: { skillId: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    const body = await request.json()
    const { skillId, userId, createdAt, ...updateData } = body

    const skill = await prisma.skill.update({ where: { skillId: params.id }, data: updateData })
    return NextResponse.json(skill)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const existing = await prisma.skill.findUnique({ where: { skillId: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    await prisma.skill.delete({ where: { skillId: params.id } })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return serverErrorResponse()
  }
}
