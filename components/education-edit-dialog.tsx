"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import type { Education } from "@/lib/db"

interface EducationEditDialogProps {
  education: Education | null
  open: boolean
  onClose: () => void
  onSave: (eduId: string, data: any) => Promise<void>
}

export function EducationEditDialog({ education, open, onClose, onSave }: EducationEditDialogProps) {
  const [formData, setFormData] = useState({
    institute: "IIT Patna",
    degree: "",
    branch: "",
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear(),
    cgpaOrPercentage: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && education) {
      setFormData({
        institute: education.institute,
        degree: education.degree,
        branch: education.branch,
        startYear: education.startYear,
        endYear: education.endYear || new Date().getFullYear(),
        cgpaOrPercentage: education.cgpaOrPercentage.toString(),
      })
    }
  }, [open, education])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Year") || name === "cgpaOrPercentage" ? (value ? Number.parseFloat(value) : "") : value,
    }))
  }

  const handleSave = async () => {
    if (!education) return
    
    setIsSaving(true)
    try {
      await onSave(education.eduId, formData)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!education) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Education</DialogTitle>
          <DialogDescription>
            Update the education details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Institute</label>
            <Input type="text" name="institute" value={formData.institute} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Degree</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Degree</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Year</label>
              <Input
                type="number"
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear()}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Year</label>
              <Input
                type="number"
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear() + 5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CGPA / Percentage</label>
              <Input
                type="number"
                name="cgpaOrPercentage"
                value={formData.cgpaOrPercentage}
                onChange={handleChange}
                placeholder="8.5"
                step="0.01"
                min="0"
                max="10"
                required
              />
            </div>
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
