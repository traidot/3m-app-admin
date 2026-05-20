import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { prisma } from '@/server/db'
import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { type ImportRowError, type ImportSummary, parseWorkbookFromRequest } from '@/server/lib/excel'
import { SupplierCreateSchema } from '@/server/schemas/supplier.schema'
import { createSupplier, updateSupplier } from '@/server/services/supplier.service'

const HEADER_MAP: Record<string, string> = {
  'Mã NCC': 'code',
  'Tên NCC': 'name',
  'Quốc gia': 'country',
  'Điện thoại': 'phone',
  Email: 'email',
  MST: 'taxCode',
  'Người liên hệ': 'contactPerson',
  'Điều khoản TT': 'paymentTerm',
  'Địa chỉ': 'address',
  'Ghi chú': 'notes',
  'Trạng thái': 'status',
  // Accept the canonical English headers too — round-trips export → re-import cleanly
  code: 'code',
  name: 'name',
  country: 'country',
  phone: 'phone',
  email: 'email',
  taxCode: 'taxCode',
  contactPerson: 'contactPerson',
  paymentTerm: 'paymentTerm',
  address: 'address',
  notes: 'notes',
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
  requirePermission('suppliers.import', req)

  const rows = await parseWorkbookFromRequest(req)
  const summary: ImportSummary = { totalRows: rows.length, created: 0, updated: 0, skipped: 0, errors: [] }

  for (const raw of rows) {
    const rowNumber = (raw.__rowNumber as number) ?? 0
    try {
      const projected = projectRow(raw)
      const parsed = v.safeParse(SupplierCreateSchema, projected)
      if (!parsed.success) {
        summary.errors.push(rowError(rowNumber, 'VALIDATION_ERROR', parsed.issues))
        summary.skipped++
        continue
      }
      const existing = await prisma.supplier.findUnique({ where: { code: parsed.output.code } })
      if (existing) {
        await updateSupplier(existing.id, parsed.output)
        summary.updated++
      } else {
        await createSupplier(parsed.output)
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

function rowError(row: number, code: string, issues: unknown): ImportRowError {
  const list = (issues as Array<{ message?: string; path?: Array<{ key?: string }> }>) || []
  const first = list[0]
  return {
    row,
    code,
    message: first?.message ? `${first.message}` : 'Validation error',
    field: first?.path?.[0]?.key
  }
}

