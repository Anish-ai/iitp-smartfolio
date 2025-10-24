"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import type { Skill } from "@/lib/db"

interface SkillEditDialogProps {
  skill: Skill | null
  open: boolean
  onClose: () => void
  onSave: (skillId: string, updatedSkills: Array<{ name: string; level: string }>) => Promise<void>
}

export function SkillEditDialog({ skill, open, onClose, onSave }: SkillEditDialogProps) {
  const [editedSkills, setEditedSkills] = useState<Array<{ name: string; level: string }>>([])
  const [isSaving, setIsSaving] = useState(false)

  // Initialize edited skills when dialog opens
  useState(() => {
    if (skill) {
      setEditedSkills([...skill.skills])
    }
  })

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && skill) {
      setEditedSkills([...skill.skills])
    } else {
      onClose()
    }
  }

  const removeSkill = (index: number) => {
    setEditedSkills(prev => prev.filter((_, i) => i !== index))
  }

  const updateSkillName = (index: number, name: string) => {
    setEditedSkills(prev => prev.map((s, i) => i === index ? { ...s, name } : s))
  }

  const updateSkillLevel = (index: number, level: string) => {
    setEditedSkills(prev => prev.map((s, i) => i === index ? { ...s, level } : s))
  }

  const handleSave = async () => {
    if (!skill || editedSkills.length === 0) return
    
    setIsSaving(true)
    try {
      await onSave(skill.skillId, editedSkills)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!skill) return null

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Skills: {skill.category}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {editedSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No skills remaining. Category will be deleted if you save.
            </p>
          ) : (
            editedSkills.map((skillItem, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={skillItem.name}
                  onChange={(e) => updateSkillName(index, e.target.value)}
                  placeholder="Skill name"
                  className="flex-1"
                />
                <select
                  value={skillItem.level}
                  onChange={(e) => updateSkillLevel(index, e.target.value)}
                  className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="p-2 hover:bg-destructive/10 rounded transition-colors"
                >
                  <X size={18} className="text-destructive" />
                </button>
              </div>
            ))
          )}
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
