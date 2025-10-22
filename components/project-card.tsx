"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/db"
import { ExternalLink, Github, Trash2 } from "lucide-react"

interface ProjectCardProps {
  project: Project
  onDelete?: (id: string) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const startDate = new Date(project.startDate).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
  const endDate = project.endDate
    ? new Date(project.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Present"

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
          <p className="text-sm text-muted-foreground">
            {startDate} - {endDate}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(project.projectId)}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} className="text-destructive" />
          </button>
        )}
      </div>

      <p className="text-sm text-foreground/80 mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack.map((tech, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        {project.projectLink && (
          <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
              <ExternalLink size={14} /> Visit
            </Button>
          </a>
        )}
        {project.githubRepo && (
          <a href={project.githubRepo} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
              <Github size={14} /> Code
            </Button>
          </a>
        )}
      </div>
    </Card>
  )
}
