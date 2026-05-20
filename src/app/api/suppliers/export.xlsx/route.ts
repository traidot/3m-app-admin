import type { NextRequest } from 'next/server'

import { ApiErrors } from '@/server/lib/api-error'
import { withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { buildWorkbookBuffer, type ExcelColumn, xlsxResponse } from '@/server/lib/excel'
import { nonEmpty } from '@/server/lib/query'
import { listSuppliers } from '@/server/services/supplier.service'

const EXPORT_LIMIT = 5000

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('suppliers.export', req)

  const sp = req.nextUrl.searchParams
  const status = sp.get('status')
  if (status && status !== 'active' && status !== 'inactive') {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }

  const { data, total } = await listSuppliers({
    q: nonEmpty(sp.get('q')),
    status: (status ?? undefined) as 'active' | 'inactive' | undefined,
    country: nonEmpty(sp.get('country')),
    skip: 0,
    take: EXPORT_LIMIT
  })

  if (total > EXPORT_LIMIT) {
    throw ApiErrors.badRequest(
      `Tập dữ liệu vượt giới hạn export (${EXPORT_LIMIT}). Vui lòng lọc thu hẹp.`,
      { totalRows: total, limit: EXPORT_LIMIT }
    )
  }

  const columns: ExcelColumn<(typeof data)[number]>[] = [
    { key: 'code', header: 'Mã NCC', width: 18 },
    { key: 'name', header: 'Tên NCC', width: 32 },
    { key: 'country', header: 'Quốc gia', width: 16 },
    { key: 'phone', header: 'Điện thoại', width: 18 },
    { key: 'email', header: 'Email', width: 28 },
    { key: 'taxCode', header: 'MST', width: 18 },
    { key: 'contactPerson', header: 'Người liên hệ', width: 22 },
    { key: 'paymentTerm', header: 'Điều khoản TT', width: 22 },
    { key: 'address', header: 'Địa chỉ', width: 40 },
    { key: 'notes', header: 'Ghi chú', width: 30 },
    { key: 'status', header: 'Trạng thái', width: 12 }
  ]

  const buf = await buildWorkbookBuffer(data, columns)
  return xlsxResponse(buf, `suppliers-${new Date().toISOString().slice(0, 10)}.xlsx`)
})
