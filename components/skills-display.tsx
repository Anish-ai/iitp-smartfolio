"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Skill } from "@/lib/db"
import { Trash2, Edit } from "lucide-react"

interface SkillsDisplayProps {
  skills: Skill[]
  onDelete?: (id: string) => void
  onEdit?: (skill: Skill) => void
}

const levelColors = {
  Beginner: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Intermediate: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Advanced: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Expert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function SkillsDisplay({ skills, onDelete, onEdit }: SkillsDisplayProps) {
  return (
    <div className="space-y-4">
      {skills.map((skillGroup) => (
        <Card key={skillGroup.skillId} className="p-6 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">{skillGroup.category}</h3>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(skillGroup)}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  title="Edit skills"
                >
                  <Edit size={18} className="text-primary" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(skillGroup.skillId)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Delete category"
                >
                  <Trash2 size={18} className="text-destructive" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {skillGroup.skills.map((skill: { name: string; level: string }, i: number) => (
              <Badge key={i} className={`${levelColors[skill.level as keyof typeof levelColors]} text-xs font-medium`}>
                {skill.name} • {skill.level}
              </Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
