"use client"

import { useState } from "react"
import { useEducation } from "@/lib/hooks"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EducationForm } from "@/components/education-form"
import { EducationCard } from "@/components/education-card"
import { EducationEditDialog } from "@/components/education-edit-dialog"
import { BulkImportDialog } from "@/components/bulk-import-dialog"
import { Card } from "@/components/ui/card"
import { educationApi } from "@/lib/api"
import type { Education } from "@/lib/db"

export default function EducationPage() {
  const { education: educations, isLoading: isEducationLoading, mutate } = useEducation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await educationApi.create(data)
      await mutate() // Revalidate cache
    } catch (error) {
      console.error("Error adding education:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (eduId: string) => {
    setDeletingId(eduId)
    try {
      await educationApi.delete(eduId)
      await mutate() // Revalidate cache
    } catch (error) {
      console.error("Error deleting education:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (education: Education) => {
    setEditingEducation(education)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (eduId: string, data: any) => {
    try {
      await educationApi.update(eduId, data)
      await mutate() // Revalidate cache
    } catch (error) {
      console.error("Error updating education:", error)
      throw error
    }
  }

  const handleBulkImport = async (items: any[]) => {
    const errors: string[] = []

    for (const item of items) {
      try {
        await educationApi.create({
          institute: item.institute,
          degree: item.degree,
          branch: item.branch,
          startYear: item.startYear,
          endYear: item.endYear || null,
          cgpaOrPercentage: item.cgpaOrPercentage,
        })
      } catch (error: any) {
        errors.push(`Failed to import "${item.institute}": ${error.message}`)
      }
    }

    await mutate() // Revalidate cache

    if (errors.length > 0) {
      throw new Error(`Imported with errors:\n${errors.join('\n')}`)
    }
  }

  const educationExampleJson = `[
  {
    "institute": "Indian Institute of Technology Patna",
    "degree": "B.Tech",
    "branch": "Computer Science",
    "startYear": 2021,
    "endYear": 2025,
    "cgpaOrPercentage": 8.5
  },
  {
    "institute": "Delhi Public School",
    "degree": "Class XII",
    "branch": "PCM",
    "startYear": 2019,
    "endYear": 2021,
    "cgpaOrPercentage": 95.5
  }
]`

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Education</h1>
            <p className="text-muted-foreground mt-2">Track your academic journey</p>
          </div>
          <BulkImportDialog
            title="Bulk Import Education"
            description="Import multiple education records at once using JSON format."
            exampleJson={educationExampleJson}
            onImport={handleBulkImport}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Add Education</h2>
              <EducationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Education ({educations?.length || 0})</h2>
              {isEducationLoading ? (
                <div className="text-center p-8">Loading education...</div>
              ) : educations?.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No education records yet. Add your academic details above!</p>
                </Card>
              ) : (
                educations?.map((edu: Education) => (
                  <EducationCard
                    key={edu.eduId}
                    education={edu}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    isDeleting={deletingId === edu.eduId}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-linear-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
              <h3 className="font-semibold mb-4">Education Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Add all degrees and certifications</li>
                <li>• Include your CGPA or percentage</li>
                <li>• Specify your branch/specialization</li>
                <li>• Add relevant coursework if needed</li>
                <li>• Keep dates accurate and consistent</li>
              </ul>
            </Card>
          </div>
        </div>

        <EducationEditDialog
          education={editingEducation}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingEducation(null)
          }}
          onSave={handleUpdate}
        />
      </div>
    </DashboardLayout>
  )
}
