import type { NextRequest } from 'next/server'

import { ApiErrors } from '@/server/lib/api-error'
import { withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { buildWorkbookBuffer, type ExcelColumn, xlsxResponse } from '@/server/lib/excel'
import { nonEmpty } from '@/server/lib/query'
import { listProducts } from '@/server/services/product.service'

const EXPORT_LIMIT = 10000

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('products.export', req)

  const sp = req.nextUrl.searchParams
  const status = sp.get('status')
  if (status && status !== 'active' && status !== 'inactive') {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }

  const { data, total } = await listProducts({
    q: nonEmpty(sp.get('q')),
    status: (status ?? undefined) as 'active' | 'inactive' | undefined,
    categoryId: nonEmpty(sp.get('categoryId')),
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
    { key: 'sku', header: 'SKU', width: 18 },
    { key: 'name', header: 'Tên sản phẩm', width: 32 },
    { key: 'categoryCode', header: 'Mã danh mục', width: 16, get: r => r.category?.code ?? '' },
    { key: 'categoryName', header: 'Tên danh mục', width: 24, get: r => r.category?.name ?? '' },
    { key: 'unit', header: 'Đơn vị', width: 10 },
    { key: 'price', header: 'Giá bán', width: 14, get: r => decimalToNumber(r.price) },
    { key: 'cost', header: 'Giá vốn', width: 14, get: r => decimalToNumber(r.cost) },
    { key: 'currency', header: 'Tiền tệ', width: 10 },
    { key: 'reorderLevel', header: 'Mức đặt lại', width: 14 },
    { key: 'safetyStock', header: 'Tồn an toàn', width: 14 },
    { key: 'barcode', header: 'Barcode', width: 18 },
    { key: 'dimensions', header: 'Kích thước', width: 16 },
    { key: 'weight', header: 'Khối lượng', width: 12, get: r => decimalToNumber(r.weight) },
    { key: 'description', header: 'Mô tả', width: 32 },
    { key: 'status', header: 'Trạng thái', width: 12 }
  ]

  const buf = await buildWorkbookBuffer(data, columns)
  return xlsxResponse(buf, `products-${new Date().toISOString().slice(0, 10)}.xlsx`)
})

function decimalToNumber(value: unknown): number | null {
  if (value == null) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number.parseFloat(value)
  if (typeof value === 'object' && value !== null && 'toNumber' in value && typeof (value as { toNumber: () => number }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber()
  }
  return null
}
