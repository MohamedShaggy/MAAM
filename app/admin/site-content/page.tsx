"use client"

import { useState } from "react"
import { useSiteContentStore } from "@/lib/site-content-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, RotateCcw, Navigation, MessageSquare, Settings, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SiteContentPage() {
  const { toast } = useToast()
  const {
    content,
    updateMetadata,
    updateNavigation,
    updateSection,
    updateForms,
    updateAdmin,
    updateFooter,
    updateStatus,
    updateAccessibility,
    resetToDefaults,
  } = useSiteContentStore()

  const [formData, setFormData] = useState(content)
  const [hasChanges, setHasChanges] = useState(false)

  const handleInputChange = (section: string, field: string, value: string | any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [field]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  const handleMenuItemChange = (index: number, field: string, value: string) => {
    const newMenuItems = [...formData.navigation.menuItems]
    newMenuItems[index] = { ...newMenuItems[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        menuItems: newMenuItems,
      },
    }))
    setHasChanges(true)
  }

  const addMenuItem = () => {
    const newMenuItems = [...formData.navigation.menuItems, { name: "New Item", href: "#new" }]
    setFormData((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        menuItems: newMenuItems,
      },
    }))
    setHasChanges(true)
  }

  const removeMenuItem = (index: number) => {
    const newMenuItems = formData.navigation.menuItems.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        menuItems: newMenuItems,
      },
    }))
    setHasChanges(true)
  }

  const saveChanges = () => {
    updateMetadata(formData.metadata)
    updateNavigation(formData.navigation)
    updateSection("hero", formData.sections.hero)
    updateSection("about", formData.sections.about)
    updateSection("skills", formData.sections.skills)
    updateSection("projects", formData.sections.projects)
    updateSection("experience", formData.sections.experience)
    updateSection("contact", formData.sections.contact)
    updateForms(formData.forms)
    updateAdmin(formData.admin)
    updateFooter(formData.footer)
    updateStatus(formData.status)
    updateAccessibility(formData.accessibility)
    setHasChanges(false)
    toast({
      title: "Success!",
      description: "Site content updated successfully!",
    })
  }

  const resetChanges = () => {
    setFormData(content)
    setHasChanges(false)
  }

  const resetToDefaultContent = () => {
    if (confirm("Are you sure you want to reset all content to defaults? This cannot be undone.")) {
      resetToDefaults()
      setFormData(content)
      setHasChanges(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Site Content Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage all text content, labels, and messages across your portfolio</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse text-xs">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={resetChanges} disabled={!hasChanges} size="sm" className="text-sm sm:text-base">
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button onClick={saveChanges} disabled={!hasChanges} size="sm" className="relative overflow-hidden group bg-gradient-primary border-0 text-white hover:shadow-elevation-medium text-sm sm:text-base">
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="metadata" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="metadata" className="text-xs sm:text-sm">Metadata</TabsTrigger>
          <TabsTrigger value="navigation" className="text-xs sm:text-sm">Navigation</TabsTrigger>
          <TabsTrigger value="sections" className="text-xs sm:text-sm">Sections</TabsTrigger>
          <TabsTrigger value="forms" className="text-xs sm:text-sm">Forms</TabsTrigger>
          <TabsTrigger value="admin" className="text-xs sm:text-sm">Admin</TabsTrigger>
          <TabsTrigger value="misc" className="text-xs sm:text-sm">Misc</TabsTrigger>
        </TabsList>

        <TabsContent value="metadata" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                Site Metadata
              </CardTitle>
              <CardDescription className="text-sm">SEO and browser metadata for your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input
                  id="site-title"
                  value={formData.metadata.title}
                  onChange={(e) => handleInputChange("metadata", "title", e.target.value)}
                  placeholder="Your Portfolio - Professional Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Meta Description</Label>
                <Textarea
                  id="site-description"
                  value={formData.metadata.description}
                  onChange={(e) => handleInputChange("metadata", "description", e.target.value)}
                  placeholder="A modern, responsive portfolio showcasing..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generator">Generator</Label>
                <Input
                  id="generator"
                  value={formData.metadata.generator}
                  onChange={(e) => handleInputChange("metadata", "generator", e.target.value)}
                  placeholder="v0.dev"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Navigation className="h-4 w-4 sm:h-5 sm:w-5" />
                Navigation Content
              </CardTitle>
              <CardDescription className="text-sm">Brand name, menu items, and navigation labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    value={formData.navigation.brandName}
                    onChange={(e) => handleInputChange("navigation", "brandName", e.target.value)}
                    placeholder="Shine"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-initials">Brand Initials</Label>
                  <Input
                    id="brand-initials"
                    value={formData.navigation.brandInitials}
                    onChange={(e) => handleInputChange("navigation", "brandInitials", e.target.value)}
                    placeholder="KKA"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume-button">Resume Button Text</Label>
                <Input
                  id="resume-button"
                  value={formData.navigation.resumeButtonText}
                  onChange={(e) => handleInputChange("navigation", "resumeButtonText", e.target.value)}
                  placeholder="Resume"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Menu Items</Label>
                  <Button size="sm" onClick={addMenuItem} className="relative overflow-hidden group bg-gradient-primary border-0 text-white hover:shadow-elevation-medium">
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.navigation.menuItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => handleMenuItemChange(index, "name", e.target.value)}
                          placeholder="Menu Item"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Link</Label>
                        <Input
                          value={item.href}
                          onChange={(e) => handleMenuItemChange(index, "href", e.target.value)}
                          placeholder="#section"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removeMenuItem(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Greeting Text</Label>
                  <Input
                    value={formData.sections.hero.greeting}
                    onChange={(e) => handleNestedInputChange("sections", "hero", "greeting", e.target.value)}
                    placeholder="Hi, I'm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Button</Label>
                  <Input
                    value={formData.sections.hero.primaryButtonText}
                    onChange={(e) => handleNestedInputChange("sections", "hero", "primaryButtonText", e.target.value)}
                    placeholder="View Projects"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button</Label>
                  <Input
                    value={formData.sections.hero.secondaryButtonText}
                    onChange={(e) => handleNestedInputChange("sections", "hero", "secondaryButtonText", e.target.value)}
                    placeholder="Contact Me"
                  />
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={formData.sections.about.title}
                    onChange={(e) => handleNestedInputChange("sections", "about", "title", e.target.value)}
                    placeholder="About Me"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Input
                    value={formData.sections.about.subtitle}
                    onChange={(e) => handleNestedInputChange("sections", "about", "subtitle", e.target.value)}
                    placeholder="My background and journey"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Name Label</Label>
                    <Input
                      value={formData.sections.about.nameLabel}
                      onChange={(e) => handleNestedInputChange("sections", "about", "nameLabel", e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Label</Label>
                    <Input
                      value={formData.sections.about.emailLabel}
                      onChange={(e) => handleNestedInputChange("sections", "about", "emailLabel", e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={formData.sections.skills.title}
                    onChange={(e) => handleNestedInputChange("sections", "skills", "title", e.target.value)}
                    placeholder="My Skills"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Input
                    value={formData.sections.skills.subtitle}
                    onChange={(e) => handleNestedInputChange("sections", "skills", "subtitle", e.target.value)}
                    placeholder="Technologies I work with"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={formData.sections.contact.title}
                    onChange={(e) => handleNestedInputChange("sections", "contact", "title", e.target.value)}
                    placeholder="Get In Touch"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Input
                    value={formData.sections.contact.subtitle}
                    onChange={(e) => handleNestedInputChange("sections", "contact", "subtitle", e.target.value)}
                    placeholder="Let's work together"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                Contact Form Content
              </CardTitle>
              <CardDescription className="text-sm">Form labels, placeholders, and messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="space-y-2">
                <Label>Form Title</Label>
                <Input
                  value={formData.forms.contact.title}
                  onChange={(e) => handleNestedInputChange("forms", "contact", "title", e.target.value)}
                  placeholder="Send Me a Message"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label>Name Placeholder</Label>
                  <Input
                    value={formData.forms.contact.namePlaceholder}
                    onChange={(e) => handleNestedInputChange("forms", "contact", "namePlaceholder", e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Placeholder</Label>
                  <Input
                    value={formData.forms.contact.emailPlaceholder}
                    onChange={(e) => handleNestedInputChange("forms", "contact", "emailPlaceholder", e.target.value)}
                    placeholder="Your Email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Submit Button Text</Label>
                <Input
                  value={formData.forms.contact.submitButtonText}
                  onChange={(e) => handleNestedInputChange("forms", "contact", "submitButtonText", e.target.value)}
                  placeholder="Send Message"
                />
              </div>
              <div className="space-y-2">
                <Label>Success Message</Label>
                <Input
                  value={formData.forms.contact.successTitle}
                  onChange={(e) => handleNestedInputChange("forms", "contact", "successTitle", e.target.value)}
                  placeholder="Message sent!"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                Admin Interface Content
              </CardTitle>
              <CardDescription className="text-sm">Admin dashboard labels and interface text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="space-y-2">
                <Label>Dashboard Title</Label>
                <Input
                  value={formData.admin.dashboard.title}
                  onChange={(e) => handleNestedInputChange("admin", "dashboard", "title", e.target.value)}
                  placeholder="Portfolio Dashboard"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label>Back to Portfolio Text</Label>
                  <Input
                    value={formData.admin.dashboard.backToPortfolioText}
                    onChange={(e) =>
                      handleNestedInputChange("admin", "dashboard", "backToPortfolioText", e.target.value)
                    }
                    placeholder="Back to Portfolio"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preview Site Text</Label>
                  <Input
                    value={formData.admin.dashboard.previewSiteText}
                    onChange={(e) => handleNestedInputChange("admin", "dashboard", "previewSiteText", e.target.value)}
                    placeholder="Preview Site"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="misc" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Footer & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input
                    value={formData.footer.copyrightText}
                    onChange={(e) => handleInputChange("footer", "copyrightText", e.target.value)}
                    placeholder="All rights reserved"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available Status</Label>
                  <Input
                    value={formData.status.available}
                    onChange={(e) => handleInputChange("status", "available", e.target.value)}
                    placeholder="Open to opportunities"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Busy Status</Label>
                  <Input
                    value={formData.status.busy}
                    onChange={(e) => handleInputChange("status", "busy", e.target.value)}
                    placeholder="Currently busy"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accessibility Labels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Admin Dashboard</Label>
                  <Input
                    value={formData.accessibility.adminDashboard}
                    onChange={(e) => handleInputChange("accessibility", "adminDashboard", e.target.value)}
                    placeholder="Admin Dashboard"
                  />
                </div>
                <div className="space-y-2">
                  <Label>More Options</Label>
                  <Input
                    value={formData.accessibility.moreOptions}
                    onChange={(e) => handleInputChange("accessibility", "moreOptions", e.target.value)}
                    placeholder="More options"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Close Menu</Label>
                  <Input
                    value={formData.accessibility.closeMenu}
                    onChange={(e) => handleInputChange("accessibility", "closeMenu", e.target.value)}
                    placeholder="Close menu"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions that affect all site content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={resetToDefaultContent}>
                Reset All Content to Defaults
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
