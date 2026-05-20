import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { noContent, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { ProductCategoryUpdateSchema } from '@/server/schemas/product-category.schema'
import { getCategory, softDeleteCategory, updateCategory } from '@/server/services/product-category.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('product_categories.view', req)
  const { id } = await ctx.params
  const category = await getCategory(id)
  return ok(category)
})

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('product_categories.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(ProductCategoryUpdateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const category = await updateCategory(id, parsed.output)
  return ok(category)
})

export const DELETE = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('product_categories.delete', req)
  const { id } = await ctx.params
  await softDeleteCategory(id)
  return noContent()
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
