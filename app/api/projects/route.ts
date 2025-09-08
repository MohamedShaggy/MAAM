import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  demoUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

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
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        tags: {
          select: { tag: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform the data to include tags as array
    const transformedProjects = projects.map(project => ({
      ...project,
      tags: project.tags.map(tag => tag.tag),
    }))

    return NextResponse.json({ success: true, data: transformedProjects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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
    const validatedData = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        image: validatedData.image,
        demoUrl: validatedData.demoUrl || null,
        repoUrl: validatedData.repoUrl || null,
        featured: validatedData.featured,
        userId,
        tags: {
          create: validatedData.tags.map(tag => ({ tag })),
        },
      },
      include: {
        tags: {
          select: { tag: true },
        },
      },
    })

    // Transform the response
    const transformedProject = {
      ...project,
      tags: project.tags.map(tag => tag.tag),
    }

    return NextResponse.json({ success: true, data: transformedProject })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const projects = z.array(projectSchema.extend({ id: z.string() })).parse(body)

    // Delete existing projects and their tags
    await prisma.projectTag.deleteMany({
      where: {
        project: {
          userId,
        },
      },
    })

    await prisma.project.deleteMany({
      where: { userId },
    })

    // Create new projects with tags
    const createdProjects = []

    for (const projectData of projects) {
      const project = await prisma.project.create({
        data: {
          id: projectData.id,
          title: projectData.title,
          description: projectData.description,
          image: projectData.image,
          demoUrl: projectData.demoUrl || null,
          repoUrl: projectData.repoUrl || null,
          featured: projectData.featured,
          userId,
          tags: {
            create: projectData.tags.map(tag => ({ tag })),
          },
        },
        include: {
          tags: {
            select: { tag: true },
          },
        },
      })

      createdProjects.push({
        ...project,
        tags: project.tags.map(tag => tag.tag),
      })
    }

    return NextResponse.json({ success: true, data: createdProjects })
  } catch (error) {
    console.error('Update projects error:', error)
    return NextResponse.json(
      { error: 'Failed to update projects' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    await prisma.project.delete({
      where: { id, userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
