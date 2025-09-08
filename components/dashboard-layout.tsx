"use client"

import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  User,
  Code,
  FolderOpen,
  Briefcase,
  Eye,
  ArrowLeft,
  Settings,
  Link2,
  Monitor,
  Rocket,
  Menu,
  X,
} from "lucide-react"
import { useSiteContentStore } from "@/lib/site-content-store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type DashboardSection =
  | "overview"
  | "personal"
  | "social"
  | "skills"
  | "projects"
  | "experience"
  | "preview"
  | "publish"

interface DashboardLayoutProps {
  children: ReactNode
  activeSection: DashboardSection
  onSectionChange: (section: DashboardSection) => void
}

export function DashboardLayout({ children, activeSection, onSectionChange }: DashboardLayoutProps) {
  const { content: siteContent } = useSiteContentStore()
  const isMobile = useIsMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    } else {
      setIsCollapsed(false)
    }
  }, [isMobile])

  const navigationItems = [
    {
      id: "overview" as const,
      label: siteContent.admin.dashboard.sections.find((s) => s.id === "overview")?.label || "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "personal" as const,
      label: siteContent.admin.dashboard.sections.find((s) => s.id === "personal")?.label || "Personal Info",
      icon: User,
    },
    {
      id: "social" as const,
      label: siteContent.admin.dashboard.sections.find((s) => s.id === "social")?.label || "Social Links",
      icon: Link2,
    },
    {
      id: "skills" as const,
      label: siteContent.admin.dashboard.sections.find((s) => s.id === "skills")?.label || "Skills",
      icon: Code,
    },
    {
      id: "projects" as const,
      label: siteContent.admin.dashboard.sections.find((s) => s.id === "projects")?.label || "Projects",
      icon: FolderOpen,
    },
    {
      id: "experience" as const,
      label: siteContent.admin.dashboard.sections.find((s) => s.id === "experience")?.label || "Experience",
      icon: Briefcase,
    },
    {
      id: "preview" as const,
      label: siteContent.admin.dashboard.sections.find((s) => s.id === "preview")?.label || "Preview",
      icon: Monitor,
    },
    {
      id: "publish" as const,
      label: siteContent.admin.dashboard.sections.find((s) => s.id === "publish")?.label || "Publish",
      icon: Rocket,
    },
  ]

  const SidebarContent = () => (
    <TooltipProvider delayDuration={0}>
      <nav className={cn("space-y-1", isMobile ? "p-4" : "p-3")}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          const buttonContent = (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id)
                if (isMobile) {
                  setIsSidebarOpen(false)
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                "text-xs sm:text-sm font-medium",
                isActive
                  ? "bg-theme-primary/20 text-theme-primary border border-theme-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                isCollapsed && !isMobile && "justify-center px-2",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {(!isCollapsed || isMobile) && (
                <span className="truncate transition-opacity duration-200">
                  {item.label}
                </span>
              )}
            </button>
          )

          if (isCollapsed && !isMobile) {
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  {buttonContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          }

          return buttonContent
        })}
      </nav>
    </TooltipProvider>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile menu button */}
            {isMobile && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground p-2 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border">
                      <h2 className="text-lg font-semibold">Navigation</h2>
                    </div>
                    <SidebarContent />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Desktop collapse button */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-muted-foreground hover:text-foreground p-2 hidden md:flex"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            )}

            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{siteContent.admin.dashboard.backToPortfolioText}</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-border hidden md:block" />
            <h1 className="text-lg md:text-xl font-semibold truncate">
              {siteContent.admin.dashboard.title}
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:text-foreground bg-transparent text-xs sm:text-sm px-2 sm:px-3"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{siteContent.admin.dashboard.previewSiteText}</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1 sm:p-2">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside
            className={cn(
              "border-r border-border bg-card/30 min-h-[calc(100vh-73px)] transition-all duration-300 ease-in-out",
              isCollapsed ? "w-16" : "w-64"
            )}
          >
            <SidebarContent />
          </aside>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "p-4 sm:p-6",
          "min-h-0" // Prevent content from overflowing
        )}>
          <div className="w-full max-w-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
