import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const skillSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(0).max(100),
  category: z.string().optional(),
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

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ success: true, data: skills })
  } catch (error) {
    console.error('Get skills error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
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
    const validatedData = skillSchema.parse(body)

    const skill = await prisma.skill.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json({ success: true, data: skill })
  } catch (error) {
    console.error('Create skill error:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
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
    const skills = z.array(skillSchema.extend({ id: z.string() })).parse(body)

    // Delete existing skills
    await prisma.skill.deleteMany({
      where: { userId },
    })

    // Create new skills
    const createdSkills = await prisma.skill.createMany({
      data: skills.map(skill => ({
        ...skill,
        userId,
      })),
    })

    return NextResponse.json({ success: true, data: createdSkills })
  } catch (error) {
    console.error('Update skills error:', error)
    return NextResponse.json(
      { error: 'Failed to update skills' },
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
      return NextResponse.json({ error: 'Skill ID required' }, { status: 400 })
    }

    await prisma.skill.delete({
      where: { id, userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete skill error:', error)
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    )
  }
}
