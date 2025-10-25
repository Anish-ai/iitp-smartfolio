"use client"

import { Card } from "@/components/ui/card"
import type { Achievement } from "@/lib/db"
import { Trash2, Trophy, Edit } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface AchievementCardProps {
  achievement: Achievement;
  onDelete?: (id: string) => void;
  onEdit?: (achievement: Achievement) => void;
  isDeleting?: boolean;
}

export function AchievementCard({ achievement, onDelete, onEdit, isDeleting }: AchievementCardProps) {
  const date = new Date(achievement.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 group border-l-4 border-l-accent">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3 flex-1">
          <Trophy size={24} className="text-accent mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(achievement)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title="Edit achievement"
            >
              <Edit size={18} className="text-primary" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(achievement.achievementId)}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
              title="Delete achievement"
              disabled={!!isDeleting}
            >
              {isDeleting ? <Spinner className="text-destructive" /> : <Trash2 size={18} className="text-destructive" />}
            </button>
          )}
        </div>
      </div>

      {achievement.description && <p className="text-sm text-foreground/80">{achievement.description}</p>}
    </Card>
  )
}
