"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const resumeTemplates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, contemporary design with accent colors",
    preview: "Modern layout with sidebar",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional corporate style",
    preview: "Classic professional format",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Emphasizes education and research",
    preview: "Academic-focused layout",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and visually engaging",
    preview: "Creative visual design",
  },
]

interface TemplateSelectProps {
  selected: string
  onSelect: (id: string) => void
}

export function TemplateSelect({ selected, onSelect }: TemplateSelectProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {resumeTemplates.map((template) => (
        <Card
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`p-4 cursor-pointer transition-all duration-300 ${
            selected === template.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md hover:border-primary/50"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold">{template.name}</h3>
            {selected === template.id && <Badge className="bg-primary">Selected</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{template.description}</p>
          <div className="mt-3 p-3 bg-secondary rounded text-xs text-muted-foreground">{template.preview}</div>
        </Card>
      ))}
    </div>
  )
}
