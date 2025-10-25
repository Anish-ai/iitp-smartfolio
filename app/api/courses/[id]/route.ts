import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const course = await prisma.course.findUnique({ where: { courseId: id } })
    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (course.userId !== auth.userId) return forbiddenResponse()

    return NextResponse.json(course)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const existing = await prisma.course.findUnique({ where: { courseId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    const body = await request.json()
    const { courseId, userId, createdAt, ...updateData } = body
    if (updateData.completionDate) updateData.completionDate = new Date(updateData.completionDate)

    const course = await prisma.course.update({ where: { courseId: id }, data: updateData })
    return NextResponse.json(course)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const existing = await prisma.course.findUnique({ where: { courseId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    await prisma.course.delete({ where: { courseId: id } })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return serverErrorResponse()
  }
}
