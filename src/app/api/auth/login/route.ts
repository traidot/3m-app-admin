import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { ok, withApi } from '@/server/lib/api-response'
import { setAuthCookies } from '@/server/lib/cookies'
import { LoginSchema } from '@/server/schemas/auth.schema'
import { authenticate } from '@/server/services/auth.service'

export const POST = withApi(async (req: NextRequest) => {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }

  const parsed = v.safeParse(LoginSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu đăng nhập không hợp lệ', { issues: parsed.issues })
  }

  const { user, tokens } = await authenticate({
    email: parsed.output.email,
    password: parsed.output.password,
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
