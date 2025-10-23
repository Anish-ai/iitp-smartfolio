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
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
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

  useEffect(() => {
    fetchAllData()
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
    if (!resumeRef.current) return

    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2 })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${profile?.name || "resume"}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const downloadImage = async () => {
    if (!resumeRef.current) return

    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2 })
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `${profile?.name || "resume"}.png`
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
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
              <Button onClick={downloadImage} className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <Download size={18} /> Download Image
              </Button>
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
              <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[800px] flex justify-center">
                <div ref={resumeRef}>
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
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
