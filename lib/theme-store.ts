"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CustomTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
    input: string
    ring: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    destructive: string
    destructiveForeground: string
    gradientFrom: string
    gradientTo: string
    gradientVia?: string
    success: string
    warning: string
    error: string
    info: string
  }
  typography: {
    fontFamily: string
    fontSize: number
    lineHeight: number
  }
  spacing: {
    radius: number
    padding: number
    margin: number
  }
  animations: {
    enabled: boolean
    duration: number
    easing: string
  }
  effects: {
    glassmorphism: boolean
    shadows: boolean
    blurIntensity: number
    gradientIntensity: number
  }
  createdAt: Date
  updatedAt: Date
}

interface ThemeStore {
  customThemes: CustomTheme[]
  activeCustomTheme: string | null
  previewTheme: CustomTheme | null
  isPreviewMode: boolean

  // Actions
  addCustomTheme: (theme: Omit<CustomTheme, "id" | "createdAt" | "updatedAt">) => void
  updateCustomTheme: (id: string, updates: Partial<CustomTheme>) => void
  deleteCustomTheme: (id: string) => void
  setActiveCustomTheme: (id: string | null) => void
  setPreviewTheme: (theme: CustomTheme | null) => void
  setPreviewMode: (enabled: boolean) => void
  exportTheme: (id: string) => string
  importTheme: (themeData: string) => boolean
  resetToDefaults: () => void
  applyThemeToCSS: (theme: CustomTheme) => void
  resetThemeCSS: () => void
  getCurrentTheme: () => CustomTheme | null
  mergeWithDefaults: (theme: CustomTheme) => CustomTheme
}

const defaultTheme: Omit<CustomTheme, "id" | "name" | "createdAt" | "updatedAt"> = {
  colors: {
    primary: "262 83% 58%", // Purple - matches CSS
    secondary: "252 75% 60%", // Purple-blue - matches CSS
    accent: "316 72% 69%", // Pink - matches CSS
    background: "0 0% 100%", // White
    foreground: "240 10% 3.9%", // Dark text
    muted: "240 4.8% 95.9%", // Light gray
    mutedForeground: "240 3.8% 46.1%", // Medium gray text
    border: "240 5.9% 90%", // Light border
    input: "240 5.9% 90%", // Input background
    ring: "262 83% 58%", // Primary color for focus rings
    card: "0 0% 100%", // White card background
    cardForeground: "240 10% 3.9%", // Dark text on cards
    popover: "0 0% 100%", // White popover background
    popoverForeground: "240 10% 3.9%", // Dark text on popovers
    destructive: "0 84.2% 60.2%", // Red for destructive actions
    destructiveForeground: "0 0% 98%", // White text on red
    gradientFrom: "262 83% 58%", // Purple gradient start
    gradientTo: "316 72% 69%", // Pink gradient end
    gradientVia: "292 84% 61%", // Purple-pink midpoint
    success: "160 84% 39%", // Green for success
    warning: "38 92% 50%", // Amber for warnings
    error: "0 84% 60%", // Red for errors
    info: "217 91% 60%", // Blue for info
  },
  typography: {
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 1.5,
  },
  spacing: {
    radius: 8,
    padding: 16,
    margin: 16,
  },
  animations: {
    enabled: true,
    duration: 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  effects: {
    glassmorphism: true,
    shadows: true,
    blurIntensity: 20,
    gradientIntensity: 0.2,
  },
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initialize with no active theme to prevent CSS variable conflicts
      customThemes: [],
      activeCustomTheme: null,
      previewTheme: null,
      isPreviewMode: false,

      addCustomTheme: (theme) => {
        const newTheme: CustomTheme = {
          ...theme,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          customThemes: [...state.customThemes, newTheme],
        }))
      },

      updateCustomTheme: (id, updates) => {
        set((state) => ({
          customThemes: state.customThemes.map((theme) =>
            theme.id === id ? { ...theme, ...updates, updatedAt: new Date() } : theme,
          ),
        }))
      },

      deleteCustomTheme: (id) => {
        set((state) => ({
          customThemes: state.customThemes.filter((theme) => theme.id !== id),
          activeCustomTheme: state.activeCustomTheme === id ? null : state.activeCustomTheme,
        }))
      },

      setActiveCustomTheme: (id) => {
        set({ activeCustomTheme: id })
        if (id === null) {
          // Reset to default theme - remove custom theme CSS variables
          get().resetThemeCSS()
        } else {
          const theme = get().customThemes.find((t) => t.id === id)
          if (theme) {
            const mergedTheme = get().mergeWithDefaults(theme)
            get().applyThemeToCSS(mergedTheme)
          }
        }
      },

      setPreviewTheme: (theme) => {
        set({ previewTheme: theme })
        if (theme) {
          const mergedTheme = get().mergeWithDefaults(theme)
          get().applyThemeToCSS(mergedTheme)
        } else {
          // Reset to default theme when clearing preview
          get().resetThemeCSS()
        }
      },

      setPreviewMode: (enabled) => {
        set({ isPreviewMode: enabled })
      },

      exportTheme: (id) => {
        const theme = get().customThemes.find((t) => t.id === id)
        if (!theme) return ""
        return JSON.stringify(theme, null, 2)
      },

      importTheme: (themeData) => {
        try {
          const theme = JSON.parse(themeData) as CustomTheme
          if (!theme.name || !theme.colors || !theme.typography) {
            return false
          }
          get().addCustomTheme({
            name: theme.name,
            colors: { ...defaultTheme.colors, ...theme.colors },
            typography: { ...defaultTheme.typography, ...theme.typography },
            spacing: { ...defaultTheme.spacing, ...(theme.spacing || {}) },
            animations: { ...defaultTheme.animations, ...(theme.animations || {}) },
            effects: { ...defaultTheme.effects, ...(theme.effects || {}) },
          })
          return true
        } catch {
          return false
        }
      },

      resetToDefaults: () => {
        set({
          customThemes: [],
          activeCustomTheme: null,
          previewTheme: null,
          isPreviewMode: false,
        })
        // Also reset CSS variables when resetting to defaults
        get().resetThemeCSS()
      },

      applyThemeToCSS: (theme) => {
        const root = document.documentElement

        const colors = theme.colors || defaultTheme.colors
        const spacing = theme.spacing || defaultTheme.spacing
        const animations = theme.animations || defaultTheme.animations
        const effects = theme.effects || defaultTheme.effects

        // Apply HSL color values (already in HSL format)
        root.style.setProperty("--theme-primary", colors.primary || defaultTheme.colors.primary)
        root.style.setProperty("--theme-secondary", colors.secondary || defaultTheme.colors.secondary)
        root.style.setProperty("--theme-accent", colors.accent || defaultTheme.colors.accent)
        root.style.setProperty("--theme-gradient-from", colors.gradientFrom || defaultTheme.colors.gradientFrom)
        root.style.setProperty("--theme-gradient-to", colors.gradientTo || defaultTheme.colors.gradientTo)
        root.style.setProperty(
          "--theme-gradient-via",
          colors.gradientVia || colors.primary || defaultTheme.colors.primary,
        )
        root.style.setProperty("--theme-success", colors.success || defaultTheme.colors.success)
        root.style.setProperty("--theme-warning", colors.warning || defaultTheme.colors.warning)
        root.style.setProperty("--theme-error", colors.error || defaultTheme.colors.error)
        root.style.setProperty("--theme-info", colors.info || defaultTheme.colors.info)

        root.style.setProperty("--theme-radius", `${spacing.radius || defaultTheme.spacing.radius}px`)

        root.style.setProperty("--theme-duration", `${animations.duration || defaultTheme.animations.duration}ms`)
        root.style.setProperty("--theme-easing", animations.easing || defaultTheme.animations.easing)

        root.style.setProperty("--theme-blur", `${effects.blurIntensity || defaultTheme.effects.blurIntensity}px`)
        root.style.setProperty(
          "--theme-gradient-opacity",
          (effects.gradientIntensity || defaultTheme.effects.gradientIntensity).toString(),
        )
      },

      resetThemeCSS: () => {
        const root = document.documentElement
        // Remove custom theme CSS variables to allow light/dark mode CSS to work
        const themeVars = [
          '--theme-primary', '--theme-secondary', '--theme-accent',
          '--theme-gradient-from', '--theme-gradient-to', '--theme-gradient-via',
          '--theme-success', '--theme-warning', '--theme-error', '--theme-info',
          '--theme-radius', '--theme-duration', '--theme-easing',
          '--theme-blur', '--theme-gradient-opacity'
        ]
        themeVars.forEach(varName => {
          root.style.removeProperty(varName)
        })
      },

      getCurrentTheme: () => {
        const state = get()
        if (state.previewTheme && state.isPreviewMode) {
          return state.previewTheme
        }
        if (state.activeCustomTheme) {
          return state.customThemes.find((t) => t.id === state.activeCustomTheme) || null
        }
        return null
      },

      mergeWithDefaults: (theme: CustomTheme): CustomTheme => {
        return {
          ...theme,
          colors: { ...defaultTheme.colors, ...theme.colors },
          typography: { ...defaultTheme.typography, ...theme.typography },
          spacing: { ...defaultTheme.spacing, ...theme.spacing },
          animations: { ...defaultTheme.animations, ...theme.animations },
          effects: { ...defaultTheme.effects, ...theme.effects },
        }
      },
    }),
    {
      name: "theme-store",
    },
  ),
)
