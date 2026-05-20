import type { NextRequest } from 'next/server'

import { ok, withApi } from '@/server/lib/api-response'
import { REFRESH_TOKEN_COOKIE } from '@/server/lib/auth-context'
import { clearAuthCookies } from '@/server/lib/cookies'
import { revokeRefreshToken } from '@/server/services/auth.service'

export const POST = withApi(async (req: NextRequest) => {
  const refresh = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value
  if (refresh) {
    await revokeRefreshToken(refresh)
  }
  return clearAuthCookies(ok({ loggedOut: true }))
})
