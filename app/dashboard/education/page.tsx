"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EducationForm } from "@/components/education-form"
import { EducationCard } from "@/components/education-card"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/auth"
import type { Education } from "@/lib/db"

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("education")
        .select("*")
        .eq("userId", user.id)
        .order("startYear", { ascending: false })

      if (error) throw error
      setEducations(data || [])
    } catch (error) {
      console.error("Error fetching education:", error)
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

      const { error } = await supabase.from("education").insert([{ ...data, userId: user.id }])

      if (error) throw error
      await fetchEducations()
    } catch (error) {
      console.error("Error adding education:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (eduId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("education").delete().eq("eduId", eduId)

      if (error) throw error
      await fetchEducations()
    } catch (error) {
      console.error("Error deleting education:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Education & Academics</h1>
          <p className="text-muted-foreground mt-2">Manage your academic history and qualifications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Add Education</h2>
              <EducationForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Education ({educations.length})</h2>
              {educations.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No education records yet. Add your academic details above!</p>
                </Card>
              ) : (
                educations.map((edu) => <EducationCard key={edu.eduId} education={edu} onDelete={handleDelete} />)
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
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
      </div>
    </DashboardLayout>
  )
}
