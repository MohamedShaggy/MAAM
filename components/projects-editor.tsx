"use client"

import { useState } from "react"
import { useContentStore } from "@/lib/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/image-upload"
import { FolderOpen, Plus, Trash2, Save } from "lucide-react"
import type { Project } from "@/lib/types"

export function ProjectsEditor() {
  const { content, updateProjects } = useContentStore()
  const [projects, setProjects] = useState<Project[]>(content.projects)

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      tags: [],
      image: "/placeholder.svg?height=400&width=600",
      featured: true,
    }
    setProjects([...projects, newProject])
  }

  const removeProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)))
  }

  const updateTags = (id: string, tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)
    updateProject(id, "tags", tags)
  }

  const handleSave = () => {
    updateProjects(projects.filter((project) => project.title.trim() !== ""))
    console.log("[v0] Projects saved:", projects)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Projects Management</h2>
          <p className="text-zinc-400">Showcase your work and projects</p>
        </div>
        <Button onClick={addProject} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  {project.title || "Untitled Project"}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProject(project.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input
                  value={project.title}
                  onChange={(e) => updateProject(project.id, "title", e.target.value)}
                  placeholder="Enter project title"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Project Image</Label>
                <ImageUpload
                  value={project.image}
                  onChange={(url) => updateProject(project.id, "image", url)}
                  placeholder="Upload project image..."
                  maxSize={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder="Describe your project"
                  className="bg-zinc-800 border-zinc-700"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={project.tags.join(", ")}
                  onChange={(e) => updateTags(project.id, e.target.value)}
                  placeholder="React, Next.js, TypeScript, Tailwind CSS"
                  className="bg-zinc-800 border-zinc-700"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Demo URL (optional)</Label>
                  <Input
                    value={project.demoUrl || ""}
                    onChange={(e) => updateProject(project.id, "demoUrl", e.target.value)}
                    placeholder="https://example.com"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Repository URL (optional)</Label>
                  <Input
                    value={project.repoUrl || ""}
                    onChange={(e) => updateProject(project.id, "repoUrl", e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id={`featured-${project.id}`}
                  checked={project.featured}
                  onCheckedChange={(checked) => updateProject(project.id, "featured", checked)}
                />
                <Label htmlFor={`featured-${project.id}`}>Featured Project</Label>
              </div>
            </CardContent>
          </Card>
        ))}

        {projects.length === 0 && (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50 text-zinc-400" />
              <p className="text-zinc-400">No projects added yet. Click "Add Project" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          Save Projects
        </Button>
      </div>
    </div>
  )
}
