"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/lib/db"
import { ExternalLink } from "lucide-react"

interface ProfilePreviewProps {
  profile?: Profile
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  if (!profile) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <p>Profile preview will appear here</p>
      </Card>
    )
  }

  return (
    <Card className="p-8 space-y-6 hover:shadow-lg transition-shadow duration-300">
      {/* Profile Header */}
      <div className="text-center border-b border-border pb-6">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-4xl">
          {profile.photoURL ? (
            <img
              src={profile.photoURL || "/placeholder.svg"}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            "👤"
          )}
        </div>
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        <p className="text-muted-foreground">{profile.email}</p>
      </div>

      {/* Contact Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground">Contact</h3>
        {profile.phone && <p className="text-sm">{profile.phone}</p>}
        <div className="flex flex-wrap gap-2 mt-3">
          {profile.portfolioWebsite && (
            <a
              href={profile.portfolioWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-secondary px-3 py-1 rounded-full hover:bg-primary/10 transition-colors"
            >
              Portfolio <ExternalLink size={12} />
            </a>
          )}
          {profile.githubLink && (
            <a
              href={profile.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-secondary px-3 py-1 rounded-full hover:bg-primary/10 transition-colors"
            >
              GitHub <ExternalLink size={12} />
            </a>
          )}
          {profile.linkedinLink && (
            <a
              href={profile.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-secondary px-3 py-1 rounded-full hover:bg-primary/10 transition-colors"
            >
              LinkedIn <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Profile Complete</Badge>
      </div>
    </Card>
  )
}
