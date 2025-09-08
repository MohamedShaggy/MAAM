import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface UploadedFile {
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  path: string
}

export class FileUploadService {
  private uploadDir: string
  private maxFileSize: number

  constructor(uploadDir = './public/uploads', maxFileSize = 10485760) { // 10MB default
    this.uploadDir = uploadDir
    this.maxFileSize = maxFileSize
  }

  async uploadFile(file: File): Promise<UploadedFile> {
    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`)
    }

    // Validate file type (basic validation)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed. Only images are accepted.')
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name)
    const filename = `${uuidv4()}${fileExtension}`
    const filepath = path.join(this.uploadDir, filename)

    // Ensure upload directory exists
    await fs.mkdir(this.uploadDir, { recursive: true })

    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.writeFile(filepath, buffer)

    // Return file information
    return {
      filename,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      url: `/uploads/${filename}`,
      path: filepath,
    }
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = path.join(this.uploadDir, filename)
    try {
      await fs.unlink(filepath)
    } catch (error) {
      console.error('Error deleting file:', error)
      // Don't throw error if file doesn't exist
    }
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`
  }
}

// Create upload service instance
export const uploadService = new FileUploadService(
  process.env.UPLOAD_DIR || './public/uploads',
  parseInt(process.env.MAX_FILE_SIZE || '10485760')
)
