"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"

interface BulkImportDialogProps {
  title: string
  description: string
  exampleJson: string
  onImport: (data: any[]) => Promise<void>
}

export function BulkImportDialog({ title, description, exampleJson, onImport }: BulkImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    setError(null)
    setSuccess(null)

    if (!jsonInput.trim()) {
      setError("Please enter JSON data")
      return
    }

    try {
      // Parse JSON
      const data = JSON.parse(jsonInput)
      
      // Ensure it's an array
      const items = Array.isArray(data) ? data : [data]
      
      if (items.length === 0) {
        setError("No items to import")
        return
      }

      setIsImporting(true)
      
      // Call the import handler
      await onImport(items)
      
      setSuccess(`Successfully imported ${items.length} item(s)!`)
      setJsonInput("")
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false)
        setSuccess(null)
      }, 2000)
      
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format. Please check your syntax.")
      } else {
        setError(err.message || "Failed to import data")
      }
    } finally {
      setIsImporting(false)
    }
  }

  const handlePasteExample = () => {
    setJsonInput(exampleJson)
    setError(null)
    setSuccess(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload size={16} />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* JSON Input Area */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Paste your JSON data:</label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handlePasteExample}
              >
                Load Example
              </Button>
            </div>
            <Textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
                setError(null)
                setSuccess(null)
              }}
              placeholder="Paste JSON array here..."
              className="font-mono text-sm h-64"
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {/* Example Format */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Expected JSON format:</p>
            <pre className="text-xs overflow-x-auto bg-background p-3 rounded border">
              {exampleJson}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleImport}
              disabled={isImporting || !jsonInput.trim()}
            >
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
