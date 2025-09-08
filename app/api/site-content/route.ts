import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const siteContentSchema = z.object({
  section: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
})

// No auth required for site content - it's public content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    const where: any = {}
    if (section) {
      where.section = section
    }

    const content = await prisma.siteContent.findMany({
      where,
      orderBy: [
        { section: 'asc' },
        { key: 'asc' },
      ],
    })

    // Transform to object structure
    const contentObject: Record<string, Record<string, string>> = {}
    content.forEach(item => {
      if (!contentObject[item.section]) {
        contentObject[item.section] = {}
      }
      contentObject[item.section][item.key] = item.value
    })

    return NextResponse.json({ success: true, data: contentObject })
  } catch (error) {
    console.error('Get site content error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = siteContentSchema.parse(body)

    const content = await prisma.siteContent.upsert({
      where: {
        section_key: {
          section: validatedData.section,
          key: validatedData.key,
        },
      },
      update: { value: validatedData.value },
      create: validatedData,
    })

    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error('Create site content error:', error)
    return NextResponse.json(
      { error: 'Failed to create site content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const contentUpdates = z.array(siteContentSchema).parse(body)

    const results = []

    for (const update of contentUpdates) {
      const content = await prisma.siteContent.upsert({
        where: {
          section_key: {
            section: update.section,
            key: update.key,
          },
        },
        update: { value: update.value },
        create: update,
      })
      results.push(content)
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Update site content error:', error)
    return NextResponse.json(
      { error: 'Failed to update site content' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const key = searchParams.get('key')

    if (!section || !key) {
      return NextResponse.json({ error: 'Section and key required' }, { status: 400 })
    }

    await prisma.siteContent.delete({
      where: {
        section_key: {
          section,
          key,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete site content error:', error)
    return NextResponse.json(
      { error: 'Failed to delete site content' },
      { status: 500 }
    )
  }
}
