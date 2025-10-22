"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { handleIITPCallback } from "@/lib/auth"
import { Card } from "@/components/ui/card"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState("Processing authentication...")

  useEffect(() => {
    const token = searchParams.get("token")
    const success = searchParams.get("success")

    if (!token || success !== "true") {
      setStatus("error")
      setMessage("Authentication failed. No valid token received.")
      setTimeout(() => router.push("/login"), 3000)
      return
    }

    try {
      const user = handleIITPCallback(token)
      
      if (user) {
        setStatus("success")
        setMessage(`Welcome, ${user.name}! Redirecting to dashboard...`)
        
        // Initialize profile in localStorage if it doesn't exist
        const profiles = JSON.parse(localStorage.getItem("sf_table_profiles") || "[]")
        const existingProfile = profiles.find((p: any) => p.userId === user.id)
        
        if (!existingProfile) {
          const newProfile = {
            userId: user.id,
            email: user.email,
            name: user.name,
            rollNumber: user.rollNumber,
            degree: user.degree,
            branch: user.branch,
            admissionYear: user.admissionYear,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          profiles.push(newProfile)
          localStorage.setItem("sf_table_profiles", JSON.stringify(profiles))
        }
        
        setTimeout(() => router.push("/dashboard"), 1500)
      } else {
        throw new Error("Failed to parse user data from token")
      }
    } catch (error) {
      console.error("Auth callback error:", error)
      setStatus("error")
      setMessage("Failed to process authentication. Please try again.")
      setTimeout(() => router.push("/login"), 3000)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl text-center">
        <div className="mb-6">
          {status === "processing" && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          {status === "success" && (
            <div className="flex justify-center mb-4">
              <svg
                className="h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {status === "error" && (
            <div className="flex justify-center mb-4">
              <svg
                className="h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">
          {status === "processing" && "Authenticating..."}
          {status === "success" && "Success!"}
          {status === "error" && "Authentication Failed"}
        </h1>
        
        <p className="text-muted-foreground">{message}</p>
      </Card>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 shadow-xl text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            <p className="text-muted-foreground">Please wait</p>
          </Card>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
