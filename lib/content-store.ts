import { create } from "zustand"
import type { PortfolioContent, PersonalInfo, SocialLink, Skill, Project, ExperienceItem } from "./types"

// Default content based on Mohamed Abdelrazig's portfolio
const defaultContent: PortfolioContent = {
  personalInfo: {
    name: "Mohamed Abdelrazig Abdelrahim",
    title: "IT Support Engineer & Frontend Developer",
    description: "I'm an IT Support Engineer with over two years of experience setting up, fixing, and improving IT systems. I enjoy helping users with technical issues and creating user-friendly digital experiences.",
    email: "mohamed2abdelrazig@gmail.com",
    location: "Cairo, Egypt",
    phone: "+201102305748" as string,
    availability: "Available for opportunities",
    availabilityStatus: "available",
  },
  socialLinks: [
    {
      platform: "GitHub",
      url: "https://github.com/Moegreen249",
      icon: "Github",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/mohamedabdelrazig",
      icon: "Linkedin",
    },
    {
      platform: "Email",
      url: "mailto:mohamed2abdelrazig@gmail.com",
      icon: "Mail",
    },
  ],
  aboutBio: [
    "I'm an IT Support Engineer with over two years of experience setting up, fixing, and improving IT systems. I enjoy helping users with technical issues, using the ITIL framework to keep things running smoothly, and working in busy team settings.",
    "My journey in tech combines IT support expertise with frontend development skills. I've worked with various companies to create user-friendly digital experiences while maintaining robust IT infrastructure.",
    "When I'm not fixing IT issues or coding, you can find me exploring new technologies, training users on IT systems, and staying up-to-date with the latest industry trends.",
  ],
  skills: [
    { name: "IT Support", level: 95 },
    { name: "Network Setup", level: 90 },
    { name: "Hardware/Software Troubleshooting", level: 88 },
    { name: "HTML/CSS", level: 85 },
    { name: "JavaScript", level: 80 },
    { name: "React", level: 75 },
    { name: "ITIL Framework", level: 85 },
    { name: "User Training", level: 90 },
    { name: "Remote Support", level: 88 },
    { name: "Microsoft Office", level: 90 },
    { name: "Ticketing Systems", level: 85 },
    { name: "Data Security", level: 80 },
  ],
  projects: [
    {
      id: "1",
      title: "Medad Educational Platform",
      description: "Improved the user experience and design of educational websites including medad.bh, alkhair.medad.bh, alnukhbaschools.com, bazarsyria.site, and ai.medad.bh. Created responsive, user-friendly interfaces.",
      tags: ["HTML", "CSS", "JavaScript", "UI/UX", "Responsive Design"],
      image: "/placeholder.svg?height=400&width=600",
      demoUrl: "https://medad.bh",
      repoUrl: "",
      featured: true,
    },
    {
      id: "2",
      title: "CharismaAI Platform",
      description: "An AI-powered platform for content generation and creative assistance. Built with modern web technologies to provide intelligent solutions.",
      tags: ["AI", "Web Development", "JavaScript", "Next.js", "Vercel"],
      image: "/placeholder.svg?height=400&width=600",
      demoUrl: "https://charismaai.vercel.app",
      repoUrl: "https://github.com/Moegreen249",
      featured: true,
    },
    {
      id: "3",
      title: "ERP System Implementation",
      description: "Set up and configured ERP systems for over 230 clients, ensuring secure and efficient business operations with proper network infrastructure.",
      tags: ["ERP", "Network Setup", "IT Infrastructure", "Security"],
      image: "/placeholder.svg?height=400&width=600",
      demoUrl: "",
      repoUrl: "",
      featured: true,
    },
    {
      id: "4",
      title: "CCTV & GPS Integration",
      description: "Implemented comprehensive CCTV and GPS systems for client security and tracking needs, including network configuration and user training.",
      tags: ["CCTV", "GPS", "Network Security", "System Integration"],
      image: "/placeholder.svg?height=400&width=600",
      demoUrl: "",
      repoUrl: "",
      featured: true,
    },
    {
      id: "5",
      title: "IT Support Dashboard",
      description: "Developed an internal dashboard for tracking IT support tickets, managing user accounts, and monitoring system performance.",
      tags: ["Dashboard", "IT Support", "Ticketing System", "User Management"],
      image: "/placeholder.svg?height=400&width=600",
      demoUrl: "",
      repoUrl: "",
      featured: true,
    },
    {
      id: "6",
      title: "Remote Support Platform",
      description: "Built a remote support platform to help users remotely, solving technical problems efficiently regardless of location.",
      tags: ["Remote Support", "Web Platform", "Technical Support", "JavaScript"],
      image: "/placeholder.svg?height=400&width=600",
      demoUrl: "",
      repoUrl: "",
      featured: true,
    },
  ],
  experience: [
    {
      id: "1",
      company: "Medad for Training and Education",
      position: "Frontend Developer & Graphic Designer",
      duration: "2024 - Present",
      description: "Improved the user experience and design of educational websites including medad.bh, alkhair.medad.bh, alnukhbaschools.com, bazarsyria.site, and ai.medad.bh. Built responsive website interfaces using HTML, CSS, and JavaScript. Created marketing materials and designs with Photoshop and Illustrator.",
      technologies: ["HTML", "CSS", "JavaScript", "Photoshop", "Illustrator", "UI/UX"],
    },
    {
      id: "2",
      company: "Almoheet For Information Technology",
      position: "Technical Support Engineer",
      duration: "Mar 2022 - Apr 2023",
      description: "Managed IT setups for over 230 clients, configuring ERP, CCTV, GPS, and network systems. Resolved IT issues for 120 clients, reducing downtime by 2 hours per problem. Provided remote support and trained 45 clients on IT systems, improving productivity by 30%.",
      technologies: ["ERP Systems", "CCTV", "GPS", "Network Setup", "ITIL", "Remote Support"],
    },
    {
      id: "3",
      company: "Marambash for Accounting Systems",
      position: "Technical Support Associate",
      duration: "Dec 2021 - Mar 2022",
      description: "Set up networks and CCTV systems for 10 clients, ensuring secure and efficient operations. Resolved technical issues for 20 clients while managing user accounts and permissions. Utilized ticketing systems to track and resolve support requests.",
      technologies: ["Network Setup", "CCTV", "User Management", "Ticketing Systems", "Technical Support"],
    },
    {
      id: "4",
      company: "Nahda College",
      position: "Student - Bachelor of Science in Information Technology",
      duration: "Jun 2016 - Feb 2022",
      description: "Completed Bachelor's degree in Information Technology, gaining comprehensive knowledge in computer science, networking, software development, and IT systems management.",
      technologies: ["Information Technology", "Computer Science", "Networking", "Software Development"],
    },
  ],
}

interface ContentStore {
  content: PortfolioContent
  isLoading: boolean
  isLoaded: boolean
  error: string | null
  isSaving: boolean
  lastSaved: Date | null
  loadContent: () => Promise<void>
  saveContent: () => Promise<boolean>
  autoSave: () => Promise<void>
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void
  updateSocialLinks: (links: SocialLink[]) => void
  updateAboutBio: (bio: string[]) => void
  updateSkills: (skills: Skill[]) => void
  updateProjects: (projects: Project[]) => void
  updateExperience: (experience: ExperienceItem[]) => void
  resetToDefaults: () => void
}

export const useContentStore = create<ContentStore>((set, get) => ({
  content: defaultContent,
  isLoading: false,
  isLoaded: false,
  error: null,
  isSaving: false,
  lastSaved: null,

  loadContent: async () => {
    set({ isLoading: true, error: null })
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        // No token available, use defaults
        set({ isLoading: false, isLoaded: true })
        return
      }

      const response = await fetch('/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        const dbContent = data.data

        // Merge database content with defaults for missing data
        const mergedContent: PortfolioContent = {
          personalInfo: dbContent.personalInfo || defaultContent.personalInfo,
          socialLinks: dbContent.socialLinks?.length > 0 ? dbContent.socialLinks : defaultContent.socialLinks,
          aboutBio: dbContent.personalInfo?.bio ? [dbContent.personalInfo.bio] : defaultContent.aboutBio,
          skills: dbContent.skills?.length > 0 ? dbContent.skills : defaultContent.skills,
          projects: dbContent.projects?.length > 0 ? dbContent.projects : defaultContent.projects,
          experience: dbContent.experience?.length > 0 ? dbContent.experience : defaultContent.experience,
        }

        set({
          content: mergedContent,
          isLoading: false,
          isLoaded: true,
          error: null
        })
      } else {
        throw new Error(data.error || 'Failed to load content')
      }
    } catch (error) {
      console.error('Error loading content:', error)
      set({
        isLoading: false,
        isLoaded: true,
        error: error instanceof Error ? error.message : 'Failed to load content'
      })
    }
  },

  saveContent: async () => {
    set({ isSaving: true, error: null })
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const { content } = get()

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo: {
            ...content.personalInfo,
            bio: content.aboutBio.join('\n\n'), // Convert array back to string for bio field
          },
          skills: content.skills,
          projects: content.projects,
          experience: content.experience,
          socialLinks: content.socialLinks,
        }),
      })

      const data = await response.json()

      if (data.success) {
        set({
          isSaving: false,
          lastSaved: new Date(),
          error: null
        })
        return true
      } else {
        throw new Error(data.error || 'Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      set({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to save content'
      })
      return false
    }
  },

  autoSave: async () => {
    const { isSaving, isLoaded } = get()
    // Only auto-save if not already saving and content is loaded
    if (!isSaving && isLoaded) {
      await get().saveContent()
    }
  },

  updatePersonalInfo: (info) =>
    set((state) => ({
      content: {
        ...state.content,
        personalInfo: { ...state.content.personalInfo, ...info },
      },
    })),
  updateSocialLinks: (links) =>
    set((state) => ({
      content: { ...state.content, socialLinks: links },
    })),
  updateAboutBio: (bio) =>
    set((state) => ({
      content: { ...state.content, aboutBio: bio },
    })),
  updateSkills: (skills) =>
    set((state) => ({
      content: { ...state.content, skills },
    })),
  updateProjects: (projects) =>
    set((state) => ({
      content: { ...state.content, projects },
    })),
  updateExperience: (experience) =>
    set((state) => ({
      content: { ...state.content, experience },
    })),
  resetToDefaults: () => set({
    content: defaultContent,
    error: null
  }),
}))
