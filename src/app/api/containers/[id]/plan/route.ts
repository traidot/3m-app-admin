import type { NextRequest } from 'next/server'

import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { planContainer } from '@/server/services/container.service'

type RouteContext = { params: Promise<{ id: string }> }

export const POST = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('containers.approve', req)
  const { id } = await ctx.params
  const container = await planContainer(id)
  return ok(container)
})
