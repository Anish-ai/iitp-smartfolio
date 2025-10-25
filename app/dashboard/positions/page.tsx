"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PositionEditDialog } from "@/components/position-edit-dialog"
import { BulkImportDialog } from "@/components/bulk-import-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { positionsApi } from "@/lib/api"
import type { PositionOfResponsibility } from "@/lib/db"
import { Trash2, Edit } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function PositionsPage() {
  const [positions, setPositions] = useState<PositionOfResponsibility[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingPosition, setEditingPosition] = useState<PositionOfResponsibility | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    description: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const data = await positionsApi.list()
      setPositions(data || [])
    } catch (error) {
      console.error("Error fetching positions:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await positionsApi.create(formData)
      setFormData({ title: "", organization: "", description: "", startDate: "", endDate: "" })
      await fetchPositions()
    } catch (error) {
      console.error("Error adding position:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (posId: string) => {
    setDeletingId(posId)
    try {
      await positionsApi.delete(posId)
      await fetchPositions()
    } catch (error) {
      console.error("Error deleting position:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (position: PositionOfResponsibility) => {
    setEditingPosition(position)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (posId: string, data: any) => {
    try {
      await positionsApi.update(posId, data)
      await fetchPositions()
    } catch (error) {
      console.error("Error updating position:", error)
      throw error
    }
  }

  const handleBulkImport = async (items: any[]) => {
    const errors: string[] = []
    
    for (const item of items) {
      try {
        await positionsApi.create({
          title: item.title,
          organization: item.organization,
          description: item.description || null,
          startDate: item.startDate,
          endDate: item.endDate || null,
        })
      } catch (error: any) {
        errors.push(`Failed to import "${item.title}": ${error.message}`)
      }
    }
    
    await fetchPositions()
    
    if (errors.length > 0) {
      throw new Error(`Imported with errors:\n${errors.join('\n')}`)
    }
  }

  const positionsExampleJson = `[
  {
    "title": "Technical Secretary",
    "organization": "Robotics Club, IIT Patna",
    "description": "Led team of 20 students, organized 5 workshops",
    "startDate": "2023-08-01",
    "endDate": "2024-07-31"
  },
  {
    "title": "Core Team Member",
    "organization": "Entrepreneurship Cell",
    "description": "Organized startup events and mentorship programs",
    "startDate": "2024-01-15",
    "endDate": null
  }
]`

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Positions of Responsibility</h1>
            <p className="text-muted-foreground mt-2">Document your leadership roles and responsibilities</p>
          </div>
          <BulkImportDialog
            title="Bulk Import Positions"
            description="Import multiple positions at once. endDate can be null for ongoing positions."
            exampleJson={positionsExampleJson}
            onImport={handleBulkImport}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Add Position</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Position Title</label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Club President"
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
                      placeholder="e.g., Coding Club"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your responsibilities..."
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
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

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? "Adding..." : "Add Position"}
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Positions ({positions.length})</h2>
              {positions.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No positions added yet. Share your leadership experience!</p>
                </Card>
              ) : (
                positions.map((pos) => (
                  <Card key={pos.posId} className="p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{pos.title}</h3>
                        <p className="text-sm text-muted-foreground">{pos.organization}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(pos)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit position"
                        >
                          <Edit size={18} className="text-primary" />
                        </button>
                        <button
                          onClick={() => handleDelete(pos.posId)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete position"
                          disabled={deletingId === pos.posId}
                        >
                          {deletingId === pos.posId ? <Spinner className="text-destructive" /> : <Trash2 size={18} className="text-destructive" />}
                        </button>
                      </div>
                    </div>
                    {pos.description && <p className="text-sm text-foreground/80 mb-3">{pos.description}</p>}
                    <p className="text-xs text-muted-foreground">
                      {new Date(pos.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {pos.endDate
                        ? new Date(pos.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                        : "Present"}
                    </p>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-linear-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
              <h3 className="font-semibold mb-4">Position Ideas</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Club President/Vice President</li>
                <li>• Event Coordinator</li>
                <li>• Team Lead</li>
                <li>• Mentor/Tutor</li>
                <li>• Committee Member</li>
                <li>• Student Representative</li>
                <li>• Volunteer Coordinator</li>
              </ul>
            </Card>
          </div>
        </div>

        <PositionEditDialog
          position={editingPosition}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingPosition(null)
          }}
          onSave={handleUpdate}
        />
      </div>
    </DashboardLayout>
  )
}
