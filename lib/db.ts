import { PrismaClient } from '@prisma/client'

// Prisma client singleton pattern for Next.js
// Prevents multiple instances in development with hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Domain types for the application
export type Profile = {
  userId: string
  name: string
  email: string
  rollNumber?: string | null
  admissionYear?: number | null
  degree?: string | null
  branch?: string | null
  phone?: string | null
  portfolioWebsite?: string | null
  githubLink?: string | null
  linkedinLink?: string | null
  photoURL?: string | null
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export type Project = {
  projectId: string
  userId: string
  title: string
  description: string
  techStack: string[]
  projectLink?: string | null
  githubRepo?: string | null
  startDate: Date
  endDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Education = {
  eduId: string
  userId: string
  institute: string
  degree: string
  branch: string
  startYear: number
  endYear?: number | null
  cgpaOrPercentage: number
  createdAt: Date
  updatedAt: Date
}

export type Course = {
  courseId: string
  userId: string
  title: string
  provider: string
  certificateLink?: string | null
  completionDate: Date
  createdAt: Date
  updatedAt: Date
}

export type Achievement = {
  achievementId: string
  userId: string
  title: string
  description: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export type Skill = {
  skillId: string
  userId: string
  category: string
  skills: any // JSON field containing array of { name: string; level: string }
  createdAt: Date
  updatedAt: Date
}

export type PositionOfResponsibility = {
  posId: string
  userId: string
  title: string
  organization: string
  description?: string | null
  startDate: Date
  endDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Certification = {
  certId: string
  userId: string
  title: string
  description?: string | null
  issuer: string
  issueDate: Date
  certificateLink?: string | null
  createdAt: Date
  updatedAt: Date
}
