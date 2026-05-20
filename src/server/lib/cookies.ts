import 'server-only'

import type { NextResponse } from 'next/server'

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './auth-context'
import { TokenTtl } from './jwt'

interface SetTokenCookiesArgs {
  res: NextResponse
  accessToken: string
  refreshToken?: string | null
  refreshTtlSeconds?: number
}

const isProd = () => process.env.NODE_ENV === 'production'

export function setAuthCookies({ res, accessToken, refreshToken, refreshTtlSeconds }: SetTokenCookiesArgs): NextResponse {
  res.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd(),
    sameSite: 'lax',
    path: '/',
    maxAge: TokenTtl.accessSeconds
  })
  if (refreshToken) {
    res.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd(),
      sameSite: 'lax',
      path: '/',
      maxAge: refreshTtlSeconds ?? TokenTtl.refreshSeconds
    })
  }
  return res
}

export function clearAuthCookies(res: NextResponse): NextResponse {
  res.cookies.set(ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 })
  res.cookies.set(REFRESH_TOKEN_COOKIE, '', { path: '/', maxAge: 0 })
  return res
}
