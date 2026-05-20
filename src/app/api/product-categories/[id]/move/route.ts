import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { ProductCategoryMoveSchema } from '@/server/schemas/product-category.schema'
import { moveCategory } from '@/server/services/product-category.service'

type RouteContext = { params: Promise<{ id: string }> }

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('product_categories.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(ProductCategoryMoveSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const category = await moveCategory(id, parsed.output)
  return ok(category)
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
