"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AchievementFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function AchievementForm({ onSubmit, isLoading }: AchievementFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({ title: "", description: "", date: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? "Adding..." : "Add Achievement"}
      </Button>
    </form>
  )
}
