import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { prisma } from '@/server/db'
import { ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { type ImportRowError, type ImportSummary, parseWorkbookFromRequest } from '@/server/lib/excel'
import { ProductCategoryCreateSchema, ProductCategoryUpdateSchema } from '@/server/schemas/product-category.schema'
import { createCategory, moveCategory, updateCategory } from '@/server/services/product-category.service'

const HEADER_MAP: Record<string, string> = {
  'Mã danh mục': 'code',
  'Tên danh mục': 'name',
  'Mã danh mục cha': 'parentCode',
  'Thứ tự': 'sortOrder',
  'Mô tả': 'description',
  'Trạng thái': 'status',
  // English headers
  code: 'code',
  name: 'name',
  parentCode: 'parentCode',
  sortOrder: 'sortOrder',
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

/**
 * Categories must be processed top-down so that a child row can resolve its parent
 * via a code that was just created in the same import batch.
 */
function sortRowsByDependency(rows: Array<{ row: number; data: Record<string, unknown> }>): Array<{
  row: number
  data: Record<string, unknown>
}> {
  const codeToIndex = new Map<string, number>()
  rows.forEach((r, i) => {
    const code = typeof r.data.code === 'string' ? r.data.code.toUpperCase() : null
    if (code) codeToIndex.set(code, i)
  })
  const visited = new Set<number>()
  const ordered: typeof rows = []
  const visit = (i: number, stack: Set<number>): void => {
    if (visited.has(i) || stack.has(i)) return
    stack.add(i)
    const parentCode = rows[i].data.parentCode
    if (typeof parentCode === 'string') {
      const parentIdx = codeToIndex.get(parentCode.toUpperCase())
      if (parentIdx != null && parentIdx !== i) visit(parentIdx, stack)
    }
    stack.delete(i)
    visited.add(i)
    ordered.push(rows[i])
  }
  rows.forEach((_, i) => visit(i, new Set()))
  return ordered
}

export const POST = withApi(async (req: NextRequest) => {
  requirePermission('product_categories.import', req)

  const rawRows = await parseWorkbookFromRequest(req)
  const summary: ImportSummary = { totalRows: rawRows.length, created: 0, updated: 0, skipped: 0, errors: [] }

  const projected = rawRows.map(r => ({ row: (r.__rowNumber as number) ?? 0, data: projectRow(r) }))
  const ordered = sortRowsByDependency(projected)

  for (const { row: rowNumber, data } of ordered) {
    try {
      const parentCodeRaw = data.parentCode
      const parentCode = typeof parentCodeRaw === 'string' && parentCodeRaw.trim().length > 0 ? parentCodeRaw.toUpperCase() : null
      let parentId: string | null = null
      if (parentCode) {
        const parent = await prisma.productCategory.findUnique({ where: { code: parentCode } })
        if (!parent || parent.deletedAt) {
          summary.errors.push({
            row: rowNumber,
            code: 'PARENT_NOT_FOUND',
            message: `Không tìm thấy danh mục cha: ${parentCode}`,
            field: 'parentCode'
          })
          summary.skipped++
          continue
        }
        parentId = parent.id
      }
      // Coerce sortOrder
      if (data.sortOrder != null && typeof data.sortOrder !== 'number') {
        const n = Number(data.sortOrder)
        if (Number.isFinite(n)) data.sortOrder = n
        else delete data.sortOrder
      }
      delete data.parentCode

      const codeRaw = typeof data.code === 'string' ? data.code.toUpperCase() : null
      if (!codeRaw) {
        summary.errors.push({ row: rowNumber, code: 'VALIDATION_ERROR', message: 'Thiếu Mã danh mục', field: 'code' })
        summary.skipped++
        continue
      }

      const existing = await prisma.productCategory.findUnique({ where: { code: codeRaw } })
      if (existing) {
        // Update non-parent fields
        const updateInput = { ...data }
        delete updateInput.parentId
        const parsedUpdate = v.safeParse(ProductCategoryUpdateSchema, updateInput)
        if (!parsedUpdate.success) {
          summary.errors.push(rowError(rowNumber, parsedUpdate.issues))
          summary.skipped++
          continue
        }
        await updateCategory(existing.id, parsedUpdate.output)
        // Move only if parent changed
        if ((existing.parentId ?? null) !== parentId) {
          await moveCategory(existing.id, { parentId })
        }
        summary.updated++
      } else {
        const createInput = { ...data, parentId }
        const parsedCreate = v.safeParse(ProductCategoryCreateSchema, createInput)
        if (!parsedCreate.success) {
          summary.errors.push(rowError(rowNumber, parsedCreate.issues))
          summary.skipped++
          continue
        }
        await createCategory(parsedCreate.output)
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
