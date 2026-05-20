import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { noContent, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { SupplierUpdateSchema } from '@/server/schemas/supplier.schema'
import { getSupplier, softDeleteSupplier, updateSupplier } from '@/server/services/supplier.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('suppliers.view', req)
  const { id } = await ctx.params
  const supplier = await getSupplier(id)
  return ok(supplier)
})

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('suppliers.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(SupplierUpdateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const supplier = await updateSupplier(id, parsed.output)
  return ok(supplier)
})

export const DELETE = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('suppliers.delete', req)
  const { id } = await ctx.params
  await softDeleteSupplier(id)
  return noContent()
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
