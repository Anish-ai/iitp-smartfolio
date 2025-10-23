import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const education = await prisma.education.findUnique({ where: { eduId: params.id } })
    if (!education) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (education.userId !== auth.userId) return forbiddenResponse()

    return NextResponse.json(education)
  } catch (error) {
    return serverErrorResponse('Failed to fetch education')
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const existing = await prisma.education.findUnique({ where: { eduId: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    const body = await request.json()
    const { eduId, userId, createdAt, ...updateData } = body

    const education = await prisma.education.update({
      where: { eduId: params.id },
      data: updateData,
    })

    return NextResponse.json(education)
  } catch (error) {
    return serverErrorResponse('Failed to update education')
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const existing = await prisma.education.findUnique({ where: { eduId: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    await prisma.education.delete({ where: { eduId: params.id } })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return serverErrorResponse('Failed to delete education')
  }
}
