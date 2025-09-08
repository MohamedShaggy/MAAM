import { create } from "zustand"
import { persist } from "zustand/middleware"

// Site-wide content that should be editable through admin
interface SiteContent {
  // Site metadata
  metadata: {
    title: string
    description: string
    generator: string
  }

  // Navigation content
  navigation: {
    brandName: string
    brandInitials: string
    menuItems: Array<{ name: string; href: string }>
    resumeButtonText: string
  }

  // Page sections
  sections: {
    hero: {
      greeting: string
      namePrefix: string
      description: string
      primaryButtonText: string
      secondaryButtonText: string
    }
    about: {
      title: string
      subtitle: string
      nameLabel: string
      emailLabel: string
      locationLabel: string
      availabilityLabel: string
      downloadResumeText: string
    }
    skills: {
      title: string
      subtitle: string
    }
    projects: {
      title: string
      subtitle: string
    }
    experience: {
      title: string
      subtitle: string
    }
    contact: {
      title: string
      subtitle: string
      contactInfoTitle: string
      currentStatusTitle: string
    }
  }

  // Form content
  forms: {
    contact: {
      title: string
      namePlaceholder: string
      emailPlaceholder: string
      subjectPlaceholder: string
      messagePlaceholder: string
      submitButtonText: string
      submittingText: string
      successTitle: string
      successDescription: string
    }
  }

  // Admin interface
  admin: {
    dashboard: {
      title: string
      backToPortfolioText: string
      previewSiteText: string
      sections: Array<{ id: string; label: string }>
    }
    themes: {
      title: string
      description: string
      tabs: Array<{ id: string; label: string }>
      presets: Array<{ id: string; name: string; description: string }>
      colorPresets: Array<{ name: string; primary: string; secondary: string }>
      buttons: {
        apply: string
        copy: string
        delete: string
        save: string
        reset: string
        import: string
        export: string
      }
      messages: {
        enterThemeName: string
        themeImported: string
        invalidThemeData: string
        themeCopied: string
        noCustomThemes: string
      }
    }
  }

  // Footer content
  footer: {
    copyrightText: string
  }

  // Status messages
  status: {
    available: string
    busy: string
    unavailable: string
  }

  // Accessibility labels
  accessibility: {
    adminDashboard: string
    screenReaderOnly: string
    moreOptions: string
    closeMenu: string
    previousSlide: string
    nextSlide: string
  }
}

const defaultSiteContent: SiteContent = {
  metadata: {
    title: "Mohamed Abdelrazig - IT Support Engineer & Frontend Developer",
    description: "Professional portfolio of Mohamed Abdelrazig Abdelrahim - IT Support Engineer and Frontend Developer based in Cairo, Egypt. Specializing in network setup, technical support, and modern web development.",
    generator: "Mohamed Abdelrazig Portfolio",
  },
  navigation: {
    brandName: "Mohamed Abdelrazig",
    brandInitials: "MA",
    menuItems: [
      { name: "About", href: "#about" },
      { name: "Skills", href: "#skills" },
      { name: "Projects", href: "#projects" },
      { name: "Experience", href: "#experience" },
      { name: "Contact", href: "#contact" },
    ],
    resumeButtonText: "Download Resume",
  },
  sections: {
    hero: {
      greeting: "Hello, I'm",
      namePrefix: "Mohamed Abdelrazig",
      description: "IT Support Engineer with over 2 years of experience in network setup, hardware/software troubleshooting, and technical support. Currently expanding my skills in frontend development and UI/UX design.",
      primaryButtonText: "View My Work",
      secondaryButtonText: "Get In Touch",
    },
    about: {
      title: "About Me",
      subtitle: "Passionate about technology and helping others",
      nameLabel: "Name",
      emailLabel: "Email",
      locationLabel: "Location",
      availabilityLabel: "Availability",
      downloadResumeText: "Download Resume",
    },
    skills: {
      title: "Skills & Technologies",
      subtitle: "Tools and technologies I work with",
    },
    projects: {
      title: "My Projects",
      subtitle: "A showcase of my recent work and achievements",
    },
    experience: {
      title: "Professional Experience",
      subtitle: "My journey in IT and development",
    },
    contact: {
      title: "Let's Work Together",
      subtitle: "I'm always open to discussing new opportunities",
      contactInfoTitle: "Contact Information",
      currentStatusTitle: "Current Status",
    },
  },
  forms: {
    contact: {
      title: "Send Me a Message",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Tell me about your project or opportunity...",
      submitButtonText: "Send Message",
      submittingText: "Sending...",
      successTitle: "Thank you for reaching out!",
      successDescription: "I'll get back to you within 24 hours.",
    },
  },
  admin: {
    dashboard: {
      title: "Portfolio Dashboard",
      backToPortfolioText: "Back to Portfolio",
      previewSiteText: "Preview Portfolio",
      sections: [
        { id: "overview", label: "Dashboard" },
        { id: "personal", label: "Profile Setup" },
        { id: "social", label: "Social Links" },
        { id: "skills", label: "Skills & Tools" },
        { id: "projects", label: "Portfolio Items" },
        { id: "experience", label: "Experience" },
        { id: "preview", label: "Live Preview" },
        { id: "publish", label: "Publish & Share" },
      ],
    },
    themes: {
      title: "Theme Manager",
      description: "Customize the appearance and feel of your portfolio",
      tabs: [
        { id: "presets", label: "Theme Presets" },
        { id: "custom", label: "Custom Themes" },
        { id: "builder", label: "Theme Builder" },
        { id: "advanced", label: "Advanced Settings" },
      ],
      presets: [
        { id: "light", name: "Light", description: "Clean and bright" },
        { id: "dark", name: "Dark", description: "Easy on the eyes" },
        { id: "system", name: "System", description: "Follows your device" },
      ],
      colorPresets: [
        { name: "Blue", primary: "#3b82f6", secondary: "#1e40af" },
        { name: "Purple", primary: "#8b5cf6", secondary: "#7c3aed" },
        { name: "Green", primary: "#10b981", secondary: "#059669" },
        { name: "Orange", primary: "#f59e0b", secondary: "#d97706" },
        { name: "Red", primary: "#ef4444", secondary: "#dc2626" },
        { name: "Pink", primary: "#ec4899", secondary: "#db2777" },
      ],
      buttons: {
        apply: "Apply",
        copy: "Copy",
        delete: "Delete",
        save: "Save Theme",
        reset: "Reset",
        import: "Import Theme",
        export: "Export Theme",
      },
      messages: {
        enterThemeName: "Please enter a theme name",
        themeImported: "Theme imported successfully!",
        invalidThemeData: "Invalid theme data. Please check the format.",
        themeCopied: "Theme data copied to clipboard!",
        noCustomThemes: "No custom themes created yet. Use the Theme Builder to create one.",
      },
    },
  },
  footer: {
    copyrightText: "© 2024 Mohamed Abdelrazig Abdelrahim. All rights reserved.",
  },
  status: {
    available: "Available for opportunities",
    busy: "Currently busy",
    unavailable: "Not available",
  },
  accessibility: {
    adminDashboard: "Admin Dashboard",
    screenReaderOnly: "Screen reader only",
    moreOptions: "More options",
    closeMenu: "Close menu",
    previousSlide: "Previous slide",
    nextSlide: "Next slide",
  },
}

interface SiteContentStore {
  content: SiteContent
  updateMetadata: (metadata: Partial<SiteContent["metadata"]>) => void
  updateNavigation: (navigation: Partial<SiteContent["navigation"]>) => void
  updateSection: (
    section: keyof SiteContent["sections"],
    data: Partial<SiteContent["sections"][keyof SiteContent["sections"]]>,
  ) => void
  updateForms: (forms: Partial<SiteContent["forms"]>) => void
  updateAdmin: (admin: Partial<SiteContent["admin"]>) => void
  updateFooter: (footer: Partial<SiteContent["footer"]>) => void
  updateStatus: (status: Partial<SiteContent["status"]>) => void
  updateAccessibility: (accessibility: Partial<SiteContent["accessibility"]>) => void
  resetToDefaults: () => void
}

export const useSiteContentStore = create<SiteContentStore>()(
  persist(
    (set) => ({
      content: defaultSiteContent,
      updateMetadata: (metadata) =>
        set((state) => ({
          content: {
            ...state.content,
            metadata: { ...state.content.metadata, ...metadata },
          },
        })),
      updateNavigation: (navigation) =>
        set((state) => ({
          content: {
            ...state.content,
            navigation: { ...state.content.navigation, ...navigation },
          },
        })),
      updateSection: (section, data) =>
        set((state) => ({
          content: {
            ...state.content,
            sections: {
              ...state.content.sections,
              [section]: { ...state.content.sections[section], ...data },
            },
          },
        })),
      updateForms: (forms) =>
        set((state) => ({
          content: {
            ...state.content,
            forms: { ...state.content.forms, ...forms },
          },
        })),
      updateAdmin: (admin) =>
        set((state) => ({
          content: {
            ...state.content,
            admin: { ...state.content.admin, ...admin },
          },
        })),
      updateFooter: (footer) =>
        set((state) => ({
          content: {
            ...state.content,
            footer: { ...state.content.footer, ...footer },
          },
        })),
      updateStatus: (status) =>
        set((state) => ({
          content: {
            ...state.content,
            status: { ...state.content.status, ...status },
          },
        })),
      updateAccessibility: (accessibility) =>
        set((state) => ({
          content: {
            ...state.content,
            accessibility: { ...state.content.accessibility, ...accessibility },
          },
        })),
      resetToDefaults: () => set({ content: defaultSiteContent }),
    }),
    {
      name: "site-content-storage",
    },
  ),
)
