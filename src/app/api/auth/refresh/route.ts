import type { NextRequest } from 'next/server'

import { ApiErrors } from '@/server/lib/api-error'
import { ok, withApi } from '@/server/lib/api-response'
import { REFRESH_TOKEN_COOKIE } from '@/server/lib/auth-context'
import { setAuthCookies } from '@/server/lib/cookies'
import { rotateRefreshToken } from '@/server/services/auth.service'

export const POST = withApi(async (req: NextRequest) => {
  let token = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value
  if (!token) {
    try {
      const body = (await req.json()) as { refreshToken?: string }
      token = body?.refreshToken
    } catch {
      // body optional — cookie is the primary source
    }
  }
  if (!token) throw ApiErrors.unauthorized('Refresh token missing')

  const { user, tokens } = await rotateRefreshToken({
    refreshToken: token,
    userAgent: req.headers.get('user-agent'),
    ipAddress: req.headers.get('x-forwarded-for') ?? null
  })

  const res = ok({
    user,
    accessToken: tokens.accessToken,
    expiresIn: tokens.accessTtlSeconds
  })
  return setAuthCookies({
    res,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    refreshTtlSeconds: tokens.refreshTtlSeconds
  })
})
