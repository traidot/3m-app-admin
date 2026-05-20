import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { noContent, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { OutboundUpdateSchema } from '@/server/schemas/outbound.schema'
import { getOutbound, softDeleteOutbound, updateOutbound } from '@/server/services/outbound.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('outbound.view', req)
  const { id } = await ctx.params
  return ok(await getOutbound(id))
})

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('outbound.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(OutboundUpdateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  return ok(await updateOutbound(id, parsed.output))
})

export const DELETE = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('outbound.delete', req)
  const { id } = await ctx.params
  await softDeleteOutbound(id)
  return noContent()
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
