// Domain types only; no external DB client (Supabase removed)

export type Profile = {
  userId: string
  azureOid?: string
  name: string
  email: string
  phone?: string
  portfolioWebsite?: string
  githubLink?: string
  linkedinLink?: string
  photoURL?: string
  createdAt: string
  updatedAt: string
}

export type Project = {
  projectId: string
  userId: string
  title: string
  description: string
  techStack: string[]
  projectLink?: string
  githubRepo?: string
  startDate: string
  endDate?: string
}

export type Education = {
  eduId: string
  userId: string
  institute: string
  degree: string
  branch: string
  startYear: number
  endYear?: number
  cgpaOrPercentage: number
}

export type Course = {
  courseId: string
  userId: string
  title: string
  provider: string
  certificateLink?: string
  completionDate: string
}

export type Achievement = {
  achievementId: string
  userId: string
  title: string
  description: string
  date: string
}

export type Skill = {
  skillId: string
  userId: string
  category: string
  skills: Array<{ name: string; level: "Beginner" | "Intermediate" | "Advanced" | "Expert" }>
}

export type PositionOfResponsibility = {
  posId: string
  userId: string
  title: string
  organization: string
  description: string
  startDate: string
  endDate?: string
}

export type Certification = {
  certId: string
  userId: string
  title: string
  description: string
  issuer: string
  issueDate: string
  certificateLink?: string
}
