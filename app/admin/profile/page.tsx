"use client"

import { useState } from "react"
import { useContentStore } from "@/lib/content-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Save, Upload, Shield, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfileSettingsPage() {
  const { toast } = useToast()
  const { content, updatePersonalInfo } = useContentStore()
  const [formData, setFormData] = useState(content.personalInfo)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  const handleSave = () => {
    updatePersonalInfo(formData)
    // Show success message
    toast({
      title: "Success!",
      description: "Profile updated successfully!",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Profile Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your personal information and account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt={formData.name} />
                  <AvatarFallback className="text-lg">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="text-sm sm:text-base">
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
              <div className="space-y-2">
                <Badge
                  variant={formData.availabilityStatus === "available" ? "default" : "secondary"}
                  className="w-full justify-center"
                >
                  {formData.availability}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
              <CardDescription className="text-sm">Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Bio</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability-status">Availability Status</Label>
                <Select
                  value={formData.availabilityStatus}
                  onValueChange={(value) => handleInputChange("availabilityStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available for work</SelectItem>
                    <SelectItem value="busy">Currently busy</SelectItem>
                    <SelectItem value="unavailable">Not available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-sm">Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                <div>
                  <Label className="font-medium">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {key === "emailNotifications" && "Receive email notifications for important updates"}
                    {key === "projectUpdates" && "Get notified about project-related activities"}
                    {key === "securityAlerts" && "Important security and account alerts"}
                    {key === "marketingEmails" && "Promotional emails and newsletters"}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            Security Settings
          </CardTitle>
          <CardDescription className="text-sm">Manage your account security and privacy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <Button variant="outline" className="justify-start bg-transparent text-sm sm:text-base">
              Change Password
            </Button>
            <Button variant="outline" className="justify-start bg-transparent text-sm sm:text-base">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="justify-start bg-transparent text-sm sm:text-base">
              Login Sessions
            </Button>
            <Button variant="outline" className="justify-start bg-transparent text-sm sm:text-base">
              Privacy Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} className="relative overflow-hidden group bg-gradient-primary border-0 text-white hover:shadow-elevation-medium flex items-center gap-2 text-sm sm:text-base">
          <Save className="h-3 w-3 sm:h-4 sm:w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
