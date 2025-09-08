import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messageId, reply } = body

    if (!messageId || !reply?.trim()) {
      return NextResponse.json({ error: 'Message ID and reply are required' }, { status: 400 })
    }

    // Get the original message
    const originalMessage = await prisma.message.findFirst({
      where: {
        id: messageId,
        userId,
      },
    })

    if (!originalMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Get user settings for email configuration
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    })

    if (!user?.settings?.enableEmailNotifications) {
      return NextResponse.json({ error: 'Email notifications are disabled' }, { status: 400 })
    }

    // Send the reply email
    const emailResult = await emailService.sendContactFormReply(
      originalMessage.email,
      originalMessage.name,
      originalMessage.message,
      reply
    )

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send email reply' },
        { status: 500 }
      )
    }

    // Update message status to replied
    await prisma.message.update({
      where: { id: messageId, userId },
      data: { status: 'replied' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reply to message error:', error)
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
}

function getUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = AuthService.verifyToken(token)
  return payload?.userId || null
}
