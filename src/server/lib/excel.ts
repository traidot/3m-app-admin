import 'server-only'

import ExcelJS from 'exceljs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { ApiErrors } from './api-error'

export interface ExcelColumn<T> {
  key: string
  header: string
  width?: number
  /** Convert a row object to the cell value for this column. */
  get?: (row: T) => unknown
}

const SHEET_NAME = 'Sheet1'

/**
 * Build an .xlsx workbook buffer from typed rows.
 */
export async function buildWorkbookBuffer<T>(rows: T[], columns: ExcelColumn<T>[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'eSIM Market'
  wb.created = new Date()

  const ws = wb.addWorksheet(SHEET_NAME)
  ws.columns = columns.map(c => ({ header: c.header, key: c.key, width: c.width ?? 18 }))
  ws.getRow(1).font = { bold: true }
  ws.getRow(1).alignment = { vertical: 'middle' }

  for (const row of rows) {
    const cells: Record<string, unknown> = {}
    for (const col of columns) {
      cells[col.key] = col.get ? col.get(row) : (row as Record<string, unknown>)[col.key]
    }
    ws.addRow(cells)
  }

  ws.autoFilter = { from: 'A1', to: { row: 1, column: columns.length } }

  const buf = (await wb.xlsx.writeBuffer()) as Buffer
  return buf
}

/**
 * Return an .xlsx file response with cache-busting headers.
 */
export function xlsxResponse(buffer: Buffer, filename: string): NextResponse {
  const safeName = filename.replace(/[^\w.-]/g, '_')
  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${safeName}"`,
      'Cache-Control': 'no-store'
    }
  })
}

const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB

/**
 * Read uploaded .xlsx from a multipart request and return raw row objects.
 * Each row object is keyed by the workbook header → cell value.
 */
export async function parseWorkbookFromRequest(req: NextRequest): Promise<Record<string, unknown>[]> {
  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    throw ApiErrors.badRequest('Yêu cầu phải là multipart/form-data với field "file"')
  }
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    throw ApiErrors.badRequest('Không thể đọc form-data')
  }
  const file = form.get('file')
  if (!file || typeof file === 'string') {
    throw ApiErrors.badRequest('Thiếu file Excel (field "file")')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw ApiErrors.badRequest(`File vượt giới hạn ${Math.floor(MAX_FILE_BYTES / 1024 / 1024)}MB`)
  }
  const arrayBuffer = await file.arrayBuffer()
  const wb = new ExcelJS.Workbook()
  try {
    await wb.xlsx.load(arrayBuffer)
  } catch {
    throw ApiErrors.badRequest('File Excel không hợp lệ')
  }
  const ws = wb.worksheets[0]
  if (!ws) throw ApiErrors.badRequest('Workbook không có sheet nào')

  const headerRow = ws.getRow(1)
  const headers: (string | null)[] = []
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const v = cell.value
    headers[colNumber] = v == null ? null : String(v).trim()
  })

  const rows: Record<string, unknown>[] = []
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return
    const obj: Record<string, unknown> = {}
    let hasAny = false
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const key = headers[colNumber]
      if (!key) return
      const value = normalizeCellValue(cell.value)
      if (value !== null && value !== undefined && value !== '') hasAny = true
      obj[key] = value
    })
    if (hasAny) {
      // Preserve 1-based row number from sheet so error messages point at the user's file
      obj.__rowNumber = rowNumber
      rows.push(obj)
    }
  })
  return rows
}

function normalizeCellValue(value: ExcelJS.CellValue): unknown {
  if (value == null) return null
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object') {
    if ('text' in value && typeof value.text === 'string') return value.text.trim()
    if ('result' in value && value.result != null) return normalizeCellValue(value.result as ExcelJS.CellValue)
    if ('richText' in value && Array.isArray(value.richText)) {
      return value.richText.map(rt => rt.text).join('').trim()
    }
    if ('hyperlink' in value && typeof value.hyperlink === 'string') return value.hyperlink
  }
  return String(value)
}

export interface ImportRowError {
  row: number
  code: string
  message: string
  field?: string
}

export interface ImportSummary {
  totalRows: number
  created: number
  updated: number
  skipped: number
  errors: ImportRowError[]
}
