"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PositionOfResponsibility } from "@/lib/db"

interface PositionEditDialogProps {
  position: PositionOfResponsibility | null
  open: boolean
  onClose: () => void
  onSave: (posId: string, data: any) => Promise<void>
}

export function PositionEditDialog({ position, open, onClose, onSave }: PositionEditDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && position) {
      setFormData({
        title: position.title,
        organization: position.organization,
        description: position.description || "",
        startDate: new Date(position.startDate).toISOString().split('T')[0],
        endDate: position.endDate ? new Date(position.endDate).toISOString().split('T')[0] : "",
      })
    }
  }, [open, position])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!position) return
    
    setIsSaving(true)
    try {
      await onSave(position.posId, formData)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!position) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Position of Responsibility</DialogTitle>
          <DialogDescription>
            Update the position details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Position Title</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Club President, Team Lead"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Organization</label>
            <Input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="e.g., Robotics Club, IIT Patna"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your responsibilities..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
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
