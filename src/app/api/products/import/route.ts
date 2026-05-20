import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { prisma } from '@/server/db'
import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { type ImportRowError, type ImportSummary, parseWorkbookFromRequest } from '@/server/lib/excel'
import { ProductCreateSchema } from '@/server/schemas/product.schema'
import { createProduct, updateProduct } from '@/server/services/product.service'

const HEADER_MAP: Record<string, string> = {
  SKU: 'sku',
  'Tên sản phẩm': 'name',
  'Mã danh mục': 'categoryCode',
  'Đơn vị': 'unit',
  'Giá bán': 'price',
  'Giá vốn': 'cost',
  'Tiền tệ': 'currency',
  'Mức đặt lại': 'reorderLevel',
  'Tồn an toàn': 'safetyStock',
  Barcode: 'barcode',
  'Kích thước': 'dimensions',
  'Khối lượng': 'weight',
  'Mô tả': 'description',
  'Trạng thái': 'status',
  // English headers (round-trip)
  sku: 'sku',
  name: 'name',
  categoryCode: 'categoryCode',
  unit: 'unit',
  price: 'price',
  cost: 'cost',
  currency: 'currency',
  reorderLevel: 'reorderLevel',
  safetyStock: 'safetyStock',
  barcode: 'barcode',
  dimensions: 'dimensions',
  weight: 'weight',
  description: 'description',
  status: 'status'
}

function projectRow(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [header, value] of Object.entries(raw)) {
    if (header === '__rowNumber') continue
    const key = HEADER_MAP[header]
    if (!key) continue
    if (value === null || value === '') continue
    out[key] = value
  }
  return out
}

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('products.import', req)

  const rows = await parseWorkbookFromRequest(req)
  const summary: ImportSummary = { totalRows: rows.length, created: 0, updated: 0, skipped: 0, errors: [] }

  // Pre-resolve category code → id (skip rows whose category doesn't exist)
  const categoryCodes = Array.from(
    new Set(
      rows
        .map(r => projectRow(r).categoryCode)
        .filter((v): v is string => typeof v === 'string' && v.length > 0)
        .map(v => v.toUpperCase())
    )
  )
  const categories = categoryCodes.length
    ? await prisma.productCategory.findMany({
        where: { code: { in: categoryCodes }, deletedAt: null },
        select: { id: true, code: true }
      })
    : []
  const categoryIdByCode = new Map(categories.map((c: { code: string; id: string }) => [c.code, c.id]))

  for (const raw of rows) {
    const rowNumber = (raw.__rowNumber as number) ?? 0
    try {
      const projected = projectRow(raw)
      const codeRaw = projected.categoryCode
      const categoryCode = typeof codeRaw === 'string' ? codeRaw.toUpperCase() : null
      if (!categoryCode) {
        summary.errors.push({ row: rowNumber, code: 'VALIDATION_ERROR', message: 'Thiếu Mã danh mục', field: 'categoryCode' })
        summary.skipped++
        continue
      }
      const categoryId = categoryIdByCode.get(categoryCode)
      if (!categoryId) {
        summary.errors.push({
          row: rowNumber,
          code: 'CATEGORY_NOT_FOUND',
          message: `Không tìm thấy danh mục: ${categoryCode}`,
          field: 'categoryCode'
        })
        summary.skipped++
        continue
      }
      delete projected.categoryCode
      projected.categoryId = categoryId

      // Coerce numeric fields (Excel may give them as strings)
      for (const numField of ['price', 'cost', 'reorderLevel', 'safetyStock', 'weight'] as const) {
        if (projected[numField] != null && typeof projected[numField] !== 'number') {
          const n = Number(projected[numField])
          if (Number.isFinite(n)) projected[numField] = n
          else delete projected[numField]
        }
      }

      const parsed = v.safeParse(ProductCreateSchema, projected)
      if (!parsed.success) {
        summary.errors.push(rowError(rowNumber, parsed.issues))
        summary.skipped++
        continue
      }
      const existing = await prisma.product.findUnique({ where: { sku: parsed.output.sku } })
      if (existing) {
        await updateProduct(existing.id, parsed.output)
        summary.updated++
      } else {
        await createProduct(parsed.output)
        summary.created++
      }
    } catch (err) {
      const e = err as { code?: string; message?: string; field?: string }
      summary.errors.push({
        row: rowNumber,
        code: e.code ?? 'IMPORT_ERROR',
        message: e.message ?? 'Lỗi không xác định',
        field: e.field
      })
      summary.skipped++
    }
  }

  return ok(summary)
})

function rowError(row: number, issues: unknown): ImportRowError {
  const list = (issues as Array<{ message?: string; path?: Array<{ key?: string }> }>) || []
  const first = list[0]
  return {
    row,
    code: 'VALIDATION_ERROR',
    message: first?.message ?? 'Validation error',
    field: first?.path?.[0]?.key
  }
}

