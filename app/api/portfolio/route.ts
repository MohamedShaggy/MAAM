import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'

function getUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = AuthService.verifyToken(token)
  return payload?.userId || null
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)

    // For public portfolio viewing, we need a way to identify which user's portfolio to show
    // In production, you might want to use a subdomain or path parameter
    // For now, we'll get the first user's content (assuming single portfolio setup)
    const targetUserId = userId || process.env.DEFAULT_USER_ID

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'No portfolio content available. Please configure DEFAULT_USER_ID in environment variables.' },
        { status: 404 }
      )
    }

    // Fetch all portfolio content in parallel
    const [personalInfo, skills, projects, experiences, socialLinks] = await Promise.all([
      prisma.personalInfo.findUnique({
        where: { userId: targetUserId },
      }),
      prisma.skill.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.project.findMany({
        where: { userId: targetUserId },
        include: {
          tags: {
            select: { tag: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.experience.findMany({
        where: { userId: targetUserId },
        include: {
          technologies: {
            select: { technology: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.socialLink.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    // Transform the data to match the expected format
    const transformedData = {
      personalInfo: personalInfo ? {
        name: personalInfo.name,
        title: personalInfo.title,
        description: personalInfo.description,
        email: personalInfo.email,
        location: personalInfo.location,
        phone: personalInfo.phone || '',
        bio: personalInfo.bio || '',
        avatar: personalInfo.avatar || '',
        availability: personalInfo.availability,
        availabilityStatus: personalInfo.availabilityStatus,
      } : null,
      skills: skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
      })),
      projects: projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image || '',
        demoUrl: project.demoUrl || '',
        repoUrl: project.repoUrl || '',
        featured: project.featured,
        tags: project.tags.map(tag => tag.tag),
      })),
      experience: experiences.map(exp => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        duration: exp.duration,
        description: exp.description,
        technologies: exp.technologies.map(tech => tech.technology),
      })),
      socialLinks: socialLinks.map(link => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        icon: link.icon,
      })),
    }

    return NextResponse.json({ success: true, data: transformedData })
  } catch (error) {
    console.error('Get portfolio content error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { personalInfo, skills, projects, experience, socialLinks } = body

    // Update personal info
    if (personalInfo) {
      await prisma.personalInfo.upsert({
        where: { userId },
        update: {
          name: personalInfo.name,
          title: personalInfo.title,
          description: personalInfo.description,
          email: personalInfo.email,
          location: personalInfo.location,
          phone: personalInfo.phone || null,
          bio: personalInfo.bio || null,
          avatar: personalInfo.avatar || null,
          availability: personalInfo.availability,
          availabilityStatus: personalInfo.availabilityStatus,
        },
        create: {
          userId,
          name: personalInfo.name,
          title: personalInfo.title,
          description: personalInfo.description,
          email: personalInfo.email,
          location: personalInfo.location,
          phone: personalInfo.phone || null,
          bio: personalInfo.bio || null,
          avatar: personalInfo.avatar || null,
          availability: personalInfo.availability,
          availabilityStatus: personalInfo.availabilityStatus,
        },
      })
    }

    // Update skills
    if (skills) {
      // Delete existing skills
      await prisma.skill.deleteMany({ where: { userId } })
      // Create new skills
      await prisma.skill.createMany({
        data: skills.map((skill: any) => ({
          userId,
          name: skill.name,
          level: skill.level,
        })),
      })
    }

    // Update projects
    if (projects) {
      // Delete existing projects and their tags
      await prisma.projectTag.deleteMany({
        where: {
          project: { userId },
        },
      })
      await prisma.project.deleteMany({ where: { userId } })

      // Create new projects
      for (const project of projects) {
        await prisma.project.create({
          data: {
            userId,
            title: project.title,
            description: project.description,
            image: project.image || null,
            demoUrl: project.demoUrl || null,
            repoUrl: project.repoUrl || null,
            featured: project.featured,
            tags: {
              create: project.tags.map((tag: string) => ({ tag })),
            },
          },
        })
      }
    }

    // Update experience
    if (experience) {
      // Delete existing experience and technologies
      await prisma.experienceTech.deleteMany({
        where: {
          experience: { userId },
        },
      })
      await prisma.experience.deleteMany({ where: { userId } })

      // Create new experience
      for (const exp of experience) {
        await prisma.experience.create({
          data: {
            userId,
            company: exp.company,
            position: exp.position,
            duration: exp.duration,
            description: exp.description,
            technologies: {
              create: exp.technologies.map((tech: string) => ({ technology: tech })),
            },
          },
        })
      }
    }

    // Update social links
    if (socialLinks) {
      await prisma.socialLink.deleteMany({ where: { userId } })
      await prisma.socialLink.createMany({
        data: socialLinks.map((link: any) => ({
          userId,
          platform: link.platform,
          url: link.url,
          icon: link.icon,
        })),
      })
    }

    return NextResponse.json({ success: true, message: 'Portfolio content updated successfully' })
  } catch (error) {
    console.error('Update portfolio content error:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio content' },
      { status: 500 }
    )
  }
}
