import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const position = await prisma.positionOfResponsibility.findUnique({ where: { posId: id } })
    if (!position) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (position.userId !== auth.userId) return forbiddenResponse()

    return NextResponse.json(position)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const existing = await prisma.positionOfResponsibility.findUnique({ where: { posId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    const body = await request.json()
    const { posId, userId, createdAt, ...updateData } = body
    
    // Convert date strings to Date objects, handle empty strings as null
    if (updateData.startDate) {
      updateData.startDate = updateData.startDate ? new Date(updateData.startDate) : null
    }
    if (updateData.endDate !== undefined) {
      updateData.endDate = updateData.endDate && updateData.endDate.trim() !== '' 
        ? new Date(updateData.endDate) 
        : null
    }

    const position = await prisma.positionOfResponsibility.update({ where: { posId: id }, data: updateData })
    return NextResponse.json(position)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const existing = await prisma.positionOfResponsibility.findUnique({ where: { posId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    await prisma.positionOfResponsibility.delete({ where: { posId: id } })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return serverErrorResponse()
  }
}
