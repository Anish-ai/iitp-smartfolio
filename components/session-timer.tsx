"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function getTokenExpiration(): number | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('sf_auth_token')
  if (!token) return null
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload.exp ? payload.exp * 1000 : null // Convert to milliseconds
  } catch {
    return null
  }
}

function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

export function SessionTimer() {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const expiration = getTokenExpiration()
      if (!expiration) {
        setTimeRemaining(null)
        return
      }

      const remaining = expiration - Date.now()
      setTimeRemaining(remaining)

      // Show warning if less than 30 minutes remaining
      setShowWarning(remaining > 0 && remaining < 30 * 60 * 1000)

      // Redirect to login if expired
      if (remaining <= 0) {
        localStorage.removeItem('sf_auth_token')
        localStorage.removeItem('sf_current_user')
        window.location.href = '/login'
      }
    }

    // Initial update
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  if (timeRemaining === null || timeRemaining <= 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {showWarning ? (
        <Alert variant="destructive" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Session expiring soon!</strong>
            <br />
            Time remaining: <strong>{formatTimeRemaining(timeRemaining)}</strong>
            <br />
            <span className="text-xs">Please save your work and login again.</span>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm px-3 py-2 flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Session: <strong className="text-foreground">{formatTimeRemaining(timeRemaining)}</strong>
          </span>
        </div>
      )}
    </div>
  )
}
