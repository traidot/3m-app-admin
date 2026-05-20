import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { prisma } from '@/server/db'
import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { type ImportRowError, type ImportSummary, parseWorkbookFromRequest } from '@/server/lib/excel'
import { SupplierPricingCreateSchema, SupplierPricingUpdateSchema } from '@/server/schemas/supplier-pricing.schema'
import { createPricing, updatePricing } from '@/server/services/supplier-pricing.service'

const HEADER_MAP: Record<string, string> = {
  'Mã NCC': 'supplierCode',
  SKU: 'productSku',
  'Giá': 'price',
  'Tiền tệ': 'currency',
  'Đơn vị': 'unit',
  MOQ: 'moq',
  'Hiệu lực từ': 'effectiveFrom',
  'Hiệu lực đến': 'effectiveTo',
  // English headers
  supplierCode: 'supplierCode',
  productSku: 'productSku',
  price: 'price',
  currency: 'currency',
  unit: 'unit',
  moq: 'moq',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo'
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

function toIsoDate(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const d = new Date(trimmed)
    if (Number.isNaN(d.getTime())) return null
    return d.toISOString()
  }
  if (typeof value === 'number') {
    // Excel date serial (rare; exceljs usually returns Date instances). Treat as days from 1899-12-30.
    const ms = (value - 25569) * 86400 * 1000
    const d = new Date(ms)
    if (Number.isNaN(d.getTime())) return null
    return d.toISOString()
  }
  return null
}

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('supplier_pricing.import', req)

  const rows = await parseWorkbookFromRequest(req)
  const summary: ImportSummary = { totalRows: rows.length, created: 0, updated: 0, skipped: 0, errors: [] }

  // Pre-resolve supplier codes + product SKUs in bulk
  const supplierCodes = new Set<string>()
  const productSkus = new Set<string>()
  for (const r of rows) {
    const projected = projectRow(r)
    if (typeof projected.supplierCode === 'string') supplierCodes.add(projected.supplierCode.toUpperCase())
    if (typeof projected.productSku === 'string') productSkus.add(projected.productSku.toUpperCase())
  }
  const [suppliers, products] = await Promise.all([
    supplierCodes.size
      ? prisma.supplier.findMany({ where: { code: { in: Array.from(supplierCodes) }, deletedAt: null }, select: { id: true, code: true } })
      : Promise.resolve([] as { id: string; code: string }[]),
    productSkus.size
      ? prisma.product.findMany({ where: { sku: { in: Array.from(productSkus) }, deletedAt: null }, select: { id: true, sku: true } })
      : Promise.resolve([] as { id: string; sku: string }[])
  ])
  const supplierIdByCode = new Map(suppliers.map((s: { code: string; id: string }) => [s.code, s.id]))
  const productIdBySku = new Map(products.map((p: { sku: string; id: string }) => [p.sku, p.id]))

  for (const raw of rows) {
    const rowNumber = (raw.__rowNumber as number) ?? 0
    try {
      const projected = projectRow(raw)

      const supplierCode = typeof projected.supplierCode === 'string' ? projected.supplierCode.toUpperCase() : null
      const productSku = typeof projected.productSku === 'string' ? projected.productSku.toUpperCase() : null
      if (!supplierCode || !productSku) {
        summary.errors.push({
          row: rowNumber,
          code: 'VALIDATION_ERROR',
          message: 'Thiếu Mã NCC hoặc SKU',
          field: !supplierCode ? 'supplierCode' : 'productSku'
        })
        summary.skipped++
        continue
      }
      const supplierId = supplierIdByCode.get(supplierCode)
      const productId = productIdBySku.get(productSku)
      if (!supplierId || !productId) {
        summary.errors.push({
          row: rowNumber,
          code: !supplierId ? 'SUPPLIER_NOT_FOUND' : 'PRODUCT_NOT_FOUND',
          message: !supplierId
            ? `Không tìm thấy nhà cung cấp: ${supplierCode}`
            : `Không tìm thấy sản phẩm: ${productSku}`,
          field: !supplierId ? 'supplierCode' : 'productSku'
        })
        summary.skipped++
        continue
      }

      // Coerce numeric fields
      for (const numField of ['price', 'moq'] as const) {
        if (projected[numField] != null && typeof projected[numField] !== 'number') {
          const n = Number(projected[numField])
          if (Number.isFinite(n)) projected[numField] = n
          else delete projected[numField]
        }
      }

      // Coerce date fields
      const fromIso = toIsoDate(projected.effectiveFrom)
      const toIso = projected.effectiveTo == null ? null : toIsoDate(projected.effectiveTo)
      if (!fromIso) {
        summary.errors.push({
          row: rowNumber,
          code: 'VALIDATION_ERROR',
          message: 'Ngày "Hiệu lực từ" không hợp lệ',
          field: 'effectiveFrom'
        })
        summary.skipped++
        continue
      }
      projected.effectiveFrom = fromIso
      if (toIso !== undefined) projected.effectiveTo = toIso

      delete projected.supplierCode
      delete projected.productSku

      const currency = (projected.currency as string | undefined) ?? 'VND'

      // Look for existing row by composite key
      const existing = await prisma.supplierPricing.findFirst({
        where: {
          supplierId,
          productId,
          currency: currency as 'VND' | 'USD' | 'EUR' | 'JPY' | 'CNY' | 'KRW',
          effectiveFrom: new Date(fromIso),
          deletedAt: null
        }
      })

      if (existing) {
        const parsedUpdate = v.safeParse(SupplierPricingUpdateSchema, projected)
        if (!parsedUpdate.success) {
          summary.errors.push(rowError(rowNumber, parsedUpdate.issues))
          summary.skipped++
          continue
        }
        await updatePricing(existing.id, parsedUpdate.output)
        summary.updated++
      } else {
        const createInput = { supplierId, productId, ...projected }
        const parsedCreate = v.safeParse(SupplierPricingCreateSchema, createInput)
        if (!parsedCreate.success) {
          summary.errors.push(rowError(rowNumber, parsedCreate.issues))
          summary.skipped++
          continue
        }
        await createPricing(parsedCreate.output)
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
