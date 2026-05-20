import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { noContent, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { SupplierPricingUpdateSchema } from '@/server/schemas/supplier-pricing.schema'
import { getPricing, softDeletePricing, updatePricing } from '@/server/services/supplier-pricing.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('supplier_pricing.view', req)
  const { id } = await ctx.params
  const pricing = await getPricing(id)
  return ok(pricing)
})

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('supplier_pricing.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(SupplierPricingUpdateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const pricing = await updatePricing(id, parsed.output)
  return ok(pricing)
})

export const DELETE = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('supplier_pricing.delete', req)
  const { id } = await ctx.params
  await softDeletePricing(id)
  return noContent()
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
