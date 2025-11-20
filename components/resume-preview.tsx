"use client"

import type {
  Profile,
  Project,
  Education,
  Skill,
  Achievement,
  PositionOfResponsibility,
  Certification,
  Course,
} from "@/lib/db"

interface ResumePreviewProps {
  profile?: Profile
  projects: Project[]
  education: Education[]
  skills: Skill[]
  achievements: Achievement[]
  positions: PositionOfResponsibility[]
  certifications: Certification[]
  courses: Course[]
  template: string
}

export function ResumePreview({
  profile,
  projects,
  education,
  skills,
  achievements,
  positions,
  certifications,
  courses,
  template,
}: ResumePreviewProps) {
  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-lg" style={{ width: "8.5in", minHeight: "11in" }}>
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{profile?.name || "Your Name"}</h1>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          {profile?.email && <span>{profile.email}</span>}
          {profile?.phone && <span>{profile.phone}</span>}
          {profile?.linkedinLink && (
            <a href={profile.linkedinLink} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {profile?.githubLink && (
            <a href={profile.githubLink} className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {profile?.portfolioWebsite && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 mb-2">Portfolio</h2>
          <a href={profile.portfolioWebsite} className="text-blue-600 hover:underline text-sm">
            {profile.portfolioWebsite}
          </a>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 mb-3">Education</h2>
          {education.map((edu) => (
            <div key={edu.eduId} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">
                  {edu.degree} in {edu.branch}
                </span>
                <span className="text-sm text-gray-600">
                  {edu.startYear} - {edu.endYear || "Present"}
                </span>
              </div>
              <p className="text-sm text-gray-700">{edu.institute}</p>
              <p className="text-sm text-gray-600">CGPA: {edu.cgpaOrPercentage}</p>
            </div>
          ))}
        </div>
      )}

      {/* Experience / Positions */}
      {positions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 mb-3">Positions of Responsibility</h2>
          {positions.map((pos) => (
            <div key={pos.posId} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{pos.title}</span>
                <span className="text-sm text-gray-600">
                  {new Date(pos.startDate).getFullYear()} -{" "}
                  {pos.endDate ? new Date(pos.endDate).getFullYear() : "Present"}
                </span>
              </div>
              <p className="text-sm text-gray-700">{pos.organization}</p>
              {pos.description && <p className="text-sm text-gray-600 whitespace-pre-line">{pos.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 mb-3">Projects</h2>
          {projects.slice(0, 3).map((proj) => (
            <div key={proj.projectId} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{proj.title}</span>
                <span className="text-sm text-gray-600">
                  {new Date(proj.startDate).getFullYear()}
                  {proj.endDate ? ` - ${new Date(proj.endDate).getFullYear()}` : ""}
                </span>
              </div>
              {proj.description && <p className="text-sm text-gray-600 whitespace-pre-line">{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Tech:</strong> {proj.techStack.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 mb-3">Skills</h2>
          {skills.map((skillGroup) => (
            <div key={skillGroup.skillId} className="mb-2">
              <span className="font-semibold text-sm">{skillGroup.category}:</span>
              <p className="text-sm text-gray-700">{skillGroup.skills.map((s: { name: string }) => s.name).join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-600 mb-3">Achievements</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            {achievements.slice(0, 5).map((ach) => (
              <li key={ach.achievementId} className="flex gap-2">
                <span>•</span>
                <span>{ach.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-blue-600 mb-3">Certifications</h2>
          {certifications.slice(0, 3).map((cert) => (
            <div key={cert.certId} className="mb-2 text-sm">
              <span className="font-semibold">{cert.title}</span>
              <p className="text-gray-600">{cert.issuer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
