"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Course } from "@/lib/db"

interface CourseEditDialogProps {
  course: Course | null
  open: boolean
  onClose: () => void
  onSave: (courseId: string, data: any) => Promise<void>
}

export function CourseEditDialog({ course, open, onClose, onSave }: CourseEditDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    provider: "IIT Patna",
    certificateLink: "",
    completionDate: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && course) {
      setFormData({
        title: course.title,
        provider: course.provider,
        certificateLink: course.certificateLink || "",
        completionDate: new Date(course.completionDate).toISOString().split('T')[0],
      })
    }
  }, [open, course])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!course) return
    
    setIsSaving(true)
    try {
      const courseData = {
        ...formData,
        provider: formData.provider.trim() || "IIT Patna"
      }
      await onSave(course.courseId, courseData)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!course) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update the course details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Course Title</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., React Advanced Patterns"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Provider</label>
              <Input
                type="text"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                placeholder="IIT Patna (default)"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave as "IIT Patna" or change to other providers (Udemy, Coursera, etc.)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Completion Date</label>
              <Input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Certificate Link</label>
              <Input
                type="url"
                name="certificateLink"
                value={formData.certificateLink}
                onChange={handleChange}
                placeholder="https://certificate.com"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
