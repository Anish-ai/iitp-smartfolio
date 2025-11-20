"use client"

import { useState, useEffect, use } from "react"
import { ResumePreview } from "@/components/resume-preview"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
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

interface PublicResumeData extends Profile {
    projects: Project[]
    education: Education[]
    skills: Skill[]
    achievements: Achievement[]
    positions: PositionOfResponsibility[]
    certifications: Certification[]
    courses: Course[]
}

export default function PublicResumePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params)
    const [data, setData] = useState<PublicResumeData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/public/resume/${username}`)
                if (!res.ok) {
                    throw new Error(res.status === 404 ? "Resume not found" : "Failed to load resume")
                }
                const jsonData = await res.json()
                setData(jsonData)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [username])

    const downloadPDF = async () => {
        if (!data) return
        try {
            const res = await fetch('/api/resume/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: data,
                    projects: data.projects,
                    education: data.education,
                    skills: data.skills,
                    achievements: data.achievements,
                    positions: data.positions,
                    certifications: data.certifications,
                    courses: data.courses,
                    template: 'modern', // Default or could be part of query param
                    pageSize: 'Letter',
                    fileName: data.name || 'resume',
                }),
            })
            if (!res.ok) throw new Error('Download failed')

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${data.name || 'resume'}.pdf`
            a.click()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading PDF:', error)
            alert('Failed to download PDF')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
                <p className="text-gray-600">{error || "Resume not found"}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header / Actions */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{data.name}'s Resume</h1>
                        <p className="text-sm text-gray-500">Powered by SmartFolio</p>
                    </div>
                    <Button onClick={downloadPDF} className="gap-2">
                        <Download size={16} /> Download PDF
                    </Button>
                </div>

                {/* Resume Preview */}
                <div className="flex justify-center">
                    <div className="bg-white shadow-xl">
                        <ResumePreview
                            profile={data}
                            projects={data.projects}
                            education={data.education}
                            skills={data.skills}
                            achievements={data.achievements}
                            positions={data.positions}
                            certifications={data.certifications}
                            courses={data.courses}
                            template="modern" // Could make this dynamic later
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
