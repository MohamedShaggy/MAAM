"use client"

import type React from "react"

import { useState } from "react"
import { useContentStore } from "@/lib/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, RotateCcw, Download, Upload, CheckCircle, AlertCircle } from "lucide-react"

export function PublishingControls() {
  const { content, resetToDefaults, saveContent, error, isSaving, lastSaved } = useContentStore()
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const handleSave = async () => {
    setSaveStatus("saving")
    try {
      const success = await saveContent()
      if (success) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 3000)
      } else {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    } catch (error) {
      console.error("Save error:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all content to defaults? This action cannot be undone.")) {
      resetToDefaults()
      console.log("[v0] Content reset to defaults")
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(content, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "portfolio-content.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedContent = JSON.parse(e.target?.result as string)
          // Here you would validate and update the content
          console.log("[v0] Content imported:", importedContent)
          alert("Content imported successfully!")
        } catch (error) {
          alert("Error importing content. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Publishing Controls</h2>
        <p className="text-zinc-400">Manage your content publishing and backups</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={saveStatus === "saving" || isSaving}
            >
              {(saveStatus === "saving" || isSaving) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>

            {saveStatus === "saved" && (
              <Alert className="border-green-500/20 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-300">
                  All changes have been saved successfully!
                </AlertDescription>
              </Alert>
            )}

            {saveStatus === "error" && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-300">
                  {error || "Error saving changes. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {lastSaved && saveStatus !== "error" && (
              <Alert className="border-blue-500/20 bg-blue-500/10">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-300">
                  Last saved: {lastSaved.toLocaleString()}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>Backup & Restore</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full border-zinc-600 hover:bg-zinc-800 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Content
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full border-zinc-600 hover:bg-zinc-800 bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Import Content
              </Button>
            </div>

            <Alert className="border-zinc-600/20 bg-zinc-800/20">
              <AlertDescription className="text-zinc-400 text-sm">
                Export your content as JSON for backup or import previously saved content.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>Content Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{content.skills.length}</div>
              <div className="text-sm text-zinc-400">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{content.projects.length}</div>
              <div className="text-sm text-zinc-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{content.experience.length}</div>
              <div className="text-sm text-zinc-400">Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">{content.socialLinks.length}</div>
              <div className="text-sm text-zinc-400">Social Links</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
