"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileForm } from "@/components/profile-form"
import { ProfilePreview } from "@/components/profile-preview"
import { useProfile } from "@/lib/hooks/use-profile"
import { createClient } from "@/lib/auth"
import { Card } from "@/components/ui/card"

export default function ProfilePage() {
  const { profile, isLoading, mutate } = useProfile()
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("profiles").update(data).eq("userId", user.id)

      if (error) throw error

      await mutate()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Profile & Basic Info</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and social links</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ProfileForm profile={profile} onSubmit={handleSubmit} isLoading={isSaving} />
              )}
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <ProfilePreview profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
