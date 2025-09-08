"use client"

import type React from "react"
import { useState } from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Settings, Palette, User, FileText, Mail, BarChart3, ArrowLeft, Type, Menu, X, LogOut, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthProvider, useAuth } from "@/lib/auth-context"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Theme Manager",
    href: "/admin/themes",
    icon: Palette,
  },
  {
    title: "Profile Settings",
    href: "/admin/profile",
    icon: User,
  },
  {
    title: "Site Content",
    href: "/admin/site-content",
    icon: Type,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    title: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading, isAuthenticated } = useAuth()

  console.log('Admin Layout: Auth state - user:', !!user, 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not loading, this shouldn't happen due to middleware
  // but just in case, show a message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need to log in to access the admin dashboard.</p>
          <Button onClick={() => router.push('/login')} variant="outline">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-muted-foreground hover:text-foreground p-2 md:flex hidden"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Site</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link href="/admin" className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              <span className="font-semibold hidden sm:inline">Admin Dashboard</span>
              <span className="font-semibold sm:hidden">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Welcome, {user.name || user.email}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar - Made responsive with mobile drawer */}
        <aside
          className={cn(
            "hidden md:block border-r border-border bg-muted/10 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <nav className="p-4 space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full transition-all duration-200",
                      isSidebarCollapsed ? "justify-center px-2" : "justify-start gap-2",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                    title={isSidebarCollapsed ? item.title : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="truncate transition-opacity duration-200">
                        {item.title}
                      </span>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Navigation - Added mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
          <nav className="flex justify-around p-2">
            {adminNavItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="flex flex-col gap-1 h-auto py-2 px-3"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.title.split(" ")[0]}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Tablet/Desktop Toggle - Show when sidebar is available */}
        <div className="hidden md:flex fixed bottom-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="rounded-full shadow-lg bg-background/95 backdrop-blur border-border"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Admin Content - Added responsive padding for mobile */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutInner>{children}</AdminLayoutInner>
}
