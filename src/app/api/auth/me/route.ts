import type { NextRequest } from 'next/server'

import { ok, withApi } from '@/server/lib/api-response'
import { requireAuth } from '@/server/lib/auth-context'
import { getAuthenticatedUser } from '@/server/services/auth.service'

export const GET = withApi(async (req: NextRequest) => {
  const ctx = requireAuth(req)
  const user = await getAuthenticatedUser(ctx.userId)
  return ok({ user })
})
