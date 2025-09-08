"use client"

import { useState } from "react"
import { useContentStore } from "@/lib/content-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link2, Plus, Trash2, Save, Github, Linkedin, Mail, Twitter, Instagram, Globe } from "lucide-react"
import type { SocialLink } from "@/lib/types"

const iconOptions = [
  { value: "Github", label: "GitHub", icon: Github },
  { value: "Linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "Mail", label: "Email", icon: Mail },
  { value: "Twitter", label: "Twitter", icon: Twitter },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Globe", label: "Website", icon: Globe },
]

export function SocialLinksEditor() {
  const { content, updateSocialLinks } = useContentStore()
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(content.socialLinks)

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "", icon: "Globe" }])
  }

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = socialLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    setSocialLinks(updatedLinks)
  }

  const handleSave = () => {
    const validLinks = socialLinks.filter((link) => link.platform.trim() !== "" && link.url.trim() !== "")
    updateSocialLinks(validLinks)
    console.log("[v0] Social links saved:", validLinks)
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((option) => option.value === iconName)
    return iconOption ? iconOption.icon : Globe
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Social Links</h2>
          <p className="text-zinc-400">Manage your social media and contact links</p>
        </div>
        <Button onClick={addSocialLink} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Social Links ({socialLinks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {socialLinks.map((link, index) => {
            const IconComponent = getIconComponent(link.icon)
            return (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/30">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-700">
                  <IconComponent className="h-5 w-5 text-zinc-300" />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                      placeholder="e.g., GitHub, LinkedIn"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                      placeholder="https://..."
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select value={link.icon} onValueChange={(value) => updateSocialLink(index, "icon", value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => {
                          const OptionIcon = option.icon
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <OptionIcon className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}

          {socialLinks.length === 0 && (
            <div className="text-center py-8 text-zinc-400">
              <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No social links added yet. Click "Add Link" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          Save Social Links
        </Button>
      </div>
    </div>
  )
}
