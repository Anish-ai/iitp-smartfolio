"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import type { Achievement } from "@/lib/db"

interface AchievementEditDialogProps {
  achievement: Achievement | null
  open: boolean
  onClose: () => void
  onSave: (achievementId: string, data: any) => Promise<void>
}

export function AchievementEditDialog({ achievement, open, onClose, onSave }: AchievementEditDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && achievement) {
      setFormData({
        title: achievement.title,
        description: achievement.description || "",
        date: new Date(achievement.date).toISOString().split('T')[0],
      })
    }
  }, [open, achievement])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!achievement) return
    
    setIsSaving(true)
    try {
      await onSave(achievement.achievementId, formData)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!achievement) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Achievement</DialogTitle>
          <DialogDescription>
            Update the achievement details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Achievement Title</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Hackathon Winner, Dean's List"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your achievement..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <><Spinner className="mr-2" /> Saving...</> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
