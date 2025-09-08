import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || '7ca1d0290f51259acaf17e35fe2a6d2d9f11bf78786831de8a05f253cb19684d17819841ecdda990c148382d3aca12bd28d88f1cbb74b27db46758f9a798b384'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, uploads, etc.
  if (pathname.startsWith('/api') ||
      pathname.startsWith('/_next/static') ||
      pathname.startsWith('/_next/image') ||
      pathname.startsWith('/uploads') ||
      pathname === '/favicon.ico' ||
      pathname.match(/\..*$/)) {
    return NextResponse.next()
  }

  // Check if the request is for admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      console.log('Middleware: No admin_token cookie found, redirecting to login')
      // Redirect to login page
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify the token using jose (works in Edge Runtime)
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      const decoded = payload as any
      console.log('Middleware: Token decoded:', { userId: decoded.userId, email: decoded.email, role: decoded.role })

      // Check if user has admin role
      if (decoded.role !== 'admin') {
        console.log('Middleware: User does not have admin role:', decoded.role)
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }

      console.log('Middleware: Authentication successful, proceeding to admin route')
      // Token is valid, continue to the admin route
      return NextResponse.next()
    } catch (error) {
      console.log('Middleware: Token verification failed:', error)
      // Token is invalid, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// export const runtime = 'nodejs'

export const config = {
  matcher: [
    /*
     * Match all request paths
     */
    '/:path*',
  ],
}
