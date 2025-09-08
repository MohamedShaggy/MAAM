"use client"

import { useState } from "react"
import { useContentStore } from "@/lib/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Code, Plus, Trash2, Save } from "lucide-react"
import type { Skill } from "@/lib/types"

export function SkillsEditor() {
  const { content, updateSkills } = useContentStore()
  const [skills, setSkills] = useState<Skill[]>(content.skills)

  const addSkill = () => {
    setSkills([...skills, { name: "", level: 50 }])
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const updatedSkills = skills.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill))
    setSkills(updatedSkills)
  }

  const handleSave = () => {
    updateSkills(skills.filter((skill) => skill.name.trim() !== ""))
    console.log("[v0] Skills saved:", skills)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Skills Management</h2>
          <p className="text-zinc-400">Add and manage your technical skills</p>
        </div>
        <Button onClick={addSkill} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Skills ({skills.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/30">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`skill-${index}`}>Skill Name</Label>
                <Input
                  id={`skill-${index}`}
                  value={skill.name}
                  onChange={(e) => updateSkill(index, "name", e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Proficiency Level: {skill.level}%</Label>
                <Slider
                  value={[skill.level]}
                  onValueChange={(value) => updateSkill(index, "level", value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkill(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {skills.length === 0 && (
            <div className="text-center py-8 text-zinc-400">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No skills added yet. Click "Add Skill" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          Save Skills
        </Button>
      </div>
    </div>
  )
}
