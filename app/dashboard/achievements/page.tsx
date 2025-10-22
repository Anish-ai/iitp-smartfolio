"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AchievementForm } from "@/components/achievement-form"
import { AchievementCard } from "@/components/achievement-card"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/auth"
import type { Achievement } from "@/lib/db"

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("userId", user.id)
        .order("date", { ascending: false })

      if (error) throw error
      setAchievements(data || [])
    } catch (error) {
      console.error("Error fetching achievements:", error)
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

      const { error } = await supabase.from("achievements").insert([{ ...data, userId: user.id }])

      if (error) throw error
      await fetchAchievements()
    } catch (error) {
      console.error("Error adding achievement:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (achievementId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("achievements").delete().eq("achievementId", achievementId)

      if (error) throw error
      await fetchAchievements()
    } catch (error) {
      console.error("Error deleting achievement:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Achievements & Awards</h1>
          <p className="text-muted-foreground mt-2">Highlight your accomplishments and recognitions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Add Achievement</h2>
              <AchievementForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Achievements ({achievements.length})</h2>
              {achievements.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No achievements added yet. Share your accomplishments!</p>
                </Card>
              ) : (
                achievements.map((achievement) => (
                  <AchievementCard key={achievement.achievementId} achievement={achievement} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 sticky top-8">
              <h3 className="font-semibold mb-4">Achievement Ideas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Hackathon wins</li>
                <li>• Dean's List / Merit awards</li>
                <li>• Scholarships</li>
                <li>• Competition wins</li>
                <li>• Publications</li>
                <li>• Certifications</li>
                <li>• Leadership roles</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
