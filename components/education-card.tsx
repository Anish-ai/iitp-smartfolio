"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Education } from "@/lib/db"
import { Trash2, Edit } from "lucide-react"


import { Spinner } from "@/components/ui/spinner";

interface EducationCardProps {
  education: Education;
  onDelete?: (id: string) => void;
  onEdit?: (education: Education) => void;
  isDeleting?: boolean;
}

interface EducationCardProps {
  education: Education;
  onDelete?: (id: string) => void;
  onEdit?: (education: Education) => void;
  isDeleting?: boolean;
}


export function EducationCard({ education, onDelete, onEdit, isDeleting }: EducationCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{education.degree}</h3>
          <p className="text-sm text-muted-foreground">{education.institute}</p>
          <p className="text-sm text-foreground/70 mt-1">
            {education.branch} • {education.startYear} - {education.endYear || "Present"}
          </p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(education)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title="Edit education"
            >
              <Edit size={18} className="text-primary" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(education.eduId)}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
              title="Delete education"
              disabled={!!isDeleting}
            >
              {isDeleting ? <Spinner className="text-destructive" /> : <Trash2 size={18} className="text-destructive" />}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge className="bg-primary/20 text-primary">CGPA: {education.cgpaOrPercentage}</Badge>
      </div>
    </Card>
  )
}
