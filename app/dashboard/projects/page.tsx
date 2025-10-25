"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProjectForm } from "@/components/project-form"
import { ProjectCard } from "@/components/project-card"
import { ProjectEditDialog } from "@/components/project-edit-dialog"
import { BulkImportDialog } from "@/components/bulk-import-dialog"
import { Card } from "@/components/ui/card"
import { projectsApi } from "@/lib/api"
import type { Project } from "@/lib/db"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.list()
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await projectsApi.create(data)
      await fetchProjects()
    } catch (error) {
      console.error("Error adding project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    setDeletingId(projectId)
    try {
      await projectsApi.delete(projectId)
      await fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (projectId: string, data: any) => {
    try {
      await projectsApi.update(projectId, data)
      await fetchProjects()
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  }

  const handleBulkImport = async (items: any[]) => {
    const errors: string[] = []
    
    for (const item of items) {
      try {
        await projectsApi.create({
          title: item.title,
          description: item.description,
          techStack: Array.isArray(item.techStack) ? item.techStack : [],
          projectLink: item.projectLink || null,
          githubRepo: item.githubRepo || null,
          startDate: item.startDate,
          endDate: item.endDate || null,
        })
      } catch (error: any) {
        errors.push(`Failed to import "${item.title}": ${error.message}`)
      }
    }
    
    await fetchProjects()
    
    if (errors.length > 0) {
      throw new Error(`Imported with errors:\n${errors.join('\n')}`)
    }
  }

  const projectExampleJson = `[
  {
    "title": "Portfolio Website",
    "description": "Personal portfolio built with Next.js and Tailwind CSS",
    "techStack": ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    "projectLink": "https://example.com",
    "githubRepo": "https://github.com/username/portfolio",
    "startDate": "2024-01-15",
    "endDate": "2024-03-20"
  },
  {
    "title": "E-commerce Platform",
    "description": "Full-stack online store with payment integration",
    "techStack": ["Node.js", "Express", "MongoDB", "React"],
    "projectLink": "https://store.example.com",
    "githubRepo": "https://github.com/username/ecommerce",
    "startDate": "2024-06-01",
    "endDate": null
  }
]`

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Projects & Research</h1>
            <p className="text-muted-foreground mt-2">Showcase your technical work and achievements</p>
          </div>
          <BulkImportDialog
            title="Bulk Import Projects"
            description="Import multiple projects at once using JSON format. All fields like title, description, techStack (array), dates are supported."
            exampleJson={projectExampleJson}
            onImport={handleBulkImport}
          />
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
                  <ProjectCard
                    key={project.projectId}
                    project={project}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    isDeleting={deletingId === project.projectId}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-linear-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
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

        <ProjectEditDialog
          project={editingProject}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingProject(null)
          }}
          onSave={handleUpdate}
        />
      </div>
    </DashboardLayout>
  )
}
