import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const personalInfoSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  availability: z.string().min(1),
  availabilityStatus: z.enum(['available', 'busy', 'unavailable']),
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

    const personalInfo = await prisma.personalInfo.findUnique({
      where: { userId },
    })

    if (!personalInfo) {
      return NextResponse.json({ error: 'Personal info not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: personalInfo })
  } catch (error) {
    console.error('Get personal info error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal info' },
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
    const validatedData = personalInfoSchema.parse(body)

    const personalInfo = await prisma.personalInfo.upsert({
      where: { userId },
      update: validatedData,
      create: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json({ success: true, data: personalInfo })
  } catch (error) {
    console.error('Update personal info error:', error)
    return NextResponse.json(
      { error: 'Failed to update personal info' },
      { status: 500 }
    )
  }
}
