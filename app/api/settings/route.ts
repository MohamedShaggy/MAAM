import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const settingsSchema = z.object({
  // Site Settings
  siteName: z.string().min(1).optional(),
  siteDescription: z.string().optional(),
  siteUrl: z.string().url().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  enableAnalytics: z.boolean().optional(),
  enableSEO: z.boolean().optional(),

  // Email Settings
  contactEmail: z.string().email().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  enableEmailNotifications: z.boolean().optional(),
  autoReplyEnabled: z.boolean().optional(),
  autoReplyMessage: z.string().optional(),

  // Security Settings
  enableRateLimit: z.boolean().optional(),
  maxRequestsPerMinute: z.number().optional(),
  enableCaptcha: z.boolean().optional(),
  captchaSiteKey: z.string().optional(),
  captchaSecretKey: z.string().optional(),
  enableCSP: z.boolean().optional(),
  allowedDomains: z.string().optional(),

  // Notification Preferences
  emailNotifications: z.boolean().optional(),
  projectUpdates: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
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

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    })

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.userSettings.create({
        data: { userId },
      })
      return NextResponse.json({ success: true, data: defaultSettings })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
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
    const validatedData = settingsSchema.parse(body)

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: validatedData,
      create: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
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

    // Reset to defaults
    const defaultSettings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        siteName: "My Portfolio",
        siteDescription: "A showcase of my work and skills",
        siteUrl: "https://myportfolio.com",
        language: "en",
        timezone: "UTC",
        maintenanceMode: false,
        allowComments: true,
        enableAnalytics: true,
        enableSEO: true,
        contactEmail: "contact@myportfolio.com",
        smtpHost: null,
        smtpPort: "587",
        smtpUser: null,
        smtpPassword: null,
        enableEmailNotifications: true,
        autoReplyEnabled: false,
        autoReplyMessage: "Thank you for your message. I'll get back to you soon!",
        enableRateLimit: true,
        maxRequestsPerMinute: 60,
        enableCaptcha: false,
        captchaSiteKey: null,
        captchaSecretKey: null,
        enableCSP: true,
        allowedDomains: "myportfolio.com, *.myportfolio.com",
        emailNotifications: true,
        projectUpdates: true,
        securityAlerts: true,
        marketingEmails: false,
      },
      create: { userId },
    })

    return NextResponse.json({ success: true, data: defaultSettings })
  } catch (error) {
    console.error('Reset settings error:', error)
    return NextResponse.json(
      { error: 'Failed to reset settings' },
      { status: 500 }
    )
  }
}
