import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const education = await prisma.education.findUnique({ where: { eduId: id } })
    if (!education) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (education.userId !== auth.userId) return forbiddenResponse()

    return NextResponse.json(education)
  } catch (error) {
    return serverErrorResponse('Failed to fetch education')
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const existing = await prisma.education.findUnique({ where: { eduId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    const body = await request.json()
    const { eduId, userId, createdAt, ...updateData } = body

    // Convert numeric fields from strings to numbers
    if (updateData.cgpaOrPercentage) {
      updateData.cgpaOrPercentage = parseFloat(updateData.cgpaOrPercentage)
    }
    if (updateData.startYear) {
      updateData.startYear = parseInt(updateData.startYear, 10)
    }
    if (updateData.endYear) {
      updateData.endYear = parseInt(updateData.endYear, 10)
    }

    const education = await prisma.education.update({
      where: { eduId: id },
      data: updateData,
    })

    return NextResponse.json(education)
  } catch (error) {
    return serverErrorResponse('Failed to update education')
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const { id } = await params
    const existing = await prisma.education.findUnique({ where: { eduId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    await prisma.education.delete({ where: { eduId: id } })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return serverErrorResponse('Failed to delete education')
  }
}
