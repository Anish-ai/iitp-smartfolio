import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const certification = await prisma.certification.findUnique({ where: { certId: params.id } })
    if (!certification) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (certification.userId !== auth.userId) return forbiddenResponse()

    return NextResponse.json(certification)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const existing = await prisma.certification.findUnique({ where: { certId: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    const body = await request.json()
    const { certId, userId, createdAt, ...updateData } = body
    if (updateData.issueDate) updateData.issueDate = new Date(updateData.issueDate)

    const certification = await prisma.certification.update({ where: { certId: params.id }, data: updateData })
    return NextResponse.json(certification)
  } catch (error) {
    return serverErrorResponse()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const existing = await prisma.certification.findUnique({ where: { certId: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    await prisma.certification.delete({ where: { certId: params.id } })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return serverErrorResponse()
  }
}
