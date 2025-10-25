"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface ProjectFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function ProjectForm({ onSubmit, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [] as string[],
    projectLink: "",
    githubRepo: "",
    startDate: "",
    endDate: "",
  })
  const [techInput, setTechInput] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addTech = () => {
    if (techInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()],
      }))
      setTechInput("")
    }
  }

  const removeTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      techStack: [],
      projectLink: "",
      githubRepo: "",
      startDate: "",
      endDate: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Project Title</label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., E-commerce Platform"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your project..."
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
          <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tech Stack</label>
        <div className="flex gap-2 mb-3">
          <Input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="e.g., React, Node.js"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
          />
          <Button type="button" onClick={addTech} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.techStack.map((tech, i) => (
            <div key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              {tech}
              <button type="button" onClick={() => removeTech(i)} className="hover:text-primary/70">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Project Link</label>
          <Input
            type="url"
            name="projectLink"
            value={formData.projectLink}
            onChange={handleChange}
            placeholder="https://project.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">GitHub Repository</label>
          <Input
            type="url"
            name="githubRepo"
            value={formData.githubRepo}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? <><Spinner className="mr-2" /> Adding...</> : "Add Project"}
      </Button>
    </form>
  )
}
