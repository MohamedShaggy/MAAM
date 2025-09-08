"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PersonalInfoEditor } from "@/components/personal-info-editor"
import { SocialLinksEditor } from "@/components/social-links-editor"
import { SkillsEditor } from "@/components/skills-editor"
import { ProjectsEditor } from "@/components/projects-editor"
import { ExperienceEditor } from "@/components/experience-editor"
import { ContentPreview } from "@/components/content-preview"
import { PublishingControls } from "@/components/publishing-controls"
import { useContentStore } from "@/lib/content-store"

type DashboardSection =
  | "overview"
  | "personal"
  | "social"
  | "skills"
  | "projects"
  | "experience"
  | "preview"
  | "publish"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview")
  const { loadContent } = useContentStore()

  useEffect(() => {
    // Load fresh content from database when entering admin mode
    loadContent()
  }, [loadContent])

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "personal":
        return <PersonalInfoEditor />
      case "social":
        return <SocialLinksEditor />
      case "skills":
        return <SkillsEditor />
      case "projects":
        return <ProjectsEditor />
      case "experience":
        return <ExperienceEditor />
      case "preview":
        return <ContentPreview />
      case "publish":
        return <PublishingControls />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  )
}
