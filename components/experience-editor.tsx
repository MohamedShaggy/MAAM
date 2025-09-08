"use client"

import { useState } from "react"
import { useContentStore } from "@/lib/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, Trash2, Save } from "lucide-react"
import type { ExperienceItem } from "@/lib/types"

export function ExperienceEditor() {
  const { content, updateExperience } = useContentStore()
  const [experience, setExperience] = useState<ExperienceItem[]>(content.experience)

  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: Date.now().toString(),
      company: "",
      position: "",
      duration: "",
      description: "",
      technologies: [],
    }
    setExperience([newExperience, ...experience])
  }

  const removeExperience = (id: string) => {
    setExperience(experience.filter((exp) => exp.id !== id))
  }

  const updateExperienceItem = (id: string, field: keyof ExperienceItem, value: any) => {
    setExperience(experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const updateTechnologies = (id: string, techString: string) => {
    const technologies = techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech)
    updateExperienceItem(id, "technologies", technologies)
  }

  const handleSave = () => {
    updateExperience(experience.filter((exp) => exp.company.trim() !== "" && exp.position.trim() !== ""))
    console.log("[v0] Experience saved:", experience)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Work Experience</h2>
          <p className="text-zinc-400">Manage your professional experience timeline</p>
        </div>
        <Button onClick={addExperience} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {experience.map((exp) => (
          <Card key={exp.id} className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {exp.position || "New Position"} {exp.company && `at ${exp.company}`}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperienceItem(exp.id, "company", e.target.value)}
                    placeholder="Company name"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperienceItem(exp.id, "position", e.target.value)}
                    placeholder="Job title"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={exp.duration}
                  onChange={(e) => updateExperienceItem(exp.id, "duration", e.target.value)}
                  placeholder="e.g., 2022 - Present, Jan 2020 - Dec 2021"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperienceItem(exp.id, "description", e.target.value)}
                  placeholder="Describe your role and achievements"
                  className="bg-zinc-800 border-zinc-700"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies Used (comma-separated)</Label>
                <Input
                  value={exp.technologies?.join(", ") || ""}
                  onChange={(e) => updateTechnologies(exp.id, e.target.value)}
                  placeholder="React, Node.js, PostgreSQL, AWS"
                  className="bg-zinc-800 border-zinc-700"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {exp.technologies?.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {experience.length === 0 && (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50 text-zinc-400" />
              <p className="text-zinc-400">No experience added yet. Click "Add Experience" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          Save Experience
        </Button>
      </div>
    </div>
  )
}
