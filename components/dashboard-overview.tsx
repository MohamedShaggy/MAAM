"use client"

import { useContentStore } from "@/lib/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Code, FolderOpen, Briefcase, Mail, MapPin } from "lucide-react"

export function DashboardOverview() {
  const { content } = useContentStore()

  const stats = [
    {
      title: "Skills",
      value: content.skills.length,
      icon: Code,
      color: "text-info", // Updated to use theme-aware info color
    },
    {
      title: "Projects",
      value: content.projects.length,
      icon: FolderOpen,
      color: "text-success", // Updated to use theme-aware success color
    },
    {
      title: "Experience",
      value: content.experience.length,
      icon: Briefcase,
      color: "text-primary", // Updated to use theme-aware primary color
    },
    {
      title: "Social Links",
      value: content.socialLinks.length,
      icon: User,
      color: "text-accent", // Updated to use theme-aware accent color
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Manage your portfolio content from here</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card/50 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Info Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{content.personalInfo.name}</h3>
              <p className="text-muted-foreground">{content.personalInfo.title}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {content.personalInfo.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {content.personalInfo.location}
            </div>
            <Badge
              variant={content.personalInfo.availabilityStatus === "available" ? "default" : "secondary"}
              className={content.personalInfo.availabilityStatus === "available" ? "bg-success/20 text-success" : ""}
            >
              {content.personalInfo.availability}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                  <div>
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">{project.description}</p>
                  </div>
                  <Badge variant="outline" className="border-zinc-600">
                    {project.tags[0]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
