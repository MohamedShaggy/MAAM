"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useContentStore } from "@/lib/content-store"
import { useSiteContentStore } from "@/lib/site-content-store"
import { useLoading } from "@/lib/loading-context"
import { useNavigationLoading } from "@/hooks/use-navigation-loading"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project-card"
import { SkillBadge } from "@/components/skill-badge"
import { Timeline } from "@/components/timeline"
import { ContactForm } from "@/components/contact-form"
import { CreativeHero } from "@/components/creative-hero"
import { FloatingNav } from "@/components/floating-nav"
import { MouseFollower } from "@/components/mouse-follower"
import { ScrollProgress } from "@/components/scroll-progress"
import { InteractiveLoading } from "@/components/interactive-loading"
import { SectionHeading } from "@/components/section-heading"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { getIcon } from "@/lib/icon-registry"
import { Settings } from "lucide-react"

const getIconComponent = (iconName: string) => {
  return getIcon(iconName)
}

export default function Portfolio() {
  const { content, loadContent, isLoaded, error } = useContentStore()
  const { content: siteContent } = useSiteContentStore()
  const { startLoading, stopLoading, setLoadingMessage } = useLoading()
  const { navigateWithLoading } = useNavigationLoading()
  const { personalInfo, socialLinks, aboutBio, skills, projects, experience } = content

  useEffect(() => {
    const loadPortfolioContent = async () => {
      startLoading("Loading PortfolioPro content...")
      try {
        await loadContent()
      } catch (err) {
        console.error('Failed to load content:', err)
      } finally {
        // Add a small delay for better UX
        setTimeout(() => {
          stopLoading()
        }, 500)
      }
    }

    loadPortfolioContent()
  }, []) // Remove dependencies to prevent infinite loop

  // Show error state (only if content failed to load)
  if (error && isLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Failed to Load Content</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden animate-smooth">
      <MouseFollower />
      <ScrollProgress />
      <FloatingNav />

      <div className="fixed top-4 right-4 z-50">
        <div className="flex gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground animate-smooth"
            title={siteContent.accessibility.adminDashboard}
            onClick={() => navigateWithLoading('/admin', 'Loading admin dashboard...')}
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">{siteContent.accessibility.adminDashboard}</span>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-primary) 20%, transparent)` }}
          ></div>
          <div
            className="absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-warning) 20%, transparent)` }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-accent) 20%, transparent)` }}
          ></div>
        </div>

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block">
              <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-background/10 backdrop-blur-sm border border-border mb-4 mt-4 animate-smooth">
                <span className="relative z-10">IT Support Engineer & Developer</span>
                <span className="absolute inset-0 rounded-full bg-gradient-primary-opacity animate-pulse"></span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-slide-up">
              <span className="block">{siteContent.sections.hero.greeting}</span>
              <span className="bg-clip-text text-transparent bg-gradient-primary">{siteContent.sections.hero.namePrefix}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] animate-fade-in">{siteContent.sections.hero.description}</p>
            <div className="flex flex-wrap gap-4 pt-4 animate-fade-in">
              <Button
                className="relative overflow-hidden group bg-gradient-primary border-0 animate-smooth hover:shadow-elevation-medium text-white"
                onClick={(e) => {
                  e.preventDefault();
                  const projectsSection = document.getElementById('projects');
                  if (projectsSection) {
                    projectsSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  } else {
                    console.warn('Projects section not found');
                  }
                }}
              >
                <span className="relative z-10 flex items-center">
                  {siteContent.sections.hero.primaryButtonText}{" "}
                  <span className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1">→</span>
                </span>
                <span className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity animate-smooth"></span>
              </Button>
              <Button
                variant="outline"
                className="animate-smooth hover:shadow-elevation-low bg-transparent"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  } else {
                    console.warn('Contact section not found');
                  }
                }}
              >
                {siteContent.sections.hero.secondaryButtonText}
              </Button>
            </div>
            <div className="flex gap-4 pt-4 animate-fade-in">
              {socialLinks.map((link, index) => {
                const IconComponent = getIconComponent(link.icon)
                return (
                  <Link key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground animate-smooth"
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="sr-only">{link.platform}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex justify-center animate-fade-in">
            <CreativeHero />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-border flex justify-center items-start p-1">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-primary) 15%, transparent)` }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-accent) 15%, transparent)` }}
          ></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title={siteContent.sections.about.title} subtitle={siteContent.sections.about.subtitle} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
            <div className="relative animate-fade-in">
              <div className="absolute -inset-4 rounded-xl bg-gradient-primary-opacity blur-xl opacity-70"></div>
              <div className="relative aspect-square rounded-xl overflow-hidden border border-border shadow-elevation-medium">
                <img
                  src="/profile-image.jpg"
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        personalInfo.availabilityStatus === "available"
                          ? "bg-theme-success"
                          : personalInfo.availabilityStatus === "busy"
                            ? "bg-theme-warning"
                            : "bg-theme-error"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">{personalInfo.availability}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in">
              <GlassmorphicCard>
                <p className="text-lg text-muted-foreground mb-6">
                  PortfolioPro is your complete solution for creating professional portfolios that impress.
                  With our intuitive dashboard, you can easily manage your content, customize themes, and
                  showcase your work to potential clients and employers.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">{siteContent.sections.about.nameLabel}</div>
                    <div className="font-medium">Easy-to-Use Dashboard</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">{siteContent.sections.about.emailLabel}</div>
                    <div className="font-medium">Multiple Theme Options</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">{siteContent.sections.about.locationLabel}</div>
                    <div className="font-medium">Content Management</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">{siteContent.sections.about.availabilityLabel}</div>
                    <div className="font-medium text-theme-success">Fully Responsive</div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground animate-smooth">
                    {siteContent.sections.about.downloadResumeText}
                  </Button>
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-info) 15%, transparent)` }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-primary) 15%, transparent)` }}
          ></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title={siteContent.sections.skills.title} subtitle={siteContent.sections.skills.subtitle} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16 animate-fade-in">
            {skills.map((skill, index) => (
              <SkillBadge key={index} name={skill.name} level={skill.level} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-accent) 15%, transparent)` }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-warning) 15%, transparent)` }}
          ></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading
            title={siteContent.sections.projects.title}
            subtitle={siteContent.sections.projects.subtitle}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 animate-fade-in">
            {projects
              .filter((project) => project.featured)
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  image={project.image}
                  demoUrl={project.demoUrl || ""}
                  repoUrl={project.repoUrl || ""}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, hsl(var(--primary)) 15%, transparent)` }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, hsl(var(--primary)) 15%, transparent)` }}
          ></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading
            title={siteContent.sections.experience.title}
            subtitle={siteContent.sections.experience.subtitle}
          />

          <div className="mt-16 animate-fade-in">
            <Timeline />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-accent) 15%, transparent)` }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-primary) 15%, transparent)` }}
          ></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title={siteContent.sections.contact.title} subtitle={siteContent.sections.contact.subtitle} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
            <GlassmorphicCard>
              <h3 className="text-2xl font-bold mb-6">{siteContent.sections.contact.contactInfoTitle}</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <div className="h-5 w-5 text-theme-primary font-bold">💎</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Pricing</div>
                    <div className="font-medium">Starting from $9/month</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <div className="h-5 w-5 text-theme-primary font-bold">⚡</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Setup Time</div>
                    <div className="font-medium">Ready in 5 minutes</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <div className="h-5 w-5 text-theme-primary font-bold">🏆</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Support</div>
                    <div className="font-medium">24/7 Premium Support</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-lg font-medium mb-4">{siteContent.sections.contact.currentStatusTitle}</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-theme-success animate-pulse"></div>
                    <span>Free Trial Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-theme-primary animate-pulse"></div>
                    <span>No Setup Fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-theme-accent animate-pulse"></div>
                    <span>Cancel Anytime</span>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link href="/" className="font-bold text-xl">
              <span className="bg-clip-text text-transparent bg-gradient-primary">
                Mohamed Abdelrazig
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              © {new Date().getFullYear()} Mohamed Abdelrazig Abdelrahim. {siteContent.footer.copyrightText}.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#contact">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground animate-smooth"
              >
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground animate-smooth"
              >
                Features
              </Button>
            </Link>
            <Link href="#examples">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground animate-smooth"
              >
                Examples
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
