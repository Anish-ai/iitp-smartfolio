"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { redirectToIITPAuth } from "@/lib/auth"
import { useAuth } from "@/lib/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleLogin = () => {
    redirectToIITPAuth()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">SmartFolio</h1>
          <p className="text-muted-foreground mt-2">IITP Student Portfolio</p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🎓 IITP Students Only
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This application uses IITP Auth Gateway for secure authentication. You'll need your IITP email (@iitp.ac.in) to login.
            </p>
          </div>

          <Button onClick={handleLogin} className="w-full h-12 text-base" size="lg">
            Login with IITP Email
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">How it works:</p>
            <ol className="text-left space-y-1 max-w-sm mx-auto">
              <li>1. Click the login button above</li>
              <li>2. Enter your IITP email address</li>
              <li>3. Receive OTP via email</li>
              <li>4. Verify OTP to access your portfolio</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Powered by IITP Auth Gateway</p>
          <p className="mt-1">Secure • Fast • Centralized</p>
        </div>
      </Card>
    </div>
  )
}
