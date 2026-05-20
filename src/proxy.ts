'use server'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// API routes that may be hit unauthenticated
const PUBLIC_API_PATHS = new Set(['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health'])

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth gate for /api/* — cheap presence check; route handlers do deep checks via requireAuth/requireRole
  if (pathname.startsWith('/api/')) {
    if (PUBLIC_API_PATHS.has(pathname)) {
      return NextResponse.next()
    }
    const hasToken =
      request.headers.get('authorization')?.toLowerCase().startsWith('bearer ') ||
      Boolean(request.cookies.get('accessToken')?.value)
    if (!hasToken) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required', category: 'user' },
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // Skip locale handling for static assets and Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

  // Force default locale to Vietnamese
  const hasLangPrefix = /^\/(vi|en|ja)\//.test(pathname)
  if (hasLangPrefix) {
    const cleanPath = pathname.replace(/^\/(vi|en|ja)/, '')
    const url = request.nextUrl.clone()
    url.pathname = cleanPath || '/'

    return NextResponse.redirect(url)
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)

  if (!request.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', 'vi', {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax'
    })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  if (accessToken) {
    response.headers.set('x-access-token', accessToken)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}

