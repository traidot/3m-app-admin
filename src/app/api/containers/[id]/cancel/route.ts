import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { ContainerCancelSchema } from '@/server/schemas/container.schema'
import { cancelContainer } from '@/server/services/container.service'

type RouteContext = { params: Promise<{ id: string }> }

export const POST = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('containers.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(ContainerCancelSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const container = await cancelContainer(id, parsed.output.reason)
  return ok(container)
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
