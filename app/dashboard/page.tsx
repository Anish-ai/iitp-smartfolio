"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/lib/hooks/use-profile"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"

const mockStats = [
  { name: "Projects", value: 5 },
  { name: "Skills", value: 12 },
  { name: "Achievements", value: 8 },
  { name: "Courses", value: 6 },
]

export default function DashboardPage() {
  const { profile, isLoading } = useProfile()

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Welcome back, {profile?.name || "Student"}!</h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional portfolio and showcase your achievements
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map((stat, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold text-primary mt-2">{stat.value}</p>
                </div>
                <div className="text-4xl opacity-20">📊</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Profile Completion */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Completion</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">✓</p>
                <p className="text-xs text-muted-foreground mt-1">Profile</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">✓</p>
                <p className="text-xs text-muted-foreground mt-1">Education</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">○</p>
                <p className="text-xs text-muted-foreground mt-1">Projects</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <h3 className="font-semibold text-lg mb-2">Add New Project</h3>
            <p className="text-sm text-muted-foreground mb-4">Showcase your technical work and achievements</p>
            <Link href="/dashboard/projects">
              <Button className="w-full">Add Project</Button>
            </Link>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <h3 className="font-semibold text-lg mb-2">Generate Resume</h3>
            <p className="text-sm text-muted-foreground mb-4">Create a professional resume from your portfolio</p>
            <Link href="/dashboard/resume">
              <Button className="w-full bg-transparent" variant="outline">
                Generate
              </Button>
            </Link>
          </Card>
        </div>

        {/* Stats Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </DashboardLayout>
  )
}
