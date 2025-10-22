"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProjectForm } from "@/components/project-form"
import { ProjectCard } from "@/components/project-card"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/auth"
import type { Project } from "@/lib/db"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("userId", user.id)
        .order("startDate", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("projects").insert([{ ...data, userId: user.id }])

      if (error) throw error
      await fetchProjects()
    } catch (error) {
      console.error("Error adding project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("projects").delete().eq("projectId", projectId)

      if (error) throw error
      await fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Projects & Research</h1>
          <p className="text-muted-foreground mt-2">Showcase your technical work and achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Add New Project</h2>
              <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Projects ({projects.length})</h2>
              {projects.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No projects yet. Add your first project above!</p>
                </Card>
              ) : (
                projects.map((project) => (
                  <ProjectCard key={project.projectId} project={project} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
              <h3 className="font-semibold mb-4">Project Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Include links to live projects and GitHub repos</li>
                <li>• Highlight the technologies you used</li>
                <li>• Describe the problem and your solution</li>
                <li>• Add dates to show your timeline</li>
                <li>• Include team size if it was collaborative</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
