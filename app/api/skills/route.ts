import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, unauthorizedResponse, serverErrorResponse, badRequestResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const skills = await prisma.skill.findMany({
      where: { userId: auth.userId },
      orderBy: { category: 'asc' },
    })

    return NextResponse.json(skills)
  } catch (error) {
    return serverErrorResponse('Failed to fetch skills')
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.authenticated) return unauthorizedResponse(auth.error)

    const body = await request.json()

    if (!body.category || !body.skills) {
      return badRequestResponse('Missing required fields')
    }

    // Check if a skill category with this name already exists for this user
    const existingSkill = await prisma.skill.findFirst({
      where: {
        userId: auth.userId!,
        category: body.category,
      },
    })

    if (existingSkill) {
      // Merge new skills with existing skills
      const updatedSkill = await prisma.skill.update({
        where: { skillId: existingSkill.skillId },
        data: {
          skills: [...existingSkill.skills, ...body.skills],
        },
      })
      return NextResponse.json(updatedSkill, { status: 200 })
    }

    // Create new category
    const skill = await prisma.skill.create({
      data: {
        userId: auth.userId!,
        category: body.category,
        skills: body.skills,
      },
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    return serverErrorResponse('Failed to create skill')
  }
}
