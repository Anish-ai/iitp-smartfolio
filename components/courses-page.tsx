"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BulkImportDialog } from "@/components/bulk-import-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { coursesApi } from "@/lib/api"
import type { Course } from "@/lib/db"
import { Trash2, ExternalLink } from "lucide-react"

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    provider: "IIT Patna",
    certificateLink: "",
    completionDate: "",
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const data = await coursesApi.list()
      setCourses(data || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Use "IIT Patna" as default if provider field is empty
      const courseData = {
        ...formData,
        provider: formData.provider.trim() || "IIT Patna"
      }
      await coursesApi.create(courseData)
      setFormData({ title: "", provider: "IIT Patna", certificateLink: "", completionDate: "" })
      await fetchCourses()
    } catch (error) {
      console.error("Error adding course:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    try {
      await coursesApi.delete(courseId)
      await fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const handleBulkImport = async (items: any[]) => {
    const errors: string[] = []
    
    for (const item of items) {
      try {
        await coursesApi.create({
          title: item.title,
          provider: item.provider || "IIT Patna",
          certificateLink: item.certificateLink || null,
          completionDate: item.completionDate,
        })
      } catch (error: any) {
        errors.push(`Failed to import "${item.title}": ${error.message}`)
      }
    }
    
    await fetchCourses()
    
    if (errors.length > 0) {
      throw new Error(`Imported with errors:\n${errors.join('\n')}`)
    }
  }

  const coursesExampleJson = `[
  {
    "title": "Machine Learning Fundamentals",
    "provider": "IIT Patna",
    "certificateLink": "https://certificate.example.com/123",
    "completionDate": "2024-06-15"
  },
  {
    "title": "Advanced React Patterns",
    "provider": "Udemy",
    "certificateLink": "https://udemy.com/cert/456",
    "completionDate": "2024-08-20"
  }
]`

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Courses & Certifications</h1>
            <p className="text-muted-foreground mt-2">Track your online courses and certifications</p>
          </div>
          <BulkImportDialog
            title="Bulk Import Courses"
            description="Import multiple courses at once. Provider defaults to 'IIT Patna' if not specified."
            exampleJson={coursesExampleJson}
            onImport={handleBulkImport}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Add Course</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Course Title</label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., React Advanced Patterns"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Provider</label>
                    <Input
                      type="text"
                      name="provider"
                      value={formData.provider}
                      onChange={handleChange}
                      placeholder="IIT Patna (default)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Leave as "IIT Patna" or change to other providers (Udemy, Coursera, etc.)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Completion Date</label>
                    <Input
                      type="date"
                      name="completionDate"
                      value={formData.completionDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Certificate Link</label>
                    <Input
                      type="url"
                      name="certificateLink"
                      value={formData.certificateLink}
                      onChange={handleChange}
                      placeholder="https://certificate.com"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? "Adding..." : "Add Course"}
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Courses ({courses.length})</h2>
              {courses.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No courses added yet. Start tracking your learning journey!</p>
                </Card>
              ) : (
                courses.map((course) => (
                  <Card key={course.courseId} className="p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.provider}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(course.courseId)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                    <p className="text-sm text-foreground/70 mb-3">
                      {new Date(course.completionDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {course.certificateLink && (
                      <a href={course.certificateLink} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <ExternalLink size={14} /> View Certificate
                        </Button>
                      </a>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-linear-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
              <h3 className="font-semibold mb-4">Course Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Add courses from platforms like Udemy, Coursera, edX</li>
                <li>• Include completion dates for timeline</li>
                <li>• Link to certificates when available</li>
                <li>• Organize by skill category</li>
                <li>• Keep records of all learning activities</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
