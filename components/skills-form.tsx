"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface SkillsFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function SkillsForm({ onSubmit, isLoading }: SkillsFormProps) {
  const [formData, setFormData] = useState({
    category: "",
    skills: [] as Array<{ name: string; level: string }>,
  })
  const [skillInput, setSkillInput] = useState("")
  const [levelInput, setLevelInput] = useState("Intermediate")

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }))
  }

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: skillInput.trim(), level: levelInput }],
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.category && formData.skills.length > 0) {
      await onSubmit(formData)
      setFormData({ category: "", skills: [] })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Skill Category</label>
        <Input
          type="text"
          value={formData.category}
          onChange={handleCategoryChange}
          placeholder="e.g., Frontend Development, Databases"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Add Skills</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g., React, TypeScript"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
            <select
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <Button type="button" onClick={addSkill} variant="outline">
              Add
            </Button>
          </div>

          {formData.skills.length > 0 && (
            <div className="space-y-2">
              {formData.skills.map((skill, i) => (
                <div key={i} className="flex items-center justify-between bg-secondary p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">{skill.level}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <X size={16} className="text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading || formData.skills.length === 0} className="w-full md:w-auto">
        {isLoading ? "Adding..." : "Add Skill Category"}
      </Button>
    </form>
  )
}
