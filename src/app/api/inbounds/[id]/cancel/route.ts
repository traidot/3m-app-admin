import type { NextRequest } from 'next/server'

import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { cancelInbound } from '@/server/services/inbound.service'

type RouteContext = { params: Promise<{ id: string }> }

export const POST = withApi(async (req: NextRequest, ctx: RouteContext) => {
  const auth = requirePermission('inbound.delete', req)
  const { id } = await ctx.params
  return ok(await cancelInbound(id, auth.userId))
})
