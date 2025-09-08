"use client"

import { useContentStore } from "@/lib/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ExternalLink } from "lucide-react"
import Link from "next/link"

export function ContentPreview() {
  const { content } = useContentStore()
  const { personalInfo, socialLinks, aboutBio, skills, projects, experience } = content

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Content Preview</h2>
          <p className="text-zinc-400">Preview how your content will appear on the live site</p>
        </div>
        <Link href="/" target="_blank">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Site
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Preview */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="space-y-2">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  {personalInfo.title}
                </Badge>
                <h3 className="text-xl font-bold">{personalInfo.name}</h3>
                <p className="text-sm text-zinc-400">{personalInfo.description}</p>
                <div className="flex gap-2 pt-2">
                  {socialLinks.slice(0, 3).map((link, index) => (
                    <div key={index} className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <div className="w-3 h-3 bg-zinc-400 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Preview */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Personal Info</h4>
              <div className="text-sm text-zinc-400 space-y-1">
                <div>Name: {personalInfo.name}</div>
                <div>Email: {personalInfo.email}</div>
                <div>Location: {personalInfo.location}</div>
                <div className="flex items-center gap-2">
                  Status:
                  <Badge
                    variant={personalInfo.availabilityStatus === "available" ? "default" : "secondary"}
                    className={personalInfo.availabilityStatus === "available" ? "bg-green-500/20 text-green-300" : ""}
                  >
                    {personalInfo.availability}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Bio Preview</h4>
              <div className="text-sm text-zinc-400 max-h-24 overflow-y-auto">{aboutBio[0]?.substring(0, 150)}...</div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Preview */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>Skills ({skills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 8).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill.name} ({skill.level}%)
                </Badge>
              ))}
              {skills.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{skills.length - 8} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects Preview */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>Projects ({projects.filter((p) => p.featured).length} featured)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects
                .filter((p) => p.featured)
                .slice(0, 3)
                .map((project) => (
                  <div key={project.id} className="p-3 rounded-lg bg-zinc-800/30">
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <p className="text-xs text-zinc-400 truncate">{project.description}</p>
                    <div className="flex gap-1 mt-2">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience Preview */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>Experience ({experience.length} positions)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {experience.slice(0, 3).map((exp) => (
                <div key={exp.id} className="p-3 rounded-lg bg-zinc-800/30">
                  <h4 className="font-medium text-sm">{exp.position}</h4>
                  <p className="text-xs text-zinc-400">
                    {exp.company} • {exp.duration}
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Links Preview */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>Social Links ({socialLinks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center">
                    <div className="w-3 h-3 bg-zinc-400 rounded"></div>
                  </div>
                  <div>
                    <span className="font-medium">{link.platform}</span>
                    <span className="text-zinc-400 ml-2 text-xs">
                      {link.url.replace(/^https?:\/\//, "").substring(0, 30)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
