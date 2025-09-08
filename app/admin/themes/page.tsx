"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Palette, Monitor, Sun, Moon } from "lucide-react"

const predefinedThemes = [
  { id: "light", name: "Light", description: "Clean and bright" },
  { id: "dark", name: "Dark", description: "Easy on the eyes" },
  { id: "system", name: "System", description: "Follows your device" },
]

export default function ThemeManagerPage() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Theme Manager</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Customize the appearance and feel of your portfolio</p>
      </div>

      <Tabs defaultValue="presets" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets" className="text-xs sm:text-sm">Theme Presets</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs sm:text-sm">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                Available Themes
              </CardTitle>
              <CardDescription className="text-sm">Choose from predefined themes</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {predefinedThemes.map((themeOption) => (
                  <Card
                    key={themeOption.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      theme === themeOption.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleThemeChange(themeOption.id)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{themeOption.name}</h3>
                        {theme === themeOption.id && <Badge variant="secondary">Active</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{themeOption.description}</p>
                      <div className="flex items-center gap-2">
                        {themeOption.id === "light" && <Sun className="h-4 w-4" />}
                        {themeOption.id === "dark" && <Moon className="h-4 w-4" />}
                        {themeOption.id === "system" && <Monitor className="h-4 w-4" />}
                        <span className="text-xs text-muted-foreground">
                          {themeOption.id === "system" ? "Auto" : themeOption.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Advanced Theme Settings</CardTitle>
              <CardDescription className="text-sm">Fine-tune advanced theme properties and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Animation Settings</h4>
                  <div className="flex items-center justify-between">
                    <Label>Reduced Motion</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Smooth Scrolling</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Page Transitions</Label>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Display Settings</h4>
                  <div className="flex items-center justify-between">
                    <Label>High Contrast Mode</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Large Text</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Focus Indicators</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
