"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/auth"
import type { PositionOfResponsibility } from "@/lib/db"
import { Trash2 } from "lucide-react"

export default function PositionsPage() {
  const [positions, setPositions] = useState<PositionOfResponsibility[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("positionsOfResponsibility")
        .select("*")
        .eq("userId", user.id)
        .order("startDate", { ascending: false })

      if (error) throw error
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
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("positionsOfResponsibility").insert([{ ...formData, userId: user.id }])

      if (error) throw error
      setFormData({ title: "", organization: "", description: "", startDate: "", endDate: "" })
      await fetchPositions()
    } catch (error) {
      console.error("Error adding position:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (posId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("positionsOfResponsibility").delete().eq("posId", posId)

      if (error) throw error
      await fetchPositions()
    } catch (error) {
      console.error("Error deleting position:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Positions of Responsibility</h1>
          <p className="text-muted-foreground mt-2">Showcase your leadership roles and responsibilities</p>
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
                      <button
                        onClick={() => handleDelete(pos.posId)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </button>
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
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-8">
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
      </div>
    </DashboardLayout>
  )
}
