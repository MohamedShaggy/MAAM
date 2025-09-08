import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || '7ca1d0290f51259acaf17e35fe2a6d2d9f11bf78786831de8a05f253cb19684d17819841ecdda990c148382d3aca12bd28d88f1cbb74b27db46758f9a798b384'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static async generateToken(payload: JWTPayload): Promise<string> {
    const secret = new TextEncoder().encode(JWT_SECRET)
    return await new SignJWT(payload as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(secret)
  }

  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      return payload as unknown as JWTPayload
    } catch {
      return null
    }
  }

  static async createUser(email: string, password: string, name?: string) {
    const hashedPassword = await this.hashPassword(password)

    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        personalInfo: {
          create: {
            name: name || 'Your Name',
            title: 'Your Title',
            description: 'Your description',
            email,
            location: 'Your Location',
          }
        },
        settings: {
          create: {}
        }
      },
      include: {
        personalInfo: true,
        settings: true
      }
    })
  }

  static async authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        personalInfo: true,
        settings: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const isValidPassword = await this.verifyPassword(password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid password')
    }

    const token = await this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    return { user, token }
  }

  static async getUserFromToken(token: string) {
    const payload = await this.verifyToken(token)
    if (!payload) {
      return null
    }

    return prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        personalInfo: true,
        settings: true
      }
    })
  }
}
