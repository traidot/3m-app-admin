import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { buildPagination, created, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { nonEmpty, parsePage } from '@/server/lib/query'
import { WarehouseCreateSchema } from '@/server/schemas/warehouse.schema'
import { createWarehouse, listWarehouses } from '@/server/services/warehouse.service'

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('settings.view', req)
  const sp = req.nextUrl.searchParams
  const page = parsePage(sp)
  const status = sp.get('status')
  if (status && status !== 'active' && status !== 'inactive') {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }
  const { data, total } = await listWarehouses({
    q: nonEmpty(sp.get('q')),
    status: (status ?? undefined) as 'active' | 'inactive' | undefined,
    skip: page.skip,
    take: page.take
  })
  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('settings.update', req)
  const body = await readJson(req)
  const parsed = v.safeParse(WarehouseCreateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  return created(await createWarehouse(parsed.output))
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
