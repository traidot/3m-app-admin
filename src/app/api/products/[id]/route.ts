import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { noContent, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { ProductUpdateSchema } from '@/server/schemas/product.schema'
import { getProduct, softDeleteProduct, updateProduct } from '@/server/services/product.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('products.view', req)
  const { id } = await ctx.params
  const product = await getProduct(id)
  return ok(product)
})

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('products.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(ProductUpdateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const product = await updateProduct(id, parsed.output)
  return ok(product)
})

export const DELETE = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('products.delete', req)
  const { id } = await ctx.params
  await softDeleteProduct(id)
  return noContent()
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
