"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export interface CustomTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
  }
  fonts: {
    heading: string
    body: string
  }
  animations: {
    duration: string
    easing: string
  }
}

const defaultThemes: Record<string, CustomTheme> = {
  dark: {
    name: "Dark",
    colors: {
      primary: "240 5.9% 10%",
      secondary: "240 3.7% 15.9%",
      accent: "240 4.8% 95.9%",
      background: "240 10% 3.9%",
      foreground: "0 0% 98%",
      muted: "240 3.7% 15.9%",
      border: "240 3.7% 15.9%",
    },
    fonts: {
      heading: "var(--font-sans)",
      body: "var(--font-sans)",
    },
    animations: {
      duration: "0.3s",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  light: {
    name: "Light",
    colors: {
      primary: "240 5.9% 10%",
      secondary: "240 4.8% 95.9%",
      accent: "240 5.9% 10%",
      background: "0 0% 100%",
      foreground: "240 10% 3.9%",
      muted: "240 4.8% 95.9%",
      border: "240 5.9% 90%",
    },
    fonts: {
      heading: "var(--font-sans)",
      body: "var(--font-sans)",
    },
    animations: {
      duration: "0.3s",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
}

const CustomThemeContext = React.createContext<{
  customThemes: Record<string, CustomTheme>
  activeCustomTheme: string | null
  setCustomTheme: (theme: CustomTheme) => void
  applyCustomTheme: (themeName: string) => void
  removeCustomTheme: (themeName: string) => void
}>({
  customThemes: defaultThemes,
  activeCustomTheme: null,
  setCustomTheme: () => {},
  applyCustomTheme: () => {},
  removeCustomTheme: () => {},
})

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [customThemes, setCustomThemes] = React.useState<Record<string, CustomTheme>>(defaultThemes)
  const [activeCustomTheme, setActiveCustomTheme] = React.useState<string | null>(null)

  const applyThemeVariables = React.useCallback((theme: CustomTheme) => {
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
    root.style.setProperty("--font-heading", theme.fonts.heading)
    root.style.setProperty("--font-body", theme.fonts.body)
    root.style.setProperty("--animation-duration", theme.animations.duration)
    root.style.setProperty("--animation-easing", theme.animations.easing)
  }, [])

  const setCustomTheme = React.useCallback((theme: CustomTheme) => {
    setCustomThemes((prev) => ({
      ...prev,
      [theme.name.toLowerCase()]: theme,
    }))
  }, [])

  const applyCustomTheme = React.useCallback(
    (themeName: string) => {
      const theme = customThemes[themeName.toLowerCase()]
      if (theme) {
        setActiveCustomTheme(themeName.toLowerCase())
        applyThemeVariables(theme)
      }
    },
    [customThemes, applyThemeVariables],
  )

  const removeCustomTheme = React.useCallback(
    (themeName: string) => {
      setCustomThemes((prev) => {
        const newThemes = { ...prev }
        delete newThemes[themeName.toLowerCase()]
        return newThemes
      })
      if (activeCustomTheme === themeName.toLowerCase()) {
        setActiveCustomTheme(null)
      }
    },
    [activeCustomTheme],
  )

  return (
    <CustomThemeContext.Provider
      value={{
        customThemes,
        activeCustomTheme,
        setCustomTheme,
        applyCustomTheme,
        removeCustomTheme,
      }}
    >
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </CustomThemeContext.Provider>
  )
}

export const useCustomTheme = () => {
  const context = React.useContext(CustomThemeContext)
  if (!context) {
    throw new Error("useCustomTheme must be used within a ThemeProvider")
  }
  return context
}
