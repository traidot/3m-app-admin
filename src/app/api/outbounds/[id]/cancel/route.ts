import type { NextRequest } from 'next/server'

import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { cancelOutbound } from '@/server/services/outbound.service'

type RouteContext = { params: Promise<{ id: string }> }

export const POST = withApi(async (req: NextRequest, ctx: RouteContext) => {
  const auth = requirePermission('outbound.delete', req)
  const { id } = await ctx.params
  return ok(await cancelOutbound(id, auth.userId))
})
