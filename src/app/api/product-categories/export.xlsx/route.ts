import type { NextRequest } from 'next/server'

import { prisma } from '@/server/db'
import { ApiErrors } from '@/server/lib/api-error'
import { withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { buildWorkbookBuffer, type ExcelColumn, xlsxResponse } from '@/server/lib/excel'
import { listCategories } from '@/server/services/product-category.service'

export const GET = withApi(async (req: NextRequest) => {
  requirePermission('product_categories.export', req)

  const sp = req.nextUrl.searchParams
  const status = sp.get('status')
  if (status && status !== 'active' && status !== 'inactive') {
    throw ApiErrors.validation('status không hợp lệ', { field: 'status' })
  }

  const data = await listCategories({ status: (status ?? undefined) as 'active' | 'inactive' | undefined })

  // Build id → code map for parent resolution
  const codeById = new Map(data.map((c: { id: string; code: string }) => [c.id, c.code]))
  // Also pull soft-deleted parents that may still be referenced (defensive)
  const missingParentIds = data
    .map(c => c.parentId)
    .filter((id): id is string => typeof id === 'string' && !codeById.has(id))
  if (missingParentIds.length) {
    const extras = await prisma.productCategory.findMany({
      where: { id: { in: missingParentIds } },
      select: { id: true, code: true }
    })
    for (const e of extras) codeById.set(e.id, e.code)
  }

  type Row = (typeof data)[number]
  const columns: ExcelColumn<Row>[] = [
    { key: 'code', header: 'Mã danh mục', width: 18 },
    { key: 'name', header: 'Tên danh mục', width: 32 },
    { key: 'parentCode', header: 'Mã danh mục cha', width: 18, get: r => (r.parentId ? codeById.get(r.parentId) ?? '' : '') },
    { key: 'sortOrder', header: 'Thứ tự', width: 10 },
    { key: 'depth', header: 'Cấp', width: 8 },
    { key: 'description', header: 'Mô tả', width: 40 },
    { key: 'status', header: 'Trạng thái', width: 12 }
  ]

  const buf = await buildWorkbookBuffer(data, columns)
  return xlsxResponse(buf, `product-categories-${new Date().toISOString().slice(0, 10)}.xlsx`)
})
