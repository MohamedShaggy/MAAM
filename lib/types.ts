export interface PersonalInfo {
  name: string
  title: string
  description: string
  email: string
  location: string
  phone?: string
  availability: string
  availabilityStatus: "available" | "busy" | "unavailable"
  resumeUrl?: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface Skill {
  name: string
  level: number
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image: string
  demoUrl?: string
  repoUrl?: string
  featured: boolean
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  duration: string
  description: string
  technologies?: string[]
}

export interface PortfolioContent {
  personalInfo: PersonalInfo
  socialLinks: SocialLink[]
  aboutBio: string[]
  skills: Skill[]
  projects: Project[]
  experience: ExperienceItem[]
}
