import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { buildPagination, created, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { nonEmpty, parsePage, parseSort, toOrderBy } from '@/server/lib/query'
import { SupplierCreateSchema } from '@/server/schemas/supplier.schema'
import { createSupplier, listSuppliers } from '@/server/services/supplier.service'

const SORTABLE = ['code', 'name', 'country', 'createdAt'] as const

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('suppliers.view', req)

  const sp = req.nextUrl.searchParams
  const page = parsePage(sp)
  const sort = parseSort(sp, SORTABLE, { field: 'createdAt', direction: 'desc' })
  const status = sp.get('status')
  if (status && status !== 'active' && status !== 'inactive') {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }

  const { data, total } = await listSuppliers({
    q: nonEmpty(sp.get('q')),
    status: (status ?? undefined) as 'active' | 'inactive' | undefined,
    country: nonEmpty(sp.get('country')),
    skip: page.skip,
    take: page.take,
    orderBy: toOrderBy(sort)
  })

  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('suppliers.create', req)
  const body = await readJson(req)
  const parsed = v.safeParse(SupplierCreateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const supplier = await createSupplier(parsed.output)
  return created(supplier)
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
