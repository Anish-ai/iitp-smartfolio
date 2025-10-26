"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TemplateSelect } from "@/components/resume-templates"
import { ResumePreview } from "@/components/resume-preview"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  profileApi, 
  projectsApi, 
  educationApi, 
  skillsApi, 
  achievementsApi, 
  positionsApi, 
  certificationsApi, 
  coursesApi 
} from "@/lib/api"
import { Download, Share2, QrCode } from "lucide-react"
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

export default function ResumePage() {
  const [template, setTemplate] = useState("modern")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [positions, setPositions] = useState<PositionOfResponsibility[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const resumeRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [previewScale, setPreviewScale] = useState(1)

  // Base width of the resume in pixels (8.5in at 96dpi)
  const BASE_RESUME_WIDTH_PX = 8.5 * 96 // ~816px

  useEffect(() => {
    fetchAllData()
  }, [])

  // Auto-scale the preview so the full page fits in the visible container width.
  useEffect(() => {
    const updateScale = () => {
      const el = previewContainerRef.current
      if (!el) return
      const containerWidth = el.clientWidth || 0
      if (!containerWidth) return
      const scale = Math.min(1, containerWidth / BASE_RESUME_WIDTH_PX)
      setPreviewScale(scale > 0 ? scale : 1)
    }
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

  const fetchAllData = async () => {
    try {
      const [
        profileData,
        projectsData,
        educationData,
        skillsData,
        achievementsData,
        positionsData,
        certificationsData,
        coursesData,
      ] = await Promise.all([
        profileApi.get().catch(() => null),
        projectsApi.list().catch(() => []),
        educationApi.list().catch(() => []),
        skillsApi.list().catch(() => []),
        achievementsApi.list().catch(() => []),
        positionsApi.list().catch(() => []),
        certificationsApi.list().catch(() => []),
        coursesApi.list().catch(() => []),
      ])

      if (profileData) setProfile(profileData)
      setProjects(projectsData)
      setEducation(educationData)
      setSkills(skillsData)
      setAchievements(achievementsData)
      setPositions(positionsData)
      setCertifications(certificationsData)
      setCourses(coursesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

  // Image download is temporarily disabled in favor of robust server-side PDF generation.
  // If needed, we can add a server route to export a PNG using Puppeteer screenshots.

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Select Template</h2>
              <TemplateSelect selected={template} onSelect={setTemplate} />
            </Card>

            {/* Export Options */}
            <Card className="p-6 space-y-3">
              <h2 className="text-lg font-semibold mb-4">Export Options</h2>
              <Button onClick={downloadPDF} className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <Download size={18} /> Download PDF
              </Button>
              {/* Image export can be added via server-side screenshot if needed */}
              <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <Share2 size={18} /> Share Link
              </Button>
              <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <QrCode size={18} /> QR Code
              </Button>
            </Card>

            {/* Customization */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-4">Customization</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Color Scheme</label>
                <select className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Blue (IITP)</option>
                  <option>Professional</option>
                  <option>Modern</option>
                  <option>Creative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Font</label>
                <select className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Calibri</option>
                  <option>Arial</option>
                  <option>Times New Roman</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[800px]">
                <div ref={previewContainerRef} className="w-full flex justify-center">
                  {/*
                    We render the resume at its natural width (~816px) and scale it down to fit the container.
                    This ensures the entire page is visible without cropping while preserving aspect ratio.
                  */}
                  <div
                    style={{
                      width: `${BASE_RESUME_WIDTH_PX}px`,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <div ref={resumeRef} id="resume-capture">
                      <ResumePreview
                        profile={profile || undefined}
                        projects={projects}
                        education={education}
                        skills={skills}
                        achievements={achievements}
                        positions={positions}
                        certifications={certifications}
                        courses={courses}
                        template={template}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
