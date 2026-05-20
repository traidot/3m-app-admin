import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { buildPagination, created, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { nonEmpty, parsePage, parseSort, toOrderBy } from '@/server/lib/query'
import { ContainerCreateSchema } from '@/server/schemas/container.schema'
import { createContainer, listContainers } from '@/server/services/container.service'

const SORTABLE = ['code', 'name', 'plannedDepartureAt', 'createdAt'] as const
const STATUS_VALUES = ['draft', 'planned', 'loading', 'loaded', 'shipped', 'cancelled'] as const
type Status = (typeof STATUS_VALUES)[number]

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('containers.view', req)

  const sp = req.nextUrl.searchParams
  const page = parsePage(sp)
  const sort = parseSort(sp, SORTABLE, { field: 'createdAt', direction: 'desc' })
  const statusRaw = sp.get('status')
  if (statusRaw && !(STATUS_VALUES as readonly string[]).includes(statusRaw)) {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }

  const { data, total } = await listContainers({
    q: nonEmpty(sp.get('q')),
    status: (statusRaw ?? undefined) as Status | undefined,
    originWarehouseId: nonEmpty(sp.get('originWarehouseId')),
    skip: page.skip,
    take: page.take,
    orderBy: toOrderBy(sort)
  })

  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('containers.create', req)
  const body = await readJson(req)
  const parsed = v.safeParse(ContainerCreateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const container = await createContainer(parsed.output)
  return created(container)
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
