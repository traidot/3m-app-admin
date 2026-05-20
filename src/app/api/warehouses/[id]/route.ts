import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { noContent, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { WarehouseUpdateSchema } from '@/server/schemas/warehouse.schema'
import { getWarehouse, softDeleteWarehouse, updateWarehouse } from '@/server/services/warehouse.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('settings.view', req)
  const { id } = await ctx.params
  return ok(await getWarehouse(id))
})

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('settings.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(WarehouseUpdateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  return ok(await updateWarehouse(id, parsed.output))
})

export const DELETE = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('settings.update', req)
  const { id } = await ctx.params
  await softDeleteWarehouse(id)
  return noContent()
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
