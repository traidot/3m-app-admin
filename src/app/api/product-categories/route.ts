import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { created, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { ProductCategoryCreateSchema } from '@/server/schemas/product-category.schema'
import { createCategory, getCategoriesAsTree, listCategories } from '@/server/services/product-category.service'

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('product_categories.view', req)
  const sp = req.nextUrl.searchParams
  const status = sp.get('status')
  if (status && status !== 'active' && status !== 'inactive') {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }
  const tree = sp.get('tree') === 'true'
  const data = tree
    ? await getCategoriesAsTree({ status: (status ?? undefined) as 'active' | 'inactive' | undefined })
    : await listCategories({ status: (status ?? undefined) as 'active' | 'inactive' | undefined })
  return ok(data)
})

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('product_categories.create', req)
  const body = await readJson(req)
  const parsed = v.safeParse(ProductCategoryCreateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const category = await createCategory(parsed.output)
  return created(category)
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
