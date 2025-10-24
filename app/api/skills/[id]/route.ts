import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const skill = await prisma.skill.findUnique({ where: { skillId: id } })
    if (!skill) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (skill.userId !== auth.userId) return forbiddenResponse()

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error fetching skill:', error)
    return serverErrorResponse('Failed to fetch skill')
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const existing = await prisma.skill.findUnique({ where: { skillId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    const body = await request.json()
    
    console.log('Updating skill:', id, 'with data:', JSON.stringify(body))
    
    // Only allow updating category and skills fields
    const updateData: { category?: string; skills?: any } = {}
    if (body.category !== undefined) updateData.category = body.category
    if (body.skills !== undefined) updateData.skills = body.skills

    const skill = await prisma.skill.update({ 
      where: { skillId: id }, 
      data: updateData 
    })
    
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error updating skill:', error)
    return serverErrorResponse('Failed to update skill')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const existing = await prisma.skill.findUnique({ where: { skillId: id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.userId !== auth.userId) return forbiddenResponse()

    await prisma.skill.delete({ where: { skillId: id } })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return serverErrorResponse('Failed to delete skill')
  }
}
