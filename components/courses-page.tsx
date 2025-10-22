"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/auth"
import type { Course } from "@/lib/db"
import { Trash2, ExternalLink } from "lucide-react"

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    certificateLink: "",
    completionDate: "",
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("userId", user.id)
        .order("completionDate", { ascending: false })

      if (error) throw error
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
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("courses").insert([{ ...formData, userId: user.id }])

      if (error) throw error
      setFormData({ title: "", provider: "", certificateLink: "", completionDate: "" })
      await fetchCourses()
    } catch (error) {
      console.error("Error adding course:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("courses").delete().eq("courseId", courseId)

      if (error) throw error
      await fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Courses & Certifications</h1>
          <p className="text-muted-foreground mt-2">Track your online courses and certifications</p>
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
                      placeholder="e.g., Udemy, Coursera"
                      required
                    />
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
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
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
