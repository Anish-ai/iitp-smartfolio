"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SkillsForm } from "@/components/skills-form"
import { SkillsDisplay } from "@/components/skills-display"
import { SkillEditDialog } from "@/components/skill-edit-dialog"
import { BulkImportDialog } from "@/components/bulk-import-dialog"
import { Card } from "@/components/ui/card"
import { skillsApi } from "@/lib/api"
import type { Skill } from "@/lib/db"

import { Spinner } from "@/components/ui/spinner"

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const data = await skillsApi.list()
      setSkills(data || [])
    } catch (error) {
      console.error("Error fetching skills:", error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await skillsApi.create(data)
      await fetchSkills()
    } catch (error) {
      console.error("Error adding skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (skillId: string) => {
    setDeletingId(skillId)
    try {
      await skillsApi.delete(skillId)
      await fetchSkills()
    } catch (error) {
      console.error("Error deleting skills:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setIsEditDialogOpen(true)
  }

  const handleUpdateSkills = async (skillId: string, updatedSkills: Array<{ name: string; level: string }>) => {
    try {
      if (updatedSkills.length === 0) {
        // If no skills left, delete the category
        await skillsApi.delete(skillId)
      } else {
        // Update the skills
        await skillsApi.update(skillId, { skills: updatedSkills })
      }
      await fetchSkills()
    } catch (error) {
      console.error("Error updating skills:", error)
      throw error
    }
  }

  const handleBulkImport = async (items: any[]) => {
    const errors: string[] = []
    
    for (const item of items) {
      try {
        await skillsApi.create({
          category: item.category,
          skills: item.skills,
        })
      } catch (error: any) {
        errors.push(`Failed to import "${item.category}": ${error.message}`)
      }
    }
    
    await fetchSkills()
    
    if (errors.length > 0) {
      throw new Error(`Imported with errors:\n${errors.join('\n')}`)
    }
  }

  const skillsExampleJson = `[
  {
    "category": "Programming Languages",
    "skills": [
      { "name": "Python", "level": "Advanced" },
      { "name": "JavaScript", "level": "Intermediate" },
      { "name": "Java", "level": "Intermediate" }
    ]
  },
  {
    "category": "Web Development",
    "skills": [
      { "name": "React", "level": "Advanced" },
      { "name": "Next.js", "level": "Intermediate" },
      { "name": "Node.js", "level": "Intermediate" }
    ]
  }
]`

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Skills & Technologies</h1>
            <p className="text-muted-foreground mt-2">Organize your technical skills by category</p>
          </div>
          <BulkImportDialog
            title="Bulk Import Skills"
            description="Import multiple skill categories at once. Each skill should have 'name' and 'level' fields."
            exampleJson={skillsExampleJson}
            onImport={handleBulkImport}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Add Skill Category</h2>
              <SkillsForm onSubmit={handleSubmit} isLoading={isLoading} existingSkills={skills} />
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Skills ({skills.length})</h2>
              {skills.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No skills added yet. Start by adding your first skill category!</p>
                </Card>
              ) : (
                <SkillsDisplay skills={skills} onDelete={handleDelete} onEdit={handleEdit} deletingId={deletingId} />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-linear-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
              <h3 className="font-semibold mb-4">Skill Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Frontend Development</li>
                <li>• Backend Development</li>
                <li>• Databases</li>
                <li>• DevOps & Cloud</li>
                <li>• AI/ML</li>
                <li>• Mobile Development</li>
                <li>• Tools & Platforms</li>
              </ul>
            </Card>
          </div>
        </div>

        <SkillEditDialog
          skill={editingSkill}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingSkill(null)
          }}
          onSave={handleUpdateSkills}
        />
      </div>
    </DashboardLayout>
  )
}
