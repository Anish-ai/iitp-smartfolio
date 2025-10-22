"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SkillsForm } from "@/components/skills-form"
import { SkillsDisplay } from "@/components/skills-display"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/auth"
import type { Skill } from "@/lib/db"

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase.from("skills").select("*").eq("userId", user.id)

      if (error) throw error
      setSkills(data || [])
    } catch (error) {
      console.error("Error fetching skills:", error)
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

      const { error } = await supabase.from("skills").insert([{ ...data, userId: user.id }])

      if (error) throw error
      await fetchSkills()
    } catch (error) {
      console.error("Error adding skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (skillId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("skills").delete().eq("skillId", skillId)

      if (error) throw error
      await fetchSkills()
    } catch (error) {
      console.error("Error deleting skills:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Skills & Technologies</h1>
          <p className="text-muted-foreground mt-2">Organize your technical skills by category</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Add Skill Category</h2>
              <SkillsForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Skills ({skills.length})</h2>
              {skills.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No skills added yet. Start by adding your first skill category!</p>
                </Card>
              ) : (
                <SkillsDisplay skills={skills} onDelete={handleDelete} />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
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
      </div>
    </DashboardLayout>
  )
}
