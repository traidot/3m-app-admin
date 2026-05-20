import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { buildPagination, created, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { nonEmpty, parsePage } from '@/server/lib/query'
import { SupplierPricingCreateSchema } from '@/server/schemas/supplier-pricing.schema'
import { createPricing, listPricing } from '@/server/services/supplier-pricing.service'

const CURRENCIES = ['VND', 'USD', 'EUR', 'JPY', 'CNY', 'KRW'] as const
const STATUSES = ['active', 'expired', 'upcoming'] as const

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('supplier_pricing.view', req)
  const sp = req.nextUrl.searchParams
  const page = parsePage(sp)

  const currencyRaw = nonEmpty(sp.get('currency'))
  if (currencyRaw && !CURRENCIES.includes(currencyRaw as (typeof CURRENCIES)[number])) {
    throw ApiErrors.validation('currency không hợp lệ', { field: 'currency' })
  }
  const statusRaw = nonEmpty(sp.get('status'))
  if (statusRaw && !STATUSES.includes(statusRaw as (typeof STATUSES)[number])) {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }

  const { data, total } = await listPricing({
    supplierId: nonEmpty(sp.get('supplierId')),
    productId: nonEmpty(sp.get('productId')),
    currency: currencyRaw as (typeof CURRENCIES)[number] | undefined,
    status: statusRaw as (typeof STATUSES)[number] | undefined,
    skip: page.skip,
    take: page.take
  })

  return ok(data, { pagination: buildPagination({ page: page.page, pageSize: page.pageSize, total }) })
})

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('supplier_pricing.create', req)
  const body = await readJson(req)
  const parsed = v.safeParse(SupplierPricingCreateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const pricing = await createPricing(parsed.output)
  return created(pricing)
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
