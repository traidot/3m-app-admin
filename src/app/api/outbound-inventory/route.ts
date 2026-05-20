import type { NextRequest } from 'next/server'

import { buildPagination, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { nonEmpty, parsePage } from '@/server/lib/query'
import { listOutboundInventory } from '@/server/services/inventory.service'

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('outbound.view', req)
  const sp = req.nextUrl.searchParams
  const page = parsePage(sp)
  const { data, total } = await listOutboundInventory({
    warehouseId: nonEmpty(sp.get('warehouseId')),
    productId: nonEmpty(sp.get('productId')),
    outboundId: nonEmpty(sp.get('outboundId')),
    skip: page.skip,
    take: page.take
  })
  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})
