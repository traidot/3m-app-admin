import type { NextRequest } from 'next/server'

import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { getOutboundAllocation } from '@/server/services/inventory.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('outbound.view', req)
  const { id } = await ctx.params
  return ok(await getOutboundAllocation(id))
})
