# IITP Smartfolio – Data Structures & Payloads

This document lists every section in the dashboard and the exact fields they accept in the UI (create/update), along with the underlying database model. Use it as a reference for API payloads and bulk-import formats.

Notes
- Dates are ISO strings in requests (YYYY-MM-DD); the database stores Date objects.
- Optional means the field can be omitted or sent as null/empty depending on context.
- IDs, userId, createdAt, updatedAt are server-managed.

## Profile

DB Model (lib/db.ts)
- userId: string
- name: string
- email: string
- rollNumber?: string | null
- admissionYear?: number | null
- degree?: string | null
- branch?: string | null
- phone?: string | null
- portfolioWebsite?: string | null
- githubLink?: string | null
- linkedinLink?: string | null
- photoURL?: string | null
- verified: boolean
- createdAt: Date
- updatedAt: Date

UI Create/Update (components/profile-form.tsx)
- name: string (required)
- email: string (required, disabled in UI; server trusted)
- phone?: string
- portfolioWebsite?: string (URL)
- githubLink?: string (URL)
- linkedinLink?: string (URL)

Example (update)
{
  "name": "John Doe",
  "email": "john@iitp.ac.in",
  "phone": "+91 98765 43210",
  "portfolioWebsite": "https://johndoe.dev",
  "githubLink": "https://github.com/johndoe",
  "linkedinLink": "https://www.linkedin.com/in/johndoe"
}

## Projects

DB Model
- projectId: string
- userId: string
- title: string
- description: string
- techStack: string[]
- projectLink?: string | null
- githubRepo?: string | null
- startDate: Date
- endDate?: Date | null
- createdAt: Date
- updatedAt: Date

UI Create/Update (components/project-form.tsx & project-edit-dialog.tsx)
- title: string (required)
- description?: string
- techStack: string[] (can be empty on create, added via tag input)
- projectLink?: string (URL)
- githubRepo?: string (URL)
- startDate: string (YYYY-MM-DD, required)
- endDate?: string (YYYY-MM-DD)

Example (create)
{
  "title": "E-commerce Platform",
  "description": "Full-stack app for online retail",
  "techStack": ["Next.js", "Prisma", "PostgreSQL"],
  "projectLink": "https://shop.example.com",
  "githubRepo": "https://github.com/you/shop",
  "startDate": "2024-01-10",
  "endDate": null
}

## Education

DB Model
- eduId: string
- userId: string
- institute: string
- degree: string
- branch: string
- startYear: number
- endYear?: number | null
- cgpaOrPercentage: number
- createdAt: Date
- updatedAt: Date

UI Create/Update (components/education-form.tsx & education-edit-dialog.tsx)
- institute: string (UI defaults to "IIT Patna")
- degree: string (required; e.g., B.Tech | M.Tech | PhD)
- branch: string (required; e.g., Computer Science, Electronics, ...)
- startYear: number (required)
- endYear: number (required; can be future year; represents expected end if ongoing)
- cgpaOrPercentage: number (required; 0–10 scale assumed by UI)

Example (create)
{
  "institute": "IIT Patna",
  "degree": "B.Tech",
  "branch": "Computer Science",
  "startYear": 2022,
  "endYear": 2026,
  "cgpaOrPercentage": 8.65
}

## Courses

DB Model
- courseId: string
- userId: string
- title: string
- provider: string
- certificateLink?: string | null
- completionDate: Date
- createdAt: Date
- updatedAt: Date

UI Create/Update (components/courses-page.tsx & course-edit-dialog.tsx)
- title: string (required)
- provider: string (optional in UI; defaults to "IIT Patna" if blank)
- certificateLink?: string (URL)
- completionDate: string (YYYY-MM-DD, required)

Example (create)
{
  "title": "Advanced React Patterns",
  "provider": "Udemy",
  "certificateLink": "https://udemy.com/cert/456",
  "completionDate": "2024-08-20"
}

Bulk import (array)
[
  {
    "title": "Machine Learning Fundamentals",
    "provider": "IIT Patna",
    "certificateLink": "https://certificate.example.com/123",
    "completionDate": "2024-06-15"
  }
]

## Achievements

DB Model
- achievementId: string
- userId: string
- title: string
- description: string
- date: Date
- createdAt: Date
- updatedAt: Date

UI Create/Update (components/achievement-form.tsx & achievement-edit-dialog.tsx)
- title: string (required)
- description?: string
- date: string (YYYY-MM-DD, required)

Example (create)
{
  "title": "Hackathon Winner",
  "description": "Won IITP Hackathon 2024",
  "date": "2024-03-12"
}

## Skills

DB Model
- skillId: string
- userId: string
- category: string
- skills: JSON (array of objects)
  - name: string
  - level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
- createdAt: Date
- updatedAt: Date

UI Create (components/skills-form.tsx)
- category: string (required) – either new category or one selected from existing
- skills: Array<{ name: string; level: string }> (at least 1)

UI Update (components/skill-edit-dialog.tsx)
- skills: Array<{ name: string; level: string }> – if array becomes empty, the category is deleted

Example (create)
{
  "category": "Web Development",
  "skills": [
    { "name": "React", "level": "Advanced" },
    { "name": "Next.js", "level": "Intermediate" }
  ]
}

Bulk import (array)
[
  {
    "category": "Programming Languages",
    "skills": [
      { "name": "Python", "level": "Advanced" },
      { "name": "JavaScript", "level": "Intermediate" }
    ]
  }
]

## Positions of Responsibility

DB Model
- posId: string
- userId: string
- title: string
- organization: string
- description?: string | null
- startDate: Date
- endDate?: Date | null
- createdAt: Date
- updatedAt: Date

UI Create/Update (app/dashboard/positions/page.tsx & position-edit-dialog.tsx)
- title: string (required)
- organization: string (required)
- description?: string
- startDate: string (YYYY-MM-DD, required)
- endDate?: string (YYYY-MM-DD | null)

Example (create)
{
  "title": "Technical Secretary",
  "organization": "Robotics Club, IIT Patna",
  "description": "Led team of 20 students, organized workshops",
  "startDate": "2023-08-01",
  "endDate": "2024-07-31"
}

Bulk import (array)
[
  {
    "title": "Core Team Member",
    "organization": "Entrepreneurship Cell",
    "description": "Organized startup events",
    "startDate": "2024-01-15",
    "endDate": null
  }
]

## Certifications (API-ready; UI may be pending)

DB Model
- certId: string
- userId: string
- title: string
- description?: string | null
- issuer: string
- issueDate: Date
- certificateLink?: string | null
- createdAt: Date
- updatedAt: Date

Suggested Create payload
{
  "title": "Kubernetes Administrator",
  "description": "CKA cert",
  "issuer": "CNCF",
  "issueDate": "2024-10-01",
  "certificateLink": "https://certs.example/cka"
}

## API Endpoints (client usage)

Clients use lib/api.ts. All endpoints are authenticated and accept/return JSON.
- Profile: /api/profile [GET, POST, PUT, DELETE]
- Projects: /api/projects [GET, POST]; /api/projects/:id [GET, PUT, DELETE]
- Education: /api/education [GET, POST]; /api/education/:id [GET, PUT, DELETE]
- Courses: /api/courses [GET, POST]; /api/courses/:id [GET, PUT, DELETE]
- Achievements: /api/achievements [GET, POST]; /api/achievements/:id [GET, PUT, DELETE]
- Skills: /api/skills [GET, POST]; /api/skills/:id [GET, PUT, DELETE]
- Positions: /api/positions [GET, POST]; /api/positions/:id [GET, PUT, DELETE]
- Certifications: /api/certifications [GET, POST]; /api/certifications/:id [GET, PUT, DELETE]

Auth
- Bearer token in Authorization header (managed by client); token expiry triggers redirect to /login.

## Conventions & Validation

- Dates must be valid ISO strings; the UI uses HTML date inputs.
- Numeric fields (cgpaOrPercentage, years) are parsed as numbers in the UI before submission.
- Optional links (projectLink, githubRepo, certificateLink) can be omitted or sent as empty; server may coerce to null.
- Skills levels must be one of: Beginner, Intermediate, Advanced, Expert.
- In Skills edit, saving with an empty skills[] deletes the category.
