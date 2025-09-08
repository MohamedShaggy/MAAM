import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/auth'
import { uploadService } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - please log in again' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Upload the file
    const uploadedFile = await uploadService.uploadFile(file)

    // Save file record to database
    const fileRecord = await prisma.file.create({
      data: {
        filename: uploadedFile.filename,
        originalName: uploadedFile.originalName,
        mimetype: uploadedFile.mimetype,
        size: uploadedFile.size,
        url: uploadedFile.url,
        path: uploadedFile.path,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: fileRecord.id,
        url: fileRecord.url,
        filename: fileRecord.filename,
        originalName: fileRecord.originalName,
        size: fileRecord.size,
        mimetype: fileRecord.mimetype,
      },
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
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
    const fileId = searchParams.get('id')

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 })
    }

    // Get file record from database
    const fileRecord = await prisma.file.findUnique({
      where: { id: fileId },
    })

    if (!fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete file from filesystem
    await uploadService.deleteFile(fileRecord.filename)

    // Delete file record from database
    await prisma.file.delete({
      where: { id: fileId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('File delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

function getUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  console.log('Upload API: Authorization header:', authHeader ? 'Present' : 'Missing')

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('Upload API: Invalid or missing Bearer token')
    return null
  }

  const token = authHeader.substring(7)
  console.log('Upload API: Extracted token:', token ? 'Token present' : 'No token')

  const payload = AuthService.verifyToken(token)
  console.log('Upload API: Token verification result:', payload ? 'Valid' : 'Invalid')

  return payload?.userId || null
}
