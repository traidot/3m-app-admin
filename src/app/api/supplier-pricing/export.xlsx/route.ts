import type { NextRequest } from 'next/server'

import { ApiErrors } from '@/server/lib/api-error'
import { withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { buildWorkbookBuffer, type ExcelColumn, xlsxResponse } from '@/server/lib/excel'
import { nonEmpty } from '@/server/lib/query'
import { listPricing } from '@/server/services/supplier-pricing.service'

const EXPORT_LIMIT = 10000
const STATUS_VALUES = ['active', 'expired', 'upcoming'] as const
const CURRENCY_VALUES = ['VND', 'USD', 'EUR', 'JPY', 'CNY', 'KRW'] as const
type Status = (typeof STATUS_VALUES)[number]
type Currency = (typeof CURRENCY_VALUES)[number]

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('supplier_pricing.export', req)

  const sp = req.nextUrl.searchParams
  const statusRaw = sp.get('status')
  if (statusRaw && !(STATUS_VALUES as readonly string[]).includes(statusRaw)) {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }
  const currencyRaw = sp.get('currency')
  if (currencyRaw && !(CURRENCY_VALUES as readonly string[]).includes(currencyRaw)) {
    throw ApiErrors.validation('currency không hợp lệ', { field: 'currency' })
  }

  const { data, total } = await listPricing({
    supplierId: nonEmpty(sp.get('supplierId')),
    productId: nonEmpty(sp.get('productId')),
    currency: (currencyRaw ?? undefined) as Currency | undefined,
    status: (statusRaw ?? undefined) as Status | undefined,
    skip: 0,
    take: EXPORT_LIMIT
  })

  if (total > EXPORT_LIMIT) {
    throw ApiErrors.badRequest(
      `Tập dữ liệu vượt giới hạn export (${EXPORT_LIMIT}). Vui lòng lọc thu hẹp.`,
      { totalRows: total, limit: EXPORT_LIMIT }
    )
  }

  type Row = (typeof data)[number]
  const columns: ExcelColumn<Row>[] = [
    { key: 'supplierCode', header: 'Mã NCC', width: 14, get: r => r.supplier?.code ?? '' },
    { key: 'supplierName', header: 'Tên NCC', width: 28, get: r => r.supplier?.name ?? '' },
    { key: 'productSku', header: 'SKU', width: 16, get: r => r.product?.sku ?? '' },
    { key: 'productName', header: 'Tên sản phẩm', width: 28, get: r => r.product?.name ?? '' },
    { key: 'price', header: 'Giá', width: 14, get: r => decimalToNumber(r.price) },
    { key: 'currency', header: 'Tiền tệ', width: 10 },
    { key: 'unit', header: 'Đơn vị', width: 10 },
    { key: 'moq', header: 'MOQ', width: 10 },
    { key: 'effectiveFrom', header: 'Hiệu lực từ', width: 18, get: r => isoDate(r.effectiveFrom) },
    { key: 'effectiveTo', header: 'Hiệu lực đến', width: 18, get: r => isoDate(r.effectiveTo) },
    { key: 'status', header: 'Trạng thái', width: 12 }
  ]

  const buf = await buildWorkbookBuffer(data, columns)
  return xlsxResponse(buf, `supplier-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`)
})

function decimalToNumber(value: unknown): number | null {
  if (value == null) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number.parseFloat(value)
  if (typeof value === 'object' && 'toNumber' in value && typeof (value as { toNumber: () => number }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber()
  }
  return null
}

function isoDate(value: Date | string | null | undefined): string {
  if (!value) return ''
  return value instanceof Date ? value.toISOString().slice(0, 10) : new Date(value).toISOString().slice(0, 10)
}
