"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              IIT Patna Official Portfolio Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              SmartFolio
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
              Your Professional Portfolio, Simplified
            </p>
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Create stunning portfolios and resumes in minutes. Built exclusively for IIT Patna students with secure authentication.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg gap-2 shadow-lg hover:shadow-xl transition-all"
                onClick={() => router.push(user ? "/dashboard" : "/login")}
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg gap-2"
                onClick={() => {
                  const features = document.getElementById('features')
                  features?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Learn More
              </Button>
            </div>
            
            {user && (
              <p className="text-sm text-muted-foreground mt-4">
                Welcome back, <span className="font-semibold text-foreground">{user.name}</span>! 👋
              </p>
            )}
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              {
                icon: Shield,
                title: "Secure Auth",
                description: "IITP-only authentication via OTP",
                color: "text-blue-600 dark:text-blue-400"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate resumes in seconds",
                color: "text-yellow-600 dark:text-yellow-400"
              },
              {
                icon: FileText,
                title: "Multiple Templates",
                description: "Professional resume designs",
                color: "text-green-600 dark:text-green-400"
              },
              {
                icon: Users,
                title: "Centralized",
                description: "One profile for all IITP apps",
                color: "text-purple-600 dark:text-purple-400"
              }
            ].map((feature, idx) => (
              <Card 
                key={idx} 
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
              >
                <feature.icon className={`w-10 h-10 mb-4 ${feature.color}`} />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {/* Feature 1 */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Complete Portfolio Management</h3>
                  <p className="text-muted-foreground">
                    Manage all aspects of your academic and professional journey in one place.
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Education & Academic Records",
                  "Projects & Research Work",
                  "Skills & Technologies",
                  "Achievements & Awards",
                  "Positions of Responsibility",
                  "Certifications & Courses"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-950">
                  <Trophy className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Smart Resume Builder</h3>
                  <p className="text-muted-foreground">
                    Generate professional resumes automatically from your portfolio data.
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Multiple professional templates",
                  "One-click PDF generation",
                  "Customizable sections & colors",
                  "Export as PDF or Image",
                  "Share via QR code",
                  "Print-ready formats"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Secure Login",
                  description: "Login with your IITP email via OTP authentication",
                  icon: Shield
                },
                {
                  step: "02",
                  title: "Build Portfolio",
                  description: "Add your projects, skills, education, and achievements",
                  icon: Briefcase
                },
                {
                  step: "03",
                  title: "Generate Resume",
                  description: "Create professional resumes in multiple formats instantly",
                  icon: FileText
                }
              ].map((step, idx) => (
                <div key={idx} className="text-center relative">
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-linear-to-r from-primary/50 to-primary/20 -z-10" />
                  )}
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/60 text-white text-2xl font-bold mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <step.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="p-12 text-center bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 border-0 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Your Portfolio?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join fellow IITP students in creating professional portfolios that stand out.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="h-14 px-10 text-lg gap-2 shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push(user ? "/dashboard" : "/login")}
            >
              {user ? "Go to Dashboard" : "Get Started Now"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Card>

          {/* Footer */}
          <div className="mt-16 text-center text-sm text-muted-foreground">
            <p className="mb-2">Made with ❤️ for IIT Patna</p>
            <p>Powered by IITP Auth Gateway • Secure • Fast • Reliable</p>
          </div>
        </div>
      </div>
    </div>
  )
}
