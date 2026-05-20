import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { buildPagination, created, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { nonEmpty, parsePage } from '@/server/lib/query'
import { OutboundCreateSchema } from '@/server/schemas/outbound.schema'
import { createOutbound, listOutbounds } from '@/server/services/outbound.service'

const TARGET_TYPES = ['customer', 'warehouse', 'supplier'] as const
const STATUSES = ['draft', 'allocated', 'picked', 'shipped', 'cancelled'] as const

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('outbound.view', req)
  const sp = req.nextUrl.searchParams
  const page = parsePage(sp)

  const targetTypeRaw = nonEmpty(sp.get('targetType'))
  if (targetTypeRaw && !TARGET_TYPES.includes(targetTypeRaw as (typeof TARGET_TYPES)[number])) {
    throw ApiErrors.validation('targetType không hợp lệ', { field: 'targetType' })
  }
  const statusRaw = nonEmpty(sp.get('status'))
  if (statusRaw && !STATUSES.includes(statusRaw as (typeof STATUSES)[number])) {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }

  const { data, total } = await listOutbounds({
    warehouseId: nonEmpty(sp.get('warehouseId')),
    targetType: targetTypeRaw as (typeof TARGET_TYPES)[number] | undefined,
    status: statusRaw as (typeof STATUSES)[number] | undefined,
    skip: page.skip,
    take: page.take
  })

  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('outbound.create', req)
  const body = await readJson(req)
  const parsed = v.safeParse(OutboundCreateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  return created(await createOutbound(parsed.output))
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
