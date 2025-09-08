import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  icon: z.string().default('Globe'),
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

    const socialLinks = await prisma.socialLink.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ success: true, data: socialLinks })
  } catch (error) {
    console.error('Get social links error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social links' },
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
    const validatedData = socialLinkSchema.parse(body)

    const socialLink = await prisma.socialLink.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json({ success: true, data: socialLink })
  } catch (error) {
    console.error('Create social link error:', error)
    return NextResponse.json(
      { error: 'Failed to create social link' },
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
    const socialLinks = z.array(socialLinkSchema.extend({ id: z.string() })).parse(body)

    // Delete existing social links
    await prisma.socialLink.deleteMany({
      where: { userId },
    })

    // Create new social links
    const createdLinks = await prisma.socialLink.createMany({
      data: socialLinks.map(link => ({
        ...link,
        userId,
      })),
    })

    return NextResponse.json({ success: true, data: createdLinks })
  } catch (error) {
    console.error('Update social links error:', error)
    return NextResponse.json(
      { error: 'Failed to update social links' },
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
      return NextResponse.json({ error: 'Social link ID required' }, { status: 400 })
    }

    await prisma.socialLink.delete({
      where: { id, userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete social link error:', error)
    return NextResponse.json(
      { error: 'Failed to delete social link' },
      { status: 500 }
    )
  }
}
