import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { buildPagination, created, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { nonEmpty, parsePage } from '@/server/lib/query'
import { InboundCreateSchema } from '@/server/schemas/inbound.schema'
import { createInbound, listInbounds } from '@/server/services/inbound.service'

const SOURCE_TYPES = ['po', 'return_inbound', 'transfer_in', 'manual'] as const
const STATUSES = ['draft', 'posted', 'cancelled'] as const

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('inbound.view', req)
  const sp = req.nextUrl.searchParams
  const page = parsePage(sp)

  const sourceTypeRaw = nonEmpty(sp.get('sourceType'))
  if (sourceTypeRaw && !SOURCE_TYPES.includes(sourceTypeRaw as (typeof SOURCE_TYPES)[number])) {
    throw ApiErrors.validation('sourceType không hợp lệ', { field: 'sourceType' })
  }
  const statusRaw = nonEmpty(sp.get('status'))
  if (statusRaw && !STATUSES.includes(statusRaw as (typeof STATUSES)[number])) {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }

  const { data, total } = await listInbounds({
    warehouseId: nonEmpty(sp.get('warehouseId')),
    sourceType: sourceTypeRaw as (typeof SOURCE_TYPES)[number] | undefined,
    status: statusRaw as (typeof STATUSES)[number] | undefined,
    skip: page.skip,
    take: page.take
  })

  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('inbound.create', req)
  const body = await readJson(req)
  const parsed = v.safeParse(InboundCreateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  return created(await createInbound(parsed.output))
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
