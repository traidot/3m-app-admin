import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { ContainerShipSchema } from '@/server/schemas/container.schema'
import { shipContainer } from '@/server/services/container.service'

type RouteContext = { params: Promise<{ id: string }> }

export const POST = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('containers.approve', req)
  const { id } = await ctx.params

  let body: unknown = {}
  try {
    body = await req.json()
  } catch {
    // body is optional for ship
  }
  const parsed = v.safeParse(ContainerShipSchema, body ?? {})
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }

  const container = await shipContainer(id, parsed.output)
  return ok(container)
})
