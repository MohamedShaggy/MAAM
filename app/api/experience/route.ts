import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).default([]),
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

    const experiences = await prisma.experience.findMany({
      where: { userId },
      include: {
        technologies: {
          select: { technology: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform the data to include technologies as array
    const transformedExperiences = experiences.map(exp => ({
      ...exp,
      technologies: exp.technologies.map(tech => tech.technology),
    }))

    return NextResponse.json({ success: true, data: transformedExperiences })
  } catch (error) {
    console.error('Get experience error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
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
    const validatedData = experienceSchema.parse(body)

    const experience = await prisma.experience.create({
      data: {
        company: validatedData.company,
        position: validatedData.position,
        duration: validatedData.duration,
        description: validatedData.description,
        userId,
        technologies: {
          create: validatedData.technologies.map(tech => ({ technology: tech })),
        },
      },
      include: {
        technologies: {
          select: { technology: true },
        },
      },
    })

    // Transform the response
    const transformedExperience = {
      ...experience,
      technologies: experience.technologies.map(tech => tech.technology),
    }

    return NextResponse.json({ success: true, data: transformedExperience })
  } catch (error) {
    console.error('Create experience error:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
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
    const experiences = z.array(experienceSchema.extend({ id: z.string() })).parse(body)

    // Delete existing experiences and their technologies
    await prisma.experienceTech.deleteMany({
      where: {
        experience: {
          userId,
        },
      },
    })

    await prisma.experience.deleteMany({
      where: { userId },
    })

    // Create new experiences with technologies
    const createdExperiences = []

    for (const expData of experiences) {
      const experience = await prisma.experience.create({
        data: {
          id: expData.id,
          company: expData.company,
          position: expData.position,
          duration: expData.duration,
          description: expData.description,
          userId,
          technologies: {
            create: expData.technologies.map(tech => ({ technology: tech })),
          },
        },
        include: {
          technologies: {
            select: { technology: true },
          },
        },
      })

      createdExperiences.push({
        ...experience,
        technologies: experience.technologies.map(tech => tech.technology),
      })
    }

    return NextResponse.json({ success: true, data: createdExperiences })
  } catch (error) {
    console.error('Update experience error:', error)
    return NextResponse.json(
      { error: 'Failed to update experience' },
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
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 })
    }

    await prisma.experience.delete({
      where: { id, userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete experience error:', error)
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
}
