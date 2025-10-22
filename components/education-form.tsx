"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EducationFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function EducationForm({ onSubmit, isLoading }: EducationFormProps) {
  const [formData, setFormData] = useState({
    institute: "IIT Patna",
    degree: "",
    branch: "",
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear(),
    cgpaOrPercentage: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Year") || name === "cgpaOrPercentage" ? (value ? Number.parseFloat(value) : "") : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData({
      institute: "IIT Patna",
      degree: "",
      branch: "",
      startYear: new Date().getFullYear() - 4,
      endYear: new Date().getFullYear(),
      cgpaOrPercentage: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Institute</label>
        <Input type="text" name="institute" value={formData.institute} onChange={handleChange} disabled />
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

      <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? "Adding..." : "Add Education"}
      </Button>
    </form>
  )
}
