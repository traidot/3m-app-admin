import type { NextRequest } from 'next/server'

import { buildPagination, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { parsePage } from '@/server/lib/query'
import { listProductPricing } from '@/server/services/product.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('supplier_pricing.view', req)
  const { id } = await ctx.params
  const page = parsePage(req.nextUrl.searchParams)
  const { data, total } = await listProductPricing(id, { skip: page.skip, take: page.take })
  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})
