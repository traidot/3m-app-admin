'use client'

import { useState, useCallback, useRef } from 'react'

import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Grid2 from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tooltip from '@mui/material/Tooltip'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'

import PageHeader from '@/components/layout/shared/PageHeader'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'


// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface SheetInfo {
  name: string
  rowCount: number
  colCount: number
  sampleHeaders: string[]          // hàng được detect là header
  firstDataRows: unknown[][]       // 8 dòng đầu để preview (trimmed)
  detectedHeaderIndex: number      // 0-based index trong firstDataRows
}

interface SheetConfig {
  sheetName: string
  headerRow: number            // user chọn dòng nào là header (1-based)
  enabled: boolean             // có import sheet này không
}

// Các cột chuẩn hệ thống cần map
interface SystemField {
  key: string
  label: string
  required: boolean
  description: string
  example: string
}

interface ColumnMapping {
  systemFieldKey: string
  sourceColumn: string | null  // null = bỏ qua / chưa map
  transform?: string           // 'as_is' | 'parse_data_amount' | 'price_to_minor' | ...
}

interface ImportRow {
  _rowIndex: number
  [key: string]: unknown
}

interface ValidationResult {
  totalRows: number
  validRows: number
  warningRows: number
  errorRows: number
  rows: {
    index: number
    data: ImportRow
    status: 'valid' | 'warning' | 'error'
    issues: string[]
  }[]
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Tải lên file', icon: 'tabler-file-upload' },
  { label: 'Chọn Sheet & Header', icon: 'tabler-table' },
  { label: 'Ánh xạ cột (Mapping)', icon: 'tabler-arrows-transfer-down' },
  { label: 'Xem trước & Import', icon: 'tabler-database-import' },
]

const SYSTEM_FIELDS: SystemField[] = [
  { key: 'external_id',          label: 'Mã gói NCC (Product Code)', required: true,  description: 'ID/code dùng để gọi API mua. Là định danh unique của gói.', example: 'A-006-ES-AU-C4-3D/60D-500MB' },
  { key: 'name',                  label: 'Tên gói hiển thị',          required: true,  description: 'Tên gói sẽ hiển thị trên marketplace.', example: 'Japan 3 Days 500MB' },
  { key: 'country_name',          label: 'Quốc gia / Vùng',           required: true,  description: 'Tên quốc gia hoặc vùng phủ sóng (sẽ tự normalize sang ISO code).', example: 'Japan' },
  { key: 'region',                label: 'Khu vực',                   required: false, description: 'Châu Á, Châu Âu, Toàn cầu... (tùy chọn, dùng để phân nhóm).', example: 'Asia' },
  { key: 'validity_days',         label: 'Số ngày hiệu lực',          required: true,  description: 'Số ngày sử dụng kể từ khi kích hoạt.', example: '3' },
  { key: 'data_amount_raw',       label: 'Dung lượng Data',           required: true,  description: 'Dung lượng gói dạng text, hệ thống tự parse ra MB.', example: '500M/day, 10GB, Unlimited' },
  { key: 'cost_price_raw',        label: 'Giá vốn (Wholesale Price)', required: false, description: 'Giá nhập. Nếu file không có giá, để trống — sẽ lấy từ API NCC.', example: '8.50' },
  { key: 'currency',              label: 'Đơn vị tiền tệ',            required: false, description: 'USD, JPY, VND... Nếu không có sẽ mặc định theo cấu hình NCC.', example: 'USD' },
  { key: 'operator',              label: 'Nhà mạng (Operator)',        required: false, description: 'Tên nhà mạng cung cấp dịch vụ.', example: 'KDDI/SOFTBANK' },
  { key: 'plan_type',             label: 'Loại gói (Type)',            required: false, description: 'Daypass, Data Package... (tùy chọn).', example: 'Daypass' },
  { key: 'activation_type_raw',   label: 'Loại kích hoạt',            required: false, description: 'Auto Activate / Designated Date. Hệ thống sẽ map sang BY_DEVICE / BY_ORDER.', example: 'Auto Activate' },
  { key: 'apn',                   label: 'APN',                       required: false, description: 'Cấu hình APN nếu có.', example: 'internet' },
  { key: 'notes',                 label: 'Ghi chú',                   required: false, description: 'Remark, FUP, điều kiện bổ sung.', example: 'down to 256kbps after FUP' },
]

const MOCK_SUPPLIERS = [
  { id: 'tuge', name: 'TUGE eSIM', color: '#4CAF50' },
  { id: 'tsim', name: 'TSIM Tech', color: '#2196F3' },
  { id: 'mos',  name: 'MOS (Urocomm)', color: '#FF9800' },
  { id: 'ucl',  name: 'uCloudlink', color: '#9C27B0' },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function cellValueToString(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (v instanceof Date) return v.toISOString().split('T')[0]
  return String(v).trim()
}

/** Trim trailing null/empty cells from a row array */
function trimRow(row: unknown[]): unknown[] {
  let end = row.length
  while (end > 0 && (row[end - 1] === null || String(row[end - 1]).trim() === '')) end--
  return row.slice(0, end)
}

/**
 * Detect which row index (0-based within nonEmpty list) is the real header.
 * Heuristic: the first row that has >= 3 non-empty string cells and
 * at least half its cells are non-empty strings (not numbers/dates).
 */
function guessHeaderRowIndex(nonEmpty: unknown[][]): number {
  for (let i = 0; i < Math.min(nonEmpty.length, 5); i++) {
    const row = nonEmpty[i] as unknown[]
    const strCells = row.filter(v => v !== null && typeof v === 'string' && v.trim() !== '')
    const nonNullCells = row.filter(v => v !== null && String(v).trim() !== '')
    if (strCells.length >= 3 && nonNullCells.length > 0 && strCells.length / nonNullCells.length >= 0.5) {
      return i
    }
  }
  return 0 // fallback
}

function parseSheetInfo(wb: XLSX.WorkBook, sheetName: string): SheetInfo {
  const ws = wb.Sheets[sheetName]

  // Use sheet_to_json with blankrows:false; then trim each row's trailing nulls
  // to avoid XFD (col 16384) pollution from dirty Excel dimension refs
  const raw = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null, blankrows: false })

  // Trim trailing empty cells per row, then filter fully-empty rows
  const trimmed = raw
    .map(r => trimRow(r as unknown[]))
    .filter(r => r.some(v => v !== null && String(v).trim() !== ''))

  const firstDataRows = trimmed.slice(0, 8)

  // colCount = max width of actual data cells (not Excel's dimension)
  const colCount = Math.max(...trimmed.map(r => r.length), 0)

  // Detect real header row
  const headerIdx = guessHeaderRowIndex(trimmed)

  return {
    name: sheetName,
    rowCount: trimmed.length,
    colCount,
    sampleHeaders: trimmed[headerIdx] ? trimmed[headerIdx].map(cellValueToString) : [],
    firstDataRows: firstDataRows as unknown[][],
    detectedHeaderIndex: headerIdx, // 0-based index within firstDataRows
  }
}

function guessAutoMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {}
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  
  const rules: Record<string, string[]> = {
    external_id:        ['apiproductcode', 'productcode', 'packageid', 'code', 'sku'],
    name:               ['productname', 'goodesim', 'package', 'description'],
    country_name:       ['countryorregion', 'country', 'destination'],
    region:             ['region'],
    validity_days:      ['days', 'day', 'validdays', 'duration'],
    data_amount_raw:    ['datavolume', 'data', 'data量', 'package'],
    cost_price_raw:     ['wholesalepriceusd', 'wholesaleprice', 'price', 'cost', '卸価格'],
    currency:           ['currency'],
    operator:           ['operator', 'network', 'carrier'],
    plan_type:          ['type'],
    activation_type_raw:['activatemode', 'activationmode'],
    apn:                ['apn'],
    notes:              ['remark', 'fup', '備考', 'notes'],
  }

  for (const [sysKey, candidates] of Object.entries(rules)) {
    for (const h of headers) {
      const norm = normalize(h)
      if (candidates.some(c => norm.includes(c))) {
        if (!mapping[sysKey]) mapping[sysKey] = h
      }
    }
  }
  return mapping
}

function validateRows(rows: ImportRow[], mapping: Record<string, string>): ValidationResult {
  const required = SYSTEM_FIELDS.filter(f => f.required).map(f => f.key)
  const result: ValidationResult['rows'] = []

  for (const row of rows.slice(0, 200)) { // preview max 200
    const issues: string[] = []
    
    for (const key of required) {
      const srcCol = mapping[key]
      if (!srcCol) { issues.push(`Chưa map cột bắt buộc: ${key}`); continue }
      const val = row[srcCol]
      if (val === null || val === undefined || String(val).trim() === '') {
        issues.push(`Thiếu giá trị: ${srcCol}`)
      }
    }
    
    // Check giá
    const priceCol = mapping['cost_price_raw']
    if (priceCol && row[priceCol] !== null && row[priceCol] !== undefined) {
      const p = parseFloat(String(row[priceCol]))
      if (isNaN(p)) issues.push(`Giá không hợp lệ: "${row[priceCol]}"`)
      else if (p < 0) issues.push('Giá âm')
      else if (p === 0) issues.push('Giá = 0 (sẽ cần điền từ API NCC)')
    }

    // Check days
    const daysCol = mapping['validity_days']
    if (daysCol && row[daysCol] !== null) {
      const d = parseInt(String(row[daysCol]))
      if (isNaN(d) || d <= 0) issues.push(`Số ngày không hợp lệ: "${row[daysCol]}"`)
    }

    const status = issues.length === 0 ? 'valid'
      : issues.some(i => i.startsWith('Thiếu') || i.startsWith('Chưa')) ? 'error'
      : 'warning'
    
    result.push({ index: row._rowIndex, data: row, status, issues })
  }

  return {
    totalRows: result.length,
    validRows: result.filter(r => r.status === 'valid').length,
    warningRows: result.filter(r => r.status === 'warning').length,
    errorRows: result.filter(r => r.status === 'error').length,
    rows: result,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — UPLOAD FILE
// ─────────────────────────────────────────────────────────────────────────────

interface Step1Props {
  onParsed: (wb: XLSX.WorkBook, fileName: string, supplierId: string) => void
}

function Step1Upload({ onParsed }: Step1Props) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!supplierId) { setError('Vui lòng chọn Nhà cung cấp trước khi tải file.'); return }
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) { setError('Chỉ hỗ trợ file .xlsx, .xls, .csv'); return }
    setError('')
    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const wb = XLSX.read(data, { type: 'binary', cellDates: true })
        setIsLoading(false)
        onParsed(wb, file.name, supplierId)
      } catch {
        setIsLoading(false)
        setError('Không thể đọc file. Vui lòng kiểm tra định dạng.')
      }
    }
    reader.readAsBinaryString(file)
  }, [supplierId, onParsed])

  return (
    <Grid2 container spacing={6} justifyContent='center'>
      <Grid2 size={{ xs: 12, md: 8 }}>

        {/* Chọn NCC */}
        <Card className='mbe-6'>
          <CardContent>
            <Typography variant='subtitle1' className='font-black mbe-1'>Bước 1 — Chọn Nhà cung cấp</Typography>
            <Typography variant='body2' color='text.secondary' className='mbe-4'>
              Mỗi NCC có cấu trúc file khác nhau. Chọn đúng NCC để hệ thống gợi ý mapping phù hợp.
            </Typography>
            <Grid2 container spacing={3}>
              {MOCK_SUPPLIERS.map(s => (
                <Grid2 key={s.id} size={{ xs: 6, sm: 3 }}>
                  <Box
                    onClick={() => { setSupplierId(s.id); setError('') }}
                    className='cursor-pointer rounded-xl border-2 p-4 text-center transition-all'
                    sx={{
                      borderColor: supplierId === s.id ? s.color : 'divider',
                      bgcolor: supplierId === s.id ? `${s.color}12` : 'background.paper',
                      '&:hover': { borderColor: s.color, bgcolor: `${s.color}08` }
                    }}
                  >
                    <Avatar sx={{ bgcolor: `${s.color}20`, color: s.color, mx: 'auto', mb: 1 }}>
                      <i className='tabler-building-store' />
                    </Avatar>
                    <Typography variant='caption' className='font-black block'>{s.name}</Typography>
                    {supplierId === s.id && (
                      <Chip label='Đã chọn' size='small' sx={{ mt: 0.5, bgcolor: s.color, color: '#fff' }} />
                    )}
                  </Box>
                </Grid2>
              ))}
            </Grid2>

            <Alert severity='info' className='mbe-0 mbs-4' icon={<i className='tabler-plus text-sm' />}>
              <Typography variant='caption'>
                Không thấy NCC? Thêm mới tại{' '}
                <a href='/3m/upstream/suppliers' className='font-black underline'>Quản lý Nhà cung cấp</a>.
                Hệ thống hỗ trợ bất kỳ file Excel/CSV nào — bạn sẽ tự cấu hình mapping ở bước sau.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Upload zone */}
        <Card>
          <CardContent>
            <Typography variant='subtitle1' className='font-black mbe-1'>Bước 2 — Tải lên file báo giá</Typography>
            <Typography variant='body2' color='text.secondary' className='mbe-4'>
              Hỗ trợ <strong>.xlsx, .xls, .csv</strong>. Nhiều sheet trong cùng một file đều được đọc.
            </Typography>

            <Box
              onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => {
                e.preventDefault(); setIsDragOver(false)
                const f = e.dataTransfer.files[0]
                if (f) handleFile(f)
              }}
              onClick={() => fileRef.current?.click()}
              className='cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all'
              sx={{
                borderColor: isDragOver ? 'primary.main' : 'divider',
                bgcolor: isDragOver ? 'primary.lighter' : 'action.hover',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter' }
              }}
            >
              {isLoading ? (
                <Box>
                  <CircularProgress size={48} className='mbe-3' />
                  <Typography variant='body1' className='font-black'>Đang đọc file...</Typography>
                </Box>
              ) : (
                <Box>
                  <Avatar variant='rounded' className='mx-auto mbe-4 w-16 h-16' sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <i className='tabler-file-spreadsheet text-3xl' />
                  </Avatar>
                  <Typography variant='h6' className='font-black mbe-1'>Kéo thả file vào đây</Typography>
                  <Typography variant='body2' color='text.secondary' className='mbe-3'>hoặc click để chọn file từ máy tính</Typography>
                  <Chip label='.xlsx  .xls  .csv' variant='outlined' size='small' />
                </Box>
              )}
            </Box>

            <input
              ref={fileRef} type='file' hidden accept='.xlsx,.xls,.csv'
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />

            {error && <Alert severity='error' className='mbs-4'>{error}</Alert>}

            <Box className='mbs-4 p-3 rounded-xl bg-slate-50 flex gap-3 flex-wrap'>
              <Box className='flex gap-2 items-center'><i className='tabler-check text-success text-sm'/><Typography variant='caption'>Nhiều sheet trong 1 file</Typography></Box>
              <Box className='flex gap-2 items-center'><i className='tabler-check text-success text-sm'/><Typography variant='caption'>Tự nhận diện header</Typography></Box>
              <Box className='flex gap-2 items-center'><i className='tabler-check text-success text-sm'/><Typography variant='caption'>Gợi ý mapping tự động</Typography></Box>
              <Box className='flex gap-2 items-center'><i className='tabler-check text-success text-sm'/><Typography variant='caption'>Lưu template mapping cho lần sau</Typography></Box>
            </Box>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — CHỌN SHEET & CẤU HÌNH HEADER
// ─────────────────────────────────────────────────────────────────────────────

interface Step2Props {
  sheets: SheetInfo[]
  sheetConfigs: SheetConfig[]
  onConfigChange: (configs: SheetConfig[]) => void
  onNext: () => void
  onBack: () => void
  fileName: string
}

function Step2SheetConfig({ sheets, sheetConfigs, onConfigChange, onNext, onBack, fileName }: Step2Props) {
  const [activeTab, setActiveTab] = useState(0)
  const activeConfig = sheetConfigs[activeTab] ?? sheetConfigs[0]
  const activeSheet = sheets[activeTab] ?? sheets[0]
  const enabledCount = sheetConfigs.filter(c => c.enabled).length

  const updateConfig = (idx: number, patch: Partial<SheetConfig>) => {
    const next = sheetConfigs.map((c, i) => i === idx ? { ...c, ...patch } : c)
    onConfigChange(next)
  }

  // Lấy header row dựa trên config
  const getHeadersForSheet = (sheet: SheetInfo, headerRow: number) => {
    const row = sheet.firstDataRows[headerRow - 1]
    if (!row) return sheet.sampleHeaders
    // Trim trailing empty to avoid showing ghost columns
    return trimRow(row as unknown[]).map(cellValueToString).filter(Boolean)
  }

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={{ xs: 12 }}>
        <Alert severity='info' icon={<i className='tabler-info-circle'/>}>
          File <strong>{fileName}</strong> có <strong>{sheets.length} sheet</strong>.
          Chọn sheet nào muốn import và xác nhận dòng nào là header (dòng chứa tên cột).
        </Alert>
      </Grid2>

      {/* Sheet list sidebar */}
      <Grid2 size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent className='p-0'>
            <Box className='p-4 border-b'>
              <Typography variant='caption' className='font-black uppercase text-slate-400'>
                {sheets.length} Sheet tìm thấy
              </Typography>
            </Box>
            <Stack>
              {sheets.map((sh, idx) => {
                const cfg = sheetConfigs[idx]
                return (
                  <Box
                    key={sh.name}
                    onClick={() => setActiveTab(idx)}
                    className='cursor-pointer flex items-center gap-3 p-3 border-b transition-colors'
                    sx={{ bgcolor: activeTab === idx ? 'primary.lighter' : 'transparent', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <Checkbox
                      checked={cfg?.enabled ?? false}
                      onChange={e => { e.stopPropagation(); updateConfig(idx, { enabled: e.target.checked }) }}
                      size='small'
                      sx={{ p: 0 }}
                    />
                    <Box className='flex-1 min-w-0'>
                      <Typography variant='body2' className='font-black truncate'>{sh.name}</Typography>
                      <Typography variant='caption' color='text.secondary'>{sh.rowCount} dòng · {sh.colCount} cột</Typography>
                    </Box>
                    {activeTab === idx && <i className='tabler-chevron-right text-primary text-sm' />}
                  </Box>
                )
              })}
            </Stack>
            <Box className='p-3'>
              <Typography variant='caption' color='text.secondary'>
                Đã chọn <strong>{enabledCount}</strong>/{sheets.length} sheet
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid2>

      {/* Sheet detail */}
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Card>
          <CardContent>
            <Box className='flex justify-between items-center mbe-4 flex-wrap gap-2'>
              <Box>
                <Typography variant='subtitle1' className='font-black'>{activeSheet?.name}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  {activeSheet?.rowCount} dòng · {activeSheet?.colCount} cột
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activeConfig?.enabled ?? false}
                    onChange={e => updateConfig(activeTab, { enabled: e.target.checked })}
                  />
                }
                label='Import sheet này'
              />
            </Box>

            {activeConfig?.enabled && (
              <Box className='mbe-4'>
                <Typography variant='body2' className='font-black mbe-1'>Dòng header (chứa tên cột):</Typography>
                <Typography variant='caption' color='text.secondary' className='mbe-2 block'>
                  Xem bảng preview bên dưới, chọn số dòng chứa tên cột. Thường là dòng 1 hoặc 2.
                </Typography>
                <Stack direction='row' spacing={1}>
                  {[1, 2, 3].map(n => (
                    <Button
                      key={n} size='small'
                      variant={activeConfig.headerRow === n ? 'contained' : 'outlined'}
                      onClick={() => updateConfig(activeTab, { headerRow: n })}
                    >
                      Dòng {n}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Preview table */}
            <Typography variant='caption' className='font-black uppercase text-slate-400 mbe-2 block'>
              Preview 8 dòng đầu
            </Typography>
            <TableContainer className='rounded-xl border max-h-64 overflow-auto'>
              <Table size='small' stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className='bg-slate-50 font-black text-xs w-10'>#</TableCell>
                    {(activeSheet ? trimRow(activeSheet.firstDataRows[0] ?? []) : []).map((_, ci) => (
                      <TableCell key={ci} className='bg-slate-50 font-black text-xs whitespace-nowrap'>
                        {String.fromCharCode(65 + ci)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeSheet?.firstDataRows.map((row, ri) => {
                    const isHeader = activeConfig?.enabled && activeConfig.headerRow === ri + 1
                    return (
                      <TableRow key={ri} sx={{ bgcolor: isHeader ? 'primary.lighter' : ri % 2 === 0 ? 'transparent' : 'action.hover' }}>
                        <TableCell className='text-xs text-slate-400 font-black'>
                          {isHeader ? <Chip label='H' size='small' color='primary' /> : ri + 1}
                        </TableCell>
                        {row.map((cell, ci) => (
                          <TableCell key={ci} className='text-xs whitespace-nowrap max-w-[160px] truncate'>
                            <Tooltip title={cellValueToString(cell)}>
                              <span>{cellValueToString(cell) || <span className='text-slate-300'>—</span>}</span>
                            </Tooltip>
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {activeConfig?.enabled && (
              <Alert severity='success' className='mbs-3' icon={<i className='tabler-check'/>}>
                Header nhận diện được:{' '}
                <strong>{getHeadersForSheet(activeSheet, activeConfig.headerRow).filter(Boolean).slice(0, 5).join(', ')}
                {getHeadersForSheet(activeSheet, activeConfig.headerRow).filter(Boolean).length > 5 ? '...' : ''}</strong>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid2>

      <Grid2 size={{ xs: 12 }}>
        <Box className='flex justify-between'>
          <Button variant='outlined' onClick={onBack} startIcon={<i className='tabler-arrow-left'/>}>Quay lại</Button>
          <Button
            variant='contained' onClick={onNext}
            disabled={enabledCount === 0}
            endIcon={<i className='tabler-arrow-right'/>}
          >
            Tiếp theo — Cấu hình Mapping ({enabledCount} sheet)
          </Button>
        </Box>
      </Grid2>
    </Grid2>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — COLUMN MAPPING
// ─────────────────────────────────────────────────────────────────────────────

interface Step3Props {
  sheets: SheetInfo[]
  sheetConfigs: SheetConfig[]
  supplierId: string
  mappings: Record<string, Record<string, string>>   // sheetName → { sysKey: srcCol }
  onMappingChange: (sheetName: string, sysKey: string, srcCol: string) => void
  onNext: () => void
  onBack: () => void
}

function Step3Mapping({ sheets, sheetConfigs, mappings, onMappingChange, onNext, onBack }: Step3Props) {
  const [activeSheet, setActiveSheet] = useState(() => sheetConfigs.find(c => c.enabled)?.sheetName ?? '')
  const enabledSheets = sheetConfigs.filter(c => c.enabled)

  const getHeaders = (sheetName: string) => {
    const sheet = sheets.find(s => s.name === sheetName)
    const cfg = sheetConfigs.find(c => c.sheetName === sheetName)
    if (!sheet || !cfg) return []
    const row = sheet.firstDataRows[cfg.headerRow - 1]
    if (!row) return []
    return trimRow(row as unknown[]).map(cellValueToString).filter(Boolean)
  }

  const currentMapping = mappings[activeSheet] ?? {}
  const currentHeaders = getHeaders(activeSheet)
  const currentSheet = sheets.find(s => s.name === activeSheet)
  const currentCfg = sheetConfigs.find(c => c.sheetName === activeSheet)
  const sampleDataRow = currentSheet?.firstDataRows[currentCfg ? currentCfg.headerRow : 1] ?? []

  const getMappedCount = (sheetName: string) => {
    const m = mappings[sheetName] ?? {}
    return SYSTEM_FIELDS.filter(f => f.required && m[f.key]).length
  }
  const getRequiredCount = () => SYSTEM_FIELDS.filter(f => f.required).length

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={{ xs: 12 }}>
        <Alert severity='info' icon={<i className='tabler-wand'/>}>
          Hệ thống đã <strong>tự động gợi ý</strong> mapping dựa trên tên cột. Kiểm tra và điều chỉnh nếu cần.
          Cấu hình này có thể lưu làm template cho NCC này ở các lần import sau.
        </Alert>
      </Grid2>

      {/* Sheet tabs */}
      {enabledSheets.length > 1 && (
        <Grid2 size={{ xs: 12 }}>
          <Tabs value={activeSheet} onChange={(_, v) => setActiveSheet(v)} variant='scrollable'>
            {enabledSheets.map(cfg => {
              const mapped = getMappedCount(cfg.sheetName)
              const total = getRequiredCount()
              const ok = mapped === total
              return (
                <Tab
                  key={cfg.sheetName} value={cfg.sheetName}
                  label={
                    <Box className='flex items-center gap-2'>
                      <i className={`tabler-table-${ok ? 'check text-success' : 'options text-warning'} text-sm`} />
                      <span>{cfg.sheetName}</span>
                      <Chip label={`${mapped}/${total}`} size='small' color={ok ? 'success' : 'warning'} />
                    </Box>
                  }
                />
              )
            })}
          </Tabs>
        </Grid2>
      )}

      <Grid2 size={{ xs: 12, md: 7 }}>
        <Card>
          <CardContent>
            <Typography variant='subtitle1' className='font-black mbe-4'>
              Ánh xạ cột — Sheet: {activeSheet}
            </Typography>

            <Stack spacing={3}>
              {SYSTEM_FIELDS.map(field => {
                const selectedCol = currentMapping[field.key] ?? ''
                const sampleVal = selectedCol
                  ? cellValueToString(sampleDataRow[(currentHeaders.indexOf(selectedCol))])
                  : ''

                return (
                  <Box key={field.key} className='rounded-xl border p-3'>
                    <Box className='flex gap-3 items-start flex-wrap'>
                      <Box className='flex-1 min-w-[180px]'>
                        <Box className='flex items-center gap-1 mbe-0.5'>
                          <Typography variant='body2' className='font-black'>{field.label}</Typography>
                          {field.required
                            ? <Chip label='Bắt buộc' size='small' color='error' variant='tonal' />
                            : <Chip label='Tuỳ chọn' size='small' color='default' variant='tonal' />
                          }
                        </Box>
                        <Typography variant='caption' color='text.secondary'>{field.description}</Typography>
                        <Typography variant='caption' className='text-slate-400 block'>VD: {field.example}</Typography>
                      </Box>

                      <Box className='flex items-center gap-2' sx={{ minWidth: 240 }}>
                        <i className='tabler-arrows-transfer-down text-slate-300 text-lg shrink-0' />
                        <FormControl size='small' fullWidth>
                          <InputLabel>Cột nguồn</InputLabel>
                          <Select
                            value={selectedCol}
                            label='Cột nguồn'
                            onChange={e => onMappingChange(activeSheet, field.key, e.target.value as string)}
                            renderValue={v => v || <em className='text-slate-400'>— Bỏ qua —</em>}
                          >
                            <MenuItem value=''><em>— Bỏ qua cột này —</em></MenuItem>
                            {currentHeaders.map(h => (
                              <MenuItem key={h} value={h}>
                                <Box>
                                  <Typography variant='body2'>{h}</Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>

                    {selectedCol && (
                      <Box className='mbs-2 p-2 rounded-lg bg-slate-50 flex gap-2 items-center'>
                        <i className='tabler-eye text-slate-400 text-sm' />
                        <Typography variant='caption' color='text.secondary'>Mẫu dữ liệu:</Typography>
                        <Typography variant='caption' className='font-black text-primary'>
                          {sampleVal || <em className='text-slate-400'>trống</em>}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Stack>
          </CardContent>
        </Card>
      </Grid2>

      {/* Right panel: summary + save template */}
      <Grid2 size={{ xs: 12, md: 5 }}>
        <Stack spacing={4} className='sticky top-24'>

          {/* Mapping status */}
          <Card>
            <CardContent>
              <Typography variant='subtitle2' className='font-black mbe-3'>Trạng thái Mapping</Typography>
              <Stack spacing={1.5}>
                {SYSTEM_FIELDS.map(field => {
                  const mapped = !!(mappings[activeSheet]?.[field.key])
                  return (
                    <Box key={field.key} className='flex items-center justify-between'>
                      <Box className='flex items-center gap-2'>
                        <i className={`tabler-${mapped ? 'circle-check text-success' : field.required ? 'circle-x text-error' : 'circle-dashed text-slate-300'} text-sm`} />
                        <Typography variant='caption'>{field.label}</Typography>
                      </Box>
                      {mapped
                        ? <Chip label={mappings[activeSheet][field.key]} size='small' color='success' variant='tonal' />
                        : <Chip label={field.required ? 'Chưa map' : 'Bỏ qua'} size='small' color={field.required ? 'error' : 'default'} variant='tonal' />
                      }
                    </Box>
                  )
                })}
              </Stack>
            </CardContent>
          </Card>

          {/* Save template */}
          <Card sx={{ bgcolor: 'primary.lighter', border: '1px solid', borderColor: 'primary.light' }}>
            <CardContent>
              <Box className='flex gap-2 items-center mbe-2'>
                <i className='tabler-bookmark text-primary' />
                <Typography variant='subtitle2' className='font-black text-primary'>Lưu Template Mapping</Typography>
              </Box>
              <Typography variant='caption' color='text.secondary' className='block mbe-3'>
                Lưu cấu hình mapping này cho NCC. Lần sau import file cùng NCC sẽ tự động áp dụng.
              </Typography>
              <TextField
                fullWidth size='small' placeholder='Tên template, VD: TUGE Global v1'
                defaultValue={`Template_${new Date().toISOString().split('T')[0]}`}
              />
              <Button variant='outlined' size='small' className='mbs-2' startIcon={<i className='tabler-bookmark'/>}>
                Lưu Template
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Grid2>

      <Grid2 size={{ xs: 12 }}>
        <Box className='flex justify-between'>
          <Button variant='outlined' onClick={onBack} startIcon={<i className='tabler-arrow-left'/>}>Quay lại</Button>
          <Button variant='contained' onClick={onNext} endIcon={<i className='tabler-arrow-right'/>}>
            Tiếp theo — Xem trước & Validate
          </Button>
        </Box>
      </Grid2>
    </Grid2>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — PREVIEW, VALIDATE & IMPORT
// ─────────────────────────────────────────────────────────────────────────────

interface Step4Props {
  sheets: SheetInfo[]
  sheetConfigs: SheetConfig[]
  mappings: Record<string, Record<string, string>>
  supplierId: string
  onBack: () => void
  onReset: () => void
  onClose?: () => void
}

function Step4Preview({ sheets, sheetConfigs, mappings, supplierId, onBack, onReset, onClose }: Step4Props) {
  const [importing, setImporting] = useState(false)
  const [importDone, setImportDone] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [activeSheet, setActiveSheet] = useState(() => sheetConfigs.find(c => c.enabled)?.sheetName ?? '')
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'warning' | 'error'>('all')

  const enabledSheets = sheetConfigs.filter(c => c.enabled)

  // Build preview rows per sheet
  const buildRows = (sheetName: string): ImportRow[] => {
    const sheet = sheets.find(s => s.name === sheetName)
    const cfg = sheetConfigs.find(c => c.sheetName === sheetName)
    if (!sheet || !cfg) return []
    const hIdx = cfg.headerRow - 1
    // trimRow: strip trailing empty cells to prevent 16k-column ghost headers
    const headers = trimRow(sheet.firstDataRows[hIdx] as unknown[]).map(cellValueToString)
    return sheet.firstDataRows.slice(hIdx + 1).map((rawRow, ri) => {
      const obj: ImportRow = { _rowIndex: hIdx + ri + 2 }
      trimRow(rawRow as unknown[]).forEach((cell, ci) => { obj[headers[ci] ?? `col_${ci}`] = cell })
      return obj
    })
  }

  const currentRows = buildRows(activeSheet)
  const currentMapping = mappings[activeSheet] ?? {}
  const validation = validateRows(currentRows, currentMapping)

  const displayedRows = filterStatus === 'all'
    ? validation.rows
    : validation.rows.filter(r => r.status === filterStatus)

  const totalRows = enabledSheets.reduce((sum, cfg) => sum + buildRows(cfg.sheetName).length, 0)

  const handleImport = () => {
    setImporting(true)
    let prog = 0
    const interval = setInterval(() => {
      prog += Math.random() * 15
      setImportProgress(Math.min(prog, 100))
      if (prog >= 100) {
        clearInterval(interval)
        setImporting(false)
        setImportDone(true)
      }
    }, 200)
  }

  if (importDone) {
    return (
      <Box className='text-center py-16'>
        <Avatar variant='rounded' className='mx-auto mbe-6 w-24 h-24' sx={{ bgcolor: 'success.lighter', color: 'success.main' }}>
          <i className='tabler-circle-check text-5xl' />
        </Avatar>
        <Typography variant='h4' className='font-black mbe-2'>Import thành công!</Typography>
        <Typography variant='body1' color='text.secondary' className='mbe-6'>
          Đã import <strong>{totalRows} gói eSIM</strong> từ {enabledSheets.length} sheet của NCC <strong>
            {MOCK_SUPPLIERS.find(s => s.id === supplierId)?.name}
          </strong> vào hệ thống.
        </Typography>
        <Stack direction='row' spacing={3} justifyContent='center'>
          <Button
            variant='contained'
            startIcon={<i className='tabler-packages'/>}
            onClick={() => { onClose?.() }}
          >
            Xem Supplier Products
          </Button>
          <Button
            variant='outlined'
            startIcon={<i className='tabler-file-upload'/>}
            onClick={onReset}
          >
            Import file khác
          </Button>
        </Stack>

        <Card className='mbs-8 text-left max-w-lg mx-auto'>
          <CardContent>
            <Typography variant='subtitle2' className='font-black mbe-3'>Bước tiếp theo</Typography>
            <Stack spacing={2}>
              {[
                { icon: 'tabler-arrows-transfer-down', label: 'Chuẩn hóa & Normalize', desc: 'Map quốc gia, đơn vị data sang chuẩn marketplace', href: `/3m/upstream/suppliers/${supplierId}/mapping` },
                { icon: 'tabler-tag', label: 'Thiết lập giá bán', desc: 'Áp dụng pricing rule và niêm yết lên marketplace', href: '/3m/marketplace/products' },
                { icon: 'tabler-clock', label: 'Lên lịch đồng bộ định kỳ', desc: 'Tự động sync giá từ API NCC mỗi ngày', href: `/3m/upstream/suppliers/${supplierId}/sync` },
              ].map(item => (
                <Box key={item.label} className='flex gap-3 items-start p-3 rounded-xl border hover:border-primary cursor-pointer' component='a' href={item.href}>
                  <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', width: 32, height: 32 }}>
                    <i className={`${item.icon} text-sm`} />
                  </Avatar>
                  <Box>
                    <Typography variant='body2' className='font-black'>{item.label}</Typography>
                    <Typography variant='caption' color='text.secondary'>{item.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Grid2 container spacing={4}>
      {/* Summary cards */}
      <Grid2 size={{ xs: 12 }}>
        <Grid2 container spacing={3}>
          {[
            { label: 'Tổng dòng dữ liệu', value: totalRows, icon: 'tabler-database', color: 'primary' },
            { label: 'Hợp lệ', value: validation.validRows, icon: 'tabler-circle-check', color: 'success' },
            { label: 'Cảnh báo', value: validation.warningRows, icon: 'tabler-alert-triangle', color: 'warning' },
            { label: 'Lỗi', value: validation.errorRows, icon: 'tabler-circle-x', color: 'error' },
          ].map(card => (
            <Grid2 key={card.label} size={{ xs: 6, sm: 3 }}>
              <Card>
                <CardContent className='flex items-center gap-3 p-4'>
                  <Avatar sx={{ bgcolor: `${card.color}.lighter`, color: `${card.color}.main` }}>
                    <i className={`${card.icon}`} />
                  </Avatar>
                  <Box>
                    <Typography variant='h5' className='font-black'>{card.value}</Typography>
                    <Typography variant='caption' color='text.secondary'>{card.label}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Grid2>

      {/* Sheet tabs */}
      {enabledSheets.length > 1 && (
        <Grid2 size={{ xs: 12 }}>
          <Tabs value={activeSheet} onChange={(_, v) => setActiveSheet(v)} variant='scrollable'>
            {enabledSheets.map(cfg => (
              <Tab key={cfg.sheetName} value={cfg.sheetName} label={cfg.sheetName} />
            ))}
          </Tabs>
        </Grid2>
      )}

      {/* Preview table */}
      <Grid2 size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Box className='flex justify-between items-center mbe-4 flex-wrap gap-3'>
              <Typography variant='subtitle1' className='font-black'>
                Preview — {activeSheet} ({currentRows.length} dòng)
              </Typography>
              <Stack direction='row' spacing={1}>
                {(['all', 'valid', 'warning', 'error'] as const).map(s => (
                  <Button
                    key={s} size='small'
                    variant={filterStatus === s ? 'contained' : 'outlined'}
                    color={s === 'valid' ? 'success' : s === 'warning' ? 'warning' : s === 'error' ? 'error' : 'primary'}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === 'all' ? 'Tất cả' : s === 'valid' ? '✓ Hợp lệ' : s === 'warning' ? '⚠ Cảnh báo' : '✗ Lỗi'}
                  </Button>
                ))}
              </Stack>
            </Box>

            <TableContainer className='rounded-xl border max-h-96 overflow-auto'>
              <Table size='small' stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className='bg-slate-50 font-black text-xs w-8'>Dòng</TableCell>
                    <TableCell className='bg-slate-50 font-black text-xs w-20'>Trạng thái</TableCell>
                    {SYSTEM_FIELDS.filter(f => currentMapping[f.key]).map(field => (
                      <TableCell key={field.key} className='bg-slate-50 font-black text-xs whitespace-nowrap'>
                        {field.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRows.slice(0, 100).map(r => (
                    <TableRow key={r.index} hover sx={{
                      bgcolor: r.status === 'error' ? 'error.lighter' : r.status === 'warning' ? 'warning.lighter' : 'inherit'
                    }}>
                      <TableCell className='text-xs text-slate-400'>{r.index}</TableCell>
                      <TableCell>
                        {r.status === 'valid'
                          ? <Chip label='OK' size='small' color='success' />
                          : r.status === 'warning'
                            ? <Tooltip title={r.issues.join(', ')}><Chip label='⚠' size='small' color='warning' /></Tooltip>
                            : <Tooltip title={r.issues.join(', ')}><Chip label='Lỗi' size='small' color='error' /></Tooltip>
                        }
                      </TableCell>
                      {SYSTEM_FIELDS.filter(f => currentMapping[f.key]).map(field => {
                        const val = cellValueToString(r.data[currentMapping[field.key]])
                        return (
                          <TableCell key={field.key} className='text-xs max-w-[160px]'>
                            <Tooltip title={val}>
                              <span className='truncate block'>{val || <span className='text-slate-300'>—</span>}</span>
                            </Tooltip>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {displayedRows.length > 100 && (
              <Typography variant='caption' color='text.secondary' className='mbs-2 block text-center'>
                Hiển thị 100/{displayedRows.length} dòng
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid2>

      {/* Import action */}
      <Grid2 size={{ xs: 12 }}>
        <Card sx={{ bgcolor: validation.errorRows > 0 ? 'warning.lighter' : 'success.lighter', border: '1px solid', borderColor: validation.errorRows > 0 ? 'warning.light' : 'success.light' }}>
          <CardContent>
            {validation.errorRows > 0 && (
              <Alert severity='warning' className='mbe-4'>
                <AlertTitle>Có {validation.errorRows} dòng lỗi</AlertTitle>
                Bạn vẫn có thể import — các dòng lỗi sẽ được bỏ qua và ghi vào error log để xử lý sau.
                Hoặc quay lại điều chỉnh mapping để giảm số lỗi.
              </Alert>
            )}

            {importing && (
              <Box className='mbe-4'>
                <Box className='flex justify-between mbe-1'>
                  <Typography variant='caption' className='font-black'>Đang import...</Typography>
                  <Typography variant='caption'>{Math.round(importProgress)}%</Typography>
                </Box>
                <LinearProgress variant='determinate' value={importProgress} />
              </Box>
            )}

            <Box className='flex justify-between items-center flex-wrap gap-3'>
              <Box>
                <Typography variant='subtitle2' className='font-black'>
                  Sẵn sàng import {validation.validRows + validation.warningRows} gói eSIM
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {validation.validRows} hợp lệ · {validation.warningRows} có cảnh báo · {validation.errorRows} sẽ bị bỏ qua
                </Typography>
              </Box>
              <Stack direction='row' spacing={2}>
                <Button variant='outlined' onClick={onBack} startIcon={<i className='tabler-arrow-left'/>} disabled={importing}>
                  Quay lại
                </Button>
                <Button
                  variant='contained' color='success' size='large'
                  onClick={handleImport} disabled={importing}
                  startIcon={importing ? <CircularProgress size={16} color='inherit' /> : <i className='tabler-database-import'/>}
                >
                  {importing ? 'Đang import...' : `Import ${validation.validRows + validation.warningRows} gói`}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN WIZARD
// ─────────────────────────────────────────────────────────────────────────────

export default function PriceImportWizard({ onClose }: { onClose?: () => void } = {}) {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Step 1 state
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [fileName, setFileName] = useState('')
  const [supplierId, setSupplierId] = useState('')

  // Step 2 state
  const [sheets, setSheets] = useState<SheetInfo[]>([])
  const [sheetConfigs, setSheetConfigs] = useState<SheetConfig[]>([])

  // Step 3 state — mappings per sheet
  const [mappings, setMappings] = useState<Record<string, Record<string, string>>>({})

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFileParsed = useCallback((wb: XLSX.WorkBook, name: string, sid: string) => {
    setWorkbook(wb)
    setFileName(name)
    setSupplierId(sid)

    const parsed: SheetInfo[] = wb.SheetNames.map(sn => parseSheetInfo(wb, sn))
    setSheets(parsed)

    const configs: SheetConfig[] = parsed.map(sh => ({
      sheetName: sh.name,
      // Use auto-detected header row (1-based for UI), fallback to 1
      headerRow: sh.detectedHeaderIndex + 1,
      enabled: !sh.name.toLowerCase().includes('apn') &&
               !sh.name.toLowerCase().includes('detail') &&
               !sh.name.includes('キャリア'),
    }))
    setSheetConfigs(configs)

    // Auto-guess mappings for each enabled sheet
    const autoMappings: Record<string, Record<string, string>> = {}
    parsed.forEach((sh, idx) => {
      const cfg = configs[idx]
      if (!cfg.enabled) return
      const row = sh.firstDataRows[cfg.headerRow - 1]
      const headers = row ? (row as unknown[]).map(cellValueToString).filter(Boolean) : []
      autoMappings[sh.name] = guessAutoMapping(headers)
    })
    setMappings(autoMappings)
    setStep(1)
  }, [])

  const handleMappingChange = useCallback((sheetName: string, sysKey: string, srcCol: string) => {
    setMappings(prev => ({
      ...prev,
      [sheetName]: { ...(prev[sheetName] ?? {}), [sysKey]: srcCol }
    }))
  }, [])

  const stepContent = [
    <Step1Upload key={0} onParsed={handleFileParsed} />,
    <Step2SheetConfig
      key={1}
      sheets={sheets}
      sheetConfigs={sheetConfigs}
      onConfigChange={setSheetConfigs}
      onNext={() => setStep(2)}
      onBack={() => setStep(0)}
      fileName={fileName}
    />,
    <Step3Mapping
      key={2}
      sheets={sheets}
      sheetConfigs={sheetConfigs}
      supplierId={supplierId}
      mappings={mappings}
      onMappingChange={handleMappingChange}
      onNext={() => setStep(3)}
      onBack={() => setStep(1)}
    />,
    <Step4Preview
      key={3}
      sheets={sheets}
      sheetConfigs={sheetConfigs}
      mappings={mappings}
      supplierId={supplierId}
      onBack={() => setStep(2)}
      onReset={() => { setStep(0); setSupplierId(''); setWorkbook(null); setFileName(''); setSheets([]); setSheetConfigs([]); setMappings({}) }}
      onClose={onClose}
    />,
  ]

  return (
    <>
      <PageHeader
        title='Import Báo giá Nhà cung cấp'
        description='Upload file Excel/CSV từ bất kỳ NCC nào — tự cấu hình sheet, header và mapping cột'
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Nguồn cung', href: '/3m/upstream/suppliers' },
          { label: 'Import Báo giá' },
        ]}
        actions={
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<i className='tabler-arrow-left' />}
            onClick={() => router.back()}
          >
            Quay lại
          </Button>
        }
        className='mbe-6'
      />

      {/* Stepper */}
      <Card className='mbe-6'>
        <CardContent>
          <Stepper activeStep={step} alternativeLabel>
            {STEPS.map((s, idx) => (
              <Step key={s.label} completed={idx < step}>
                <StepLabel
                  icon={
                    <Avatar
                      sx={{
                        width: 36, height: 36,
                        bgcolor: idx < step ? 'success.main' : idx === step ? 'primary.main' : 'action.selected',
                        color: idx <= step ? '#fff' : 'text.secondary',
                      }}
                    >
                      {idx < step ? <i className='tabler-check text-sm' /> : <i className={`${s.icon} text-sm`} />}
                    </Avatar>
                  }
                >
                  <Typography variant='caption' className='font-black'>{s.label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Step content */}
      {stepContent[step]}
    </>
  )
}
