import type { NextRequest } from 'next/server'

import { buildPagination, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { nonEmpty, parsePage } from '@/server/lib/query'
import { listInventory } from '@/server/services/inventory.service'

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('inventory.view', req)
  const sp = req.nextUrl.searchParams
  const page = parsePage(sp)
  const lowStock = sp.get('lowStock')
  const { data, total } = await listInventory({
    warehouseId: nonEmpty(sp.get('warehouseId')),
    productId: nonEmpty(sp.get('productId')),
    lowStock: lowStock === 'true' || lowStock === '1',
    skip: page.skip,
    take: page.take
  })
  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})
