"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { SessionTimer } from "@/components/session-timer"
import { useAuth } from "@/lib/hooks/use-auth"
import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/api"

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  // Check token expiration on mount and periodically
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      // Token expired or missing, redirect to login
      window.location.href = '/login'
      return
    }

    // Check every minute if token is still valid
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        window.location.href = '/login'
      }
    }, 60000) // Check every 60 seconds

    return () => clearInterval(interval)
  }, [loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <SessionTimer />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
