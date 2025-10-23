import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, forbiddenResponse } from '@/lib/auth-middleware'

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    const project = await prisma.project.findUnique({
      where: { projectId: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Ensure user owns this project
    if (project.userId !== auth.userId) {
      return forbiddenResponse('You do not have permission to access this project')
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return serverErrorResponse('Failed to fetch project')
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    // Verify ownership
    const existing = await prisma.project.findUnique({
      where: { projectId: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (existing.userId !== auth.userId) {
      return forbiddenResponse('You do not have permission to update this project')
    }

    const body = await request.json()
    const { projectId, userId, createdAt, ...updateData } = body

    // Convert date strings to Date objects
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate)
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate)

    const project = await prisma.project.update({
      where: { projectId: params.id },
      data: updateData,
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return serverErrorResponse('Failed to update project')
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    // Verify ownership
    const existing = await prisma.project.findUnique({
      where: { projectId: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (existing.userId !== auth.userId) {
      return forbiddenResponse('You do not have permission to delete this project')
    }

    await prisma.project.delete({
      where: { projectId: params.id },
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return serverErrorResponse('Failed to delete project')
  }
}
