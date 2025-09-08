"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Shield, Database, Mail, Code, Save, Download, Upload, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SiteSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteSettings, setSiteSettings] = useState({
    siteName: "My Portfolio",
    siteDescription: "A showcase of my work and skills",
    siteUrl: "https://myportfolio.com",
    language: "en",
    timezone: "UTC",
    maintenanceMode: false,
    allowComments: true,
    enableAnalytics: true,
    enableSEO: true,
  })

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "My Portfolio - Web Developer",
    metaDescription: "Professional web developer specializing in React, Node.js, and modern web technologies.",
    metaKeywords: "web developer, react, nodejs, javascript, portfolio",
    ogImage: "",
    twitterHandle: "@myhandle",
    googleAnalyticsId: "",
    googleSearchConsole: "",
  })

  const [emailSettings, setEmailSettings] = useState({
    contactEmail: "contact@myportfolio.com",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    enableEmailNotifications: true,
    autoReplyEnabled: false,
    autoReplyMessage: "Thank you for your message. I'll get back to you soon!",
  })

  const [securitySettings, setSecuritySettings] = useState({
    enableRateLimit: true,
    maxRequestsPerMinute: 60,
    enableCaptcha: false,
    captchaSiteKey: "",
    captchaSecretKey: "",
    enableCSP: true,
    allowedDomains: "myportfolio.com, *.myportfolio.com",
  })

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access settings.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        const settings = result.data

        // Update all settings states
        setSiteSettings({
          siteName: settings.siteName || "My Portfolio",
          siteDescription: settings.siteDescription || "A showcase of my work and skills",
          siteUrl: settings.siteUrl || "https://myportfolio.com",
          language: settings.language || "en",
          timezone: settings.timezone || "UTC",
          maintenanceMode: settings.maintenanceMode || false,
          allowComments: settings.allowComments || true,
          enableAnalytics: settings.enableAnalytics || true,
          enableSEO: settings.enableSEO || true,
        })

        setEmailSettings({
          contactEmail: settings.contactEmail || "contact@myportfolio.com",
          smtpHost: settings.smtpHost || "",
          smtpPort: settings.smtpPort || "587",
          smtpUser: settings.smtpUser || "",
          smtpPassword: settings.smtpPassword || "",
          enableEmailNotifications: settings.enableEmailNotifications || true,
          autoReplyEnabled: settings.autoReplyEnabled || false,
          autoReplyMessage: settings.autoReplyMessage || "Thank you for your message. I'll get back to you soon!",
        })

        setSecuritySettings({
          enableRateLimit: settings.enableRateLimit || true,
          maxRequestsPerMinute: settings.maxRequestsPerMinute || 60,
          enableCaptcha: settings.enableCaptcha || false,
          captchaSiteKey: settings.captchaSiteKey || "",
          captchaSecretKey: settings.captchaSecretKey || "",
          enableCSP: settings.enableCSP || true,
          allowedDomains: settings.allowedDomains || "myportfolio.com, *.myportfolio.com",
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSiteSettingChange = (key: string, value: any) => {
    setSiteSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSeoSettingChange = (key: string, value: string) => {
    setSeoSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleEmailSettingChange = (key: string, value: any) => {
    setEmailSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSecuritySettingChange = (key: string, value: any) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))
  }

  const exportSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to export settings.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        const allSettings = {
          site: siteSettings,
          seo: seoSettings,
          email: emailSettings,
          security: securitySettings,
          database: result.data,
        }
        const dataStr = JSON.stringify(allSettings, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = "site-settings.json"
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export settings:', error)
      toast({
        title: "Export Error",
        description: "Failed to export settings.",
        variant: "destructive",
      })
    }
  }

  const saveAllSettings = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save settings.",
          variant: "destructive",
        })
        return
      }

      const settingsToSave = {
        ...siteSettings,
        ...emailSettings,
        ...securitySettings,
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settingsToSave),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Settings saved successfully!",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast({
        title: "Save Error",
        description: error instanceof Error ? error.message : "Failed to save settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Site Settings</h1>
            <p className="text-muted-foreground">Configure your portfolio site settings and preferences</p>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-1/6"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-1/6"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Configure your portfolio site settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          <Button
            onClick={saveAllSettings}
            disabled={saving || loading}
            className="relative overflow-hidden group bg-gradient-primary border-0 text-white hover:shadow-elevation-medium"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={siteSettings.siteName}
                    onChange={(e) => handleSiteSettingChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input
                    id="site-url"
                    value={siteSettings.siteUrl}
                    onChange={(e) => handleSiteSettingChange("siteUrl", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={siteSettings.siteDescription}
                  onChange={(e) => handleSiteSettingChange("siteDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={siteSettings.language}
                    onValueChange={(value) => handleSiteSettingChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={siteSettings.timezone}
                    onValueChange={(value) => handleSiteSettingChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Site Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                    </div>
                    <Switch
                      checked={siteSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleSiteSettingChange("maintenanceMode", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Allow Comments</Label>
                      <p className="text-sm text-muted-foreground">Enable comments on projects</p>
                    </div>
                    <Switch
                      checked={siteSettings.allowComments}
                      onCheckedChange={(checked) => handleSiteSettingChange("allowComments", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">Track site visitors and behavior</p>
                    </div>
                    <Switch
                      checked={siteSettings.enableAnalytics}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableAnalytics", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>SEO Optimization</Label>
                      <p className="text-sm text-muted-foreground">Enable search engine optimization</p>
                    </div>
                    <Switch
                      checked={siteSettings.enableSEO}
                      onCheckedChange={(checked) => handleSiteSettingChange("enableSEO", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                SEO Settings
              </CardTitle>
              <CardDescription>Search engine optimization and meta tags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={seoSettings.metaTitle}
                  onChange={(e) => handleSeoSettingChange("metaTitle", e.target.value)}
                  placeholder="Your site title for search engines"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={seoSettings.metaDescription}
                  onChange={(e) => handleSeoSettingChange("metaDescription", e.target.value)}
                  placeholder="Brief description of your site (150-160 characters)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input
                  id="meta-keywords"
                  value={seoSettings.metaKeywords}
                  onChange={(e) => handleSeoSettingChange("metaKeywords", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter-handle">Twitter Handle</Label>
                  <Input
                    id="twitter-handle"
                    value={seoSettings.twitterHandle}
                    onChange={(e) => handleSeoSettingChange("twitterHandle", e.target.value)}
                    placeholder="@yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="og-image">Open Graph Image URL</Label>
                  <Input
                    id="og-image"
                    value={seoSettings.ogImage}
                    onChange={(e) => handleSeoSettingChange("ogImage", e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <Input
                    id="ga-id"
                    value={seoSettings.googleAnalyticsId}
                    onChange={(e) => handleSeoSettingChange("googleAnalyticsId", e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gsc-id">Google Search Console</Label>
                  <Input
                    id="gsc-id"
                    value={seoSettings.googleSearchConsole}
                    onChange={(e) => handleSeoSettingChange("googleSearchConsole", e.target.value)}
                    placeholder="Verification code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
              <CardDescription>Configure email notifications and SMTP settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={emailSettings.contactEmail}
                  onChange={(e) => handleEmailSettingChange("contactEmail", e.target.value)}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">SMTP Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={emailSettings.smtpHost}
                      onChange={(e) => handleEmailSettingChange("smtpHost", e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      value={emailSettings.smtpPort}
                      onChange={(e) => handleEmailSettingChange("smtpPort", e.target.value)}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">SMTP Username</Label>
                    <Input
                      id="smtp-user"
                      value={emailSettings.smtpUser}
                      onChange={(e) => handleEmailSettingChange("smtpUser", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => handleEmailSettingChange("smtpPassword", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Auto-Reply Settings</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Enable Auto-Reply</Label>
                    <p className="text-sm text-muted-foreground">Automatically respond to contact form submissions</p>
                  </div>
                  <Switch
                    checked={emailSettings.autoReplyEnabled}
                    onCheckedChange={(checked) => handleEmailSettingChange("autoReplyEnabled", checked)}
                  />
                </div>
                {emailSettings.autoReplyEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="auto-reply-message">Auto-Reply Message</Label>
                    <Textarea
                      id="auto-reply-message"
                      value={emailSettings.autoReplyMessage}
                      onChange={(e) => handleEmailSettingChange("autoReplyMessage", e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and protection settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Limit requests per minute</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableRateLimit}
                    onCheckedChange={(checked) => handleSecuritySettingChange("enableRateLimit", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>CAPTCHA Protection</Label>
                    <p className="text-sm text-muted-foreground">Protect forms from bots</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableCaptcha}
                    onCheckedChange={(checked) => handleSecuritySettingChange("enableCaptcha", checked)}
                  />
                </div>
              </div>

              {securitySettings.enableRateLimit && (
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Max Requests Per Minute</Label>
                  <Input
                    id="rate-limit"
                    type="number"
                    value={securitySettings.maxRequestsPerMinute}
                    onChange={(e) =>
                      handleSecuritySettingChange("maxRequestsPerMinute", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              )}

              {securitySettings.enableCaptcha && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="captcha-site-key">CAPTCHA Site Key</Label>
                    <Input
                      id="captcha-site-key"
                      value={securitySettings.captchaSiteKey}
                      onChange={(e) => handleSecuritySettingChange("captchaSiteKey", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="captcha-secret-key">CAPTCHA Secret Key</Label>
                    <Input
                      id="captcha-secret-key"
                      type="password"
                      value={securitySettings.captchaSecretKey}
                      onChange={(e) => handleSecuritySettingChange("captchaSecretKey", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Content Security Policy</Label>
                    <p className="text-sm text-muted-foreground">Enable CSP headers for security</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableCSP}
                    onCheckedChange={(checked) => handleSecuritySettingChange("enableCSP", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed-domains">Allowed Domains</Label>
                  <Input
                    id="allowed-domains"
                    value={securitySettings.allowedDomains}
                    onChange={(e) => handleSecuritySettingChange("allowedDomains", e.target.value)}
                    placeholder="example.com, *.example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>Advanced configuration and maintenance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Data Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Cache Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">Clear Page Cache</Button>
                  <Button variant="outline">Clear Image Cache</Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-medium text-destructive">Reset All Settings</h5>
                        <p className="text-sm text-muted-foreground mb-3">
                          This will reset all settings to their default values. This action cannot be undone.
                        </p>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Reset All Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
