import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, badRequestResponse } from '@/lib/auth-middleware'

// GET /api/projects - Get all projects for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    const projects = await prisma.project.findMany({
      where: { userId: auth.userId },
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return serverErrorResponse('Failed to fetch projects')
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error)
    }

    const body = await request.json()

    // Validation
    if (!body.title || !body.description || !body.techStack || !body.startDate) {
      return badRequestResponse('Missing required fields: title, description, techStack, startDate')
    }

    const project = await prisma.project.create({
      data: {
        userId: auth.userId!,
        title: body.title,
        description: body.description,
        techStack: body.techStack,
        projectLink: body.projectLink,
        githubRepo: body.githubRepo,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return serverErrorResponse('Failed to create project')
  }
}
