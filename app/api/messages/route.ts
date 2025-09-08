import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { emailService } from '@/lib/email'
import { z } from 'zod'

const messageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

const updateMessageSchema = z.object({
  status: z.enum(['unread', 'read', 'replied', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  starred: z.boolean().optional(),
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const starred = searchParams.get('starred')

    const where: any = { userId }
    if (status) where.status = status
    if (priority) where.priority = priority
    if (starred !== null) where.starred = starred === 'true'

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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
    const validatedData = messageSchema.parse(body)

    // Create the message
    const message = await prisma.message.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    // Send email notification to admin
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { settings: true },
      })

      if (user?.settings?.contactEmail && user.settings.enableEmailNotifications) {
        await emailService.sendContactNotification(
          user.settings.contactEmail,
          validatedData
        )

        // Send auto-reply if enabled
        if (user.settings.autoReplyEnabled && user.settings.autoReplyMessage) {
          await emailService.sendContactFormReply(
            validatedData.email,
            validatedData.name,
            validatedData.message,
            user.settings.autoReplyMessage
          )
        }
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = updateMessageSchema.parse(body)

    const message = await prisma.message.update({
      where: { id, userId },
      data: validatedData,
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
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
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    await prisma.message.delete({
      where: { id, userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
