"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ResumePreview } from "@/components/resume-preview"
import { ShareResumeDialog } from "@/components/share-resume-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  useProfile,
  useProjects,
  useEducation,
  useSkills,
  useAchievements,
  usePositions,
  useCertifications,
  useCourses
} from "@/lib/hooks"
import { Download } from "lucide-react"

export default function ResumePage() {
  const [template, setTemplate] = useState("modern")

  // Use SWR hooks for data fetching
  const { profile, isLoading: isProfileLoading } = useProfile()
  const { projects, isLoading: isProjectsLoading } = useProjects()
  const { education, isLoading: isEducationLoading } = useEducation()
  const { skills, isLoading: isSkillsLoading } = useSkills()
  const { achievements, isLoading: isAchievementsLoading } = useAchievements()
  const { positions, isLoading: isPositionsLoading } = usePositions()
  const { certifications, isLoading: isCertificationsLoading } = useCertifications()
  const { courses, isLoading: isCoursesLoading } = useCourses()

  const isLoading = isProfileLoading || isProjectsLoading || isEducationLoading || isSkillsLoading || isAchievementsLoading || isPositionsLoading || isCertificationsLoading || isCoursesLoading

  const resumeRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [previewScale, setPreviewScale] = useState(1)
  const [resumeHeight, setResumeHeight] = useState(0)

  // Base width of the resume in pixels (8.5in at 96dpi)
  const BASE_RESUME_WIDTH_PX = 8.5 * 96 // ~816px

  // Monitor resume height changes
  useEffect(() => {
    if (!resumeRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setResumeHeight(entry.contentRect.height)
      }
    })

    observer.observe(resumeRef.current)
    return () => observer.disconnect()
  }, [isLoading])

  // Auto-scale the preview so the full page fits in the visible container width.
  useEffect(() => {
    const updateScale = () => {
      const el = previewContainerRef.current
      if (!el) return
      const containerWidth = el.clientWidth || 0
      if (!containerWidth) return

      // Add a small buffer for padding
      const scale = Math.min(1, (containerWidth - 32) / BASE_RESUME_WIDTH_PX)
      setPreviewScale(scale > 0 ? scale : 1)
    }

    // Initial update
    updateScale()

    // Update on resize
    window.addEventListener("resize", updateScale)

    // Also update when container size might change (e.g. sidebar toggle)
    const observer = new ResizeObserver(updateScale)
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current)
    }

    return () => {
      window.removeEventListener("resize", updateScale)
      observer.disconnect()
    }
  }, [])

  const downloadPDF = async () => {
    try {
      const res = await fetch('/api/resume/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          projects,
          education,
          skills,
          achievements,
          positions,
          certifications,
          courses,
          template,
          pageSize: 'Letter',
          fileName: profile?.name || 'resume',
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${profile?.name || 'resume'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Generate Resume/Portfolio</h1>
          <p className="text-muted-foreground mt-2">Create a professional resume from your portfolio data</p>
        </div>

        {/* Centered Preview */}
        <div className="flex justify-center">
          <Card className="p-6 w-full max-w-5xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              <div className="flex gap-2">
                <Button onClick={downloadPDF} size="sm" variant="outline">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
                {profile?.userId && (
                  <ShareResumeDialog username={profile.userId} name={profile.name} />
                )}
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg overflow-hidden flex flex-col items-center">
              <div ref={previewContainerRef} className="w-full flex justify-center overflow-hidden">
                <div
                  style={{
                    width: BASE_RESUME_WIDTH_PX * previewScale,
                    height: ((resumeHeight || 1056) * previewScale),
                    position: 'relative',
                    transition: 'width 0.2s, height 0.2s'
                  }}
                >
                  <div
                    style={{
                      width: `${BASE_RESUME_WIDTH_PX}px`,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  >
                    <div ref={resumeRef} id="resume-capture">
                      <ResumePreview
                        profile={profile || undefined}
                        projects={projects || []}
                        education={education || []}
                        skills={skills || []}
                        achievements={achievements || []}
                        positions={positions || []}
                        certifications={certifications || []}
                        courses={courses || []}
                        template={template}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
