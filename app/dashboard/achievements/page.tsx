"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AchievementForm } from "@/components/achievement-form"
import { AchievementCard } from "@/components/achievement-card"
import { BulkImportDialog } from "@/components/bulk-import-dialog"
import { Card } from "@/components/ui/card"
import { achievementsApi } from "@/lib/api"
import type { Achievement } from "@/lib/db"

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const data = await achievementsApi.list()
      setAchievements(data || [])
    } catch (error) {
      console.error("Error fetching achievements:", error)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await achievementsApi.create(data)
      await fetchAchievements()
    } catch (error) {
      console.error("Error adding achievement:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (achievementId: string) => {
    try {
      await achievementsApi.delete(achievementId)
      await fetchAchievements()
    } catch (error) {
      console.error("Error deleting achievement:", error)
    }
  }

  const handleBulkImport = async (items: any[]) => {
    const errors: string[] = []
    
    for (const item of items) {
      try {
        await achievementsApi.create({
          title: item.title,
          description: item.description,
          date: item.date,
        })
      } catch (error: any) {
        errors.push(`Failed to import "${item.title}": ${error.message}`)
      }
    }
    
    await fetchAchievements()
    
    if (errors.length > 0) {
      throw new Error(`Imported with errors:\n${errors.join('\n')}`)
    }
  }

  const achievementsExampleJson = `[
  {
    "title": "First Prize - National Hackathon",
    "description": "Won first place in AI/ML category with team of 4",
    "date": "2024-03-15"
  },
  {
    "title": "Research Paper Published",
    "description": "Published in IEEE conference on Computer Vision",
    "date": "2024-07-20"
  }
]`

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Achievements & Awards</h1>
            <p className="text-muted-foreground mt-2">Showcase your accomplishments and recognitions</p>
          </div>
          <BulkImportDialog
            title="Bulk Import Achievements"
            description="Import multiple achievements at once using JSON format."
            exampleJson={achievementsExampleJson}
            onImport={handleBulkImport}
          />
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
            <Card className="p-6 bg-linear-to-br from-accent/10 to-accent/5 border-accent/20 sticky top-8">
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
