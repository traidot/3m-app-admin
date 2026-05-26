'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import TablePagination from '@mui/material/TablePagination'
import Link from 'next/link'
import * as XLSX from 'xlsx'

import { type PricingBatch } from './PricingHistoryDrawer'

const criterionLabels: Record<'price' | 'quality' | 'bestseller', string> = {
  price: 'Tối ưu Giá vốn tốt nhất (Price)',
  quality: 'Chất lượng hàng đầu (Quality)',
  bestseller: 'Sản lượng bán chạy (Best Seller)'
}

const AgentPricingHistoryView = () => {
  const router = useRouter()

  const [batches, setBatches] = useState<PricingBatch[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Pagination State
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Expand State
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedBatch(prev => (prev === id ? null : id))
  }

  // Load batches from localStorage
  useEffect(() => {
    const storedBatches = localStorage.getItem('3m_pricing_batches')
    if (storedBatches) {
      try {
        setBatches(JSON.parse(storedBatches))
      } catch (e) {
        console.error(e)
      }
    } else {
      const seeded: PricingBatch[] = [
        {
          id: 'BATCH-004',
          appliedAt: '2026-05-26 11:42',
          type: 'rule',
          version: 'v1.2',
          priorityOrder: ['price', 'quality', 'bestseller'],
          globalMarkup: 15,
          regionalOverrides: ['Châu Á (+20%)', 'Châu Âu (+18%)'],
          countryOverrides: [],
          packagesCount: 7,
          status: 'success',
          appliedBy: 'Đại lý David',
          packagesSnapshot: [
            { id: 'PKG-001', name: 'eSIM đi Nhật Bản', region: 'Asia', country: 'Nhật Bản', supplier: 'eSIM Access', costVND: 107100, costUSD: 4.2, markupPct: 20, sellPriceVND: 129000 },
            { id: 'PKG-002', name: 'eSIM đi Hàn Quốc', region: 'Asia', country: 'Hàn Quốc', supplier: 'GoMoWorld', costVND: 183600, costUSD: 7.2, markupPct: 20, sellPriceVND: 220000 },
            { id: 'PKG-003', name: 'eSIM Châu Âu 30 nước', region: 'Europe', country: 'Châu Âu (30 nước)', supplier: 'Airalo Wholesale', costVND: 303450, costUSD: 11.9, markupPct: 18, sellPriceVND: 358000 },
            { id: 'PKG-004', name: 'SIM vật lý đi Mỹ', region: 'America', country: 'Hoa Kỳ', supplier: 'eSIM Access', costVND: 471750, costUSD: 18.5, markupPct: 15, sellPriceVND: 543000 },
            { id: 'PKG-005', name: 'eSIM Đông Nam Á 8 nước', region: 'Asia', country: 'Đông Nam Á', supplier: 'GoMoWorld', costVND: 89250, costUSD: 3.5, markupPct: 20, sellPriceVND: 107000 },
            { id: 'PKG-006', name: 'eSIM Toàn cầu 100 nước', region: 'Global', country: 'Toàn cầu', supplier: 'Airalo Wholesale', costVND: 892500, costUSD: 35.0, markupPct: 15, sellPriceVND: 1026000 },
            { id: 'PKG-007', name: 'SIM vật lý đi Thái Lan', region: 'Asia', country: 'Thái Lan', supplier: 'GoMoWorld', costVND: 158100, costUSD: 6.2, markupPct: 20, sellPriceVND: 199000 }
          ]
        },
        {
          id: 'BATCH-003',
          appliedAt: '2026-05-20 09:30',
          type: 'rule',
          version: 'v1.1',
          priorityOrder: ['quality', 'price', 'bestseller'],
          globalMarkup: 12,
          regionalOverrides: ['Châu Á (+15%)'],
          countryOverrides: ['Nhật Bản (+25%)'],
          packagesCount: 5,
          status: 'success',
          appliedBy: 'Đại lý David',
          packagesSnapshot: [
            { id: 'PKG-001', name: 'eSIM đi Nhật Bản', region: 'Asia', country: 'Nhật Bản', supplier: 'Airalo Wholesale', costVND: 126225, costUSD: 4.95, markupPct: 25, sellPriceVND: 158000 },
            { id: 'PKG-002', name: 'eSIM đi Hàn Quốc', region: 'Asia', country: 'Hàn Quốc', supplier: 'eSIM Access', costVND: 198900, costUSD: 7.8, markupPct: 15, sellPriceVND: 229000 },
            { id: 'PKG-003', name: 'eSIM Châu Âu 30 nước', region: 'Europe', country: 'Châu Âu (30 nước)', supplier: 'eSIM Access', costVND: 316200, costUSD: 12.4, markupPct: 12, sellPriceVND: 354000 },
            { id: 'PKG-005', name: 'eSIM Đông Nam Á 8 nước', region: 'Asia', country: 'Đông Nam Á', supplier: 'Airalo Wholesale', costVND: 99450, costUSD: 3.9, markupPct: 15, sellPriceVND: 114000 },
            { id: 'PKG-006', name: 'eSIM Toàn cầu 100 nước', region: 'Global', country: 'Toàn cầu', supplier: 'Airalo Wholesale', costVND: 892500, costUSD: 35.0, markupPct: 12, sellPriceVND: 1000000 }
          ]
        },
        {
          id: 'BATCH-002',
          appliedAt: '2026-05-10 14:15',
          type: 'rule',
          version: 'v1.0',
          priorityOrder: ['price', 'quality', 'bestseller'],
          globalMarkup: 10,
          regionalOverrides: [],
          countryOverrides: [],
          packagesCount: 7,
          status: 'success',
          appliedBy: 'Hệ thống Auto',
          packagesSnapshot: [
            { id: 'PKG-001', name: 'eSIM đi Nhật Bản', region: 'Asia', country: 'Nhật Bản', supplier: 'eSIM Access', costVND: 107100, costUSD: 4.2, markupPct: 10, sellPriceVND: 118000 },
            { id: 'PKG-002', name: 'eSIM đi Hàn Quốc', region: 'Asia', country: 'Hàn Quốc', supplier: 'GoMoWorld', costVND: 183600, costUSD: 7.2, markupPct: 10, sellPriceVND: 202000 },
            { id: 'PKG-003', name: 'eSIM Châu Âu 30 nước', region: 'Europe', country: 'Châu Âu (30 nước)', supplier: 'Airalo Wholesale', costVND: 303450, costUSD: 11.9, markupPct: 10, sellPriceVND: 334000 },
            { id: 'PKG-004', name: 'SIM vật lý đi Mỹ', region: 'America', country: 'Hoa Kỳ', supplier: 'eSIM Access', costVND: 471750, costUSD: 18.5, markupPct: 10, sellPriceVND: 519000 },
            { id: 'PKG-005', name: 'eSIM Đông Nam Á 8 nước', region: 'Asia', country: 'Đông Nam Á', supplier: 'GoMoWorld', costVND: 89250, costUSD: 3.5, markupPct: 10, sellPriceVND: 98000 },
            { id: 'PKG-006', name: 'eSIM Toàn cầu 100 nước', region: 'Global', country: 'Toàn cầu', supplier: 'Airalo Wholesale', costVND: 892500, costUSD: 35.0, markupPct: 10, sellPriceVND: 982000 },
            { id: 'PKG-007', name: 'SIM vật lý đi Thái Lan', region: 'Asia', country: 'Thái Lan', supplier: 'GoMoWorld', costVND: 158100, costUSD: 6.2, markupPct: 10, sellPriceVND: 174000 }
          ]
        },
        {
          id: 'BATCH-001',
          appliedAt: '2026-05-01 08:00',
          type: 'rule',
          version: 'v0.9',
          priorityOrder: ['price', 'quality', 'bestseller'],
          globalMarkup: 15,
          regionalOverrides: [],
          countryOverrides: [],
          packagesCount: 7,
          status: 'failed',
          appliedBy: 'Đại lý David'
        }
      ]
      setBatches(seeded)
      localStorage.setItem('3m_pricing_batches', JSON.stringify(seeded))
    }
  }, [])

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      const matchSearch =
        batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.appliedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (batch.excelFileName && batch.excelFileName.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchType = typeFilter === 'all' || batch.type === typeFilter
      const matchStatus = statusFilter === 'all' || batch.status === statusFilter

      return matchSearch && matchType && matchStatus
    })
  }, [batches, searchQuery, typeFilter, statusFilter])

  // Paginated Batches
  const paginatedBatches = useMemo(() => {
    return filteredBatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [filteredBatches, page, rowsPerPage])

  // Reset pagination on filter search changes
  useEffect(() => {
    setPage(0)
  }, [searchQuery, typeFilter, statusFilter])

  const handleDownloadBatchExcel = (batch: PricingBatch) => {
    try {
      const snapshot = (batch.packagesSnapshot && batch.packagesSnapshot.length > 0)
        ? batch.packagesSnapshot
        : [
            { id: 'PKG-001', name: 'eSIM đi Nhật Bản', region: 'Asia', country: 'Nhật Bản', supplier: 'eSIM Access', costVND: 107100, costUSD: 4.2, markupPct: 20, sellPriceVND: 129000 },
            { id: 'PKG-002', name: 'eSIM đi Hàn Quốc', region: 'Asia', country: 'Hàn Quốc', supplier: 'GoMoWorld', costVND: 183600, costUSD: 7.2, markupPct: 20, sellPriceVND: 220000 },
            { id: 'PKG-003', name: 'eSIM Châu Âu 30 nước', region: 'Europe', country: 'Châu Âu (30 nước)', supplier: 'Airalo Wholesale', costVND: 303450, costUSD: 11.9, markupPct: 18, sellPriceVND: 358000 },
            { id: 'PKG-004', name: 'SIM vật lý đi Mỹ', region: 'America', country: 'Hoa Kỳ', supplier: 'eSIM Access', costVND: 471750, costUSD: 18.5, markupPct: 15, sellPriceVND: 543000 },
            { id: 'PKG-005', name: 'eSIM Đông Nam Á 8 nước', region: 'Asia', country: 'Đông Nam Á', supplier: 'GoMoWorld', costVND: 89250, costUSD: 3.5, markupPct: 20, sellPriceVND: 107000 },
            { id: 'PKG-006', name: 'eSIM Toàn cầu 100 nước', region: 'Global', country: 'Toàn cầu', supplier: 'Airalo Wholesale', costVND: 892500, costUSD: 35.0, markupPct: 15, sellPriceVND: 1026000 },
            { id: 'PKG-007', name: 'SIM vật lý đi Thái Lan', region: 'Asia', country: 'Thái Lan', supplier: 'GoMoWorld', costVND: 158100, costUSD: 6.2, markupPct: 20, sellPriceVND: 199000 }
          ]

      const dataToExport = snapshot.map(item => ({
        'Mã gói cước': item.id,
        'Tên gói cước': item.name,
        'Vùng': item.region,
        'Quốc gia': item.country,
        'Nhà cung cấp sỉ': item.supplier,
        'Giá vốn sỉ (VND)': item.costVND,
        'Tỉ lệ Markup (%)': item.markupPct,
        'Giá bán lẻ (VND)': item.sellPriceVND
      }))

      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, `Bieu_Gia_${batch.version}`)

      worksheet['!cols'] = [
        { wch: 15 }, // Mã gói
        { wch: 25 }, // Tên gói
        { wch: 12 }, // Vùng
        { wch: 15 }, // Quốc gia
        { wch: 20 }, // Nhà cung cấp
        { wch: 18 }, // Giá vốn sỉ
        { wch: 18 }, // Tỉ lệ Markup
        { wch: 22 }  // Giá bán lẻ
      ]

      XLSX.writeFile(workbook, `Bieu_Gia_Smart_Pricing_${batch.version}_${batch.id}.xlsx`)
    } catch (error) {
      console.error('Download batch excel failed:', error)
    }
  }

  // Pagination change page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Pagination change rows per page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box sx={{ p: 6 }}>
      {/* BREADCRUMBS & HEADER */}
      <Box className='mbe-6'>
        <Breadcrumbs separator={<i className='tabler-chevron-right text-[14px]' />} className='mbe-2'>
          <Link href='/agent/packages' passHref>
            <Typography variant='body2' color='text.secondary' sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              Quản lý gói cước
            </Typography>
          </Link>
          <Typography variant='body2' color='text.primary'>
            Lịch sử định giá
          </Typography>
        </Breadcrumbs>

        <Box className='flex items-center justify-between flex-wrap gap-4'>
          <Box className='flex items-center gap-3.5'>
            <IconButton onClick={() => router.push('/agent/packages')} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <i className='tabler-arrow-left text-[20px]' />
            </IconButton>
            <Box>
              <Typography variant='h4' className='font-bold mbe-1'>
                Lịch sử định giá & Đợt chạy
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Nhật ký quản lý và lưu trữ tất cả các phiên bản định giá đã áp dụng trong hệ thống.
              </Typography>
            </Box>
          </Box>

          <Button
            variant='contained'
            color='primary'
            startIcon={<i className='tabler-plus text-[18px]' />}
            onClick={() => router.push('/agent/packages/smart')}
          >
            Thiết lập Định giá mới
          </Button>
        </Box>
      </Box>

      {/* FILTER TOOLBAR */}
      <Paper variant='outlined' sx={{ p: 4, mb: 6, borderRadius: 1.5, backgroundColor: 'background.paper' }}>
        <Grid2 container spacing={4} alignItems='center'>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              placeholder='Tìm theo mã đợt chạy, version, người vận hành...'
              size='small'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-search text-[18px]' />
                  </InputAdornment>
                )
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              size='small'
              label='Kiểu định giá'
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value='all'>Tất cả kiểu chạy</MenuItem>
              <MenuItem value='rule'>Theo Quy tắc (Tự động)</MenuItem>
              <MenuItem value='excel'>Nhập từ Excel (Thủ công)</MenuItem>
            </TextField>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              size='small'
              label='Trạng thái'
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value='all'>Tất cả trạng thái</MenuItem>
              <MenuItem value='success'>Thành công</MenuItem>
              <MenuItem value='failed'>Thất bại</MenuItem>
            </TextField>
          </Grid2>
        </Grid2>
      </Paper>

      {/* TIMELINE CARDS LIST */}
      <Stack spacing={5} className='mbe-6'>
        {paginatedBatches.map((batch) => {
          const isExpanded = expandedBatch === batch.id
          const isSuccess = batch.status === 'success'
          const isExcel = batch.type === 'excel'

          return (
            <Card
              key={batch.id}
              variant='outlined'
              sx={{
                borderLeft: '6px solid',
                borderLeftColor: isSuccess ? 'success.main' : 'error.main',
                borderColor: isExpanded ? 'primary.main' : 'divider',
                boxShadow: isExpanded ? '0 4px 20px rgba(var(--mui-palette-primary-mainChannel) / 0.12)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: 'background.paper',
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                  borderColor: isExpanded ? 'primary.main' : 'rgba(var(--mui-palette-primary-mainChannel) / 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                <Grid2 container spacing={4} alignItems='center'>
                  {/* Part 1: Version & Status Header */}
                  <Grid2 size={{ xs: 12, md: 4 }}>
                    <Stack direction='row' alignItems='center' spacing={2} className='mbe-2' flexWrap='wrap' gap={1}>
                      <Typography variant='h6' sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'text.primary' }}>
                        {batch.id}
                      </Typography>
                      <Chip
                        size='small'
                        color='info'
                        variant='filled'
                        label={batch.version}
                        sx={{ fontWeight: 700, fontSize: '0.85rem', px: 1 }}
                      />
                      <Chip
                        size='small'
                        variant='tonal'
                        color={isExcel ? 'warning' : 'primary'}
                        label={isExcel ? 'Excel' : 'Quy tắc'}
                        icon={<i className={isExcel ? 'tabler-file-spreadsheet text-[14px]' : 'tabler-settings text-[14px]'} />}
                      />
                      <Chip
                        size='small'
                        variant='tonal'
                        color={isSuccess ? 'success' : 'error'}
                        label={isSuccess ? 'Thành công' : 'Thất bại'}
                        icon={<i className={isSuccess ? 'tabler-circle-check text-[14px]' : 'tabler-circle-x text-[14px]'} />}
                      />
                    </Stack>
                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
                      Thời gian áp dụng: <strong>{batch.appliedAt}</strong>
                    </Typography>
                  </Grid2>

                  {/* Part 2: Metrics columns */}
                  <Grid2 size={{ xs: 12, sm: 8, md: 5 }}>
                    <Box className='grid grid-cols-3 gap-2 bg-action-hover p-3 rounded-lg border border-divider' sx={{ backgroundColor: 'action.hover' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant='caption' color='text.secondary' className='block'>Kiểu chạy</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mt: 0.5 }}>
                          {isExcel ? 'Chỉnh tay' : 'Tự động'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider' }}>
                        <Typography variant='caption' color='text.secondary' className='block'>Cập nhật</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mt: 0.5 }}>
                          {batch.packagesCount} gói
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant='caption' color='text.secondary' className='block'>Vận hành</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mt: 0.5, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {batch.appliedBy}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>

                  {/* Part 3: Core Action download column */}
                  <Grid2 size={{ xs: 12, sm: 4, md: 3 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center', gap: 2.5 }}>
                    {isSuccess && (
                      <Button
                        variant='contained'
                        color='success'
                        size='medium'
                        startIcon={<i className='tabler-download text-[18px]' />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadBatchExcel(batch)
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: 1.5,
                          py: 1.8,
                          px: 3,
                          fontSize: '0.85rem',
                          boxShadow: 'none',
                          backgroundColor: 'rgba(var(--mui-palette-success-mainChannel) / 0.12)',
                          color: 'success.main',
                          border: '1px solid transparent',
                          borderColor: 'rgba(var(--mui-palette-success-mainChannel) / 0.2)',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'success.main',
                            color: 'common.white',
                            borderColor: 'success.main',
                            boxShadow: '0 4px 12px rgba(var(--mui-palette-success-mainChannel) / 0.35)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        Tải bảng giá (.xlsx)
                      </Button>
                    )}
                    <IconButton size='small' onClick={() => toggleExpand(batch.id)} color='primary' sx={{ border: '1px solid', borderColor: 'divider' }}>
                      <i className={isExpanded ? 'tabler-chevron-up text-[18px]' : 'tabler-chevron-down text-[18px]'} />
                    </IconButton>
                  </Grid2>
                </Grid2>

                {/* Expanded Details section */}
                {isExpanded && (
                  <Box className='mbs-4'>
                    <Divider className='mbe-4' sx={{ my: 4 }} />
                    
                    <Stack spacing={4}>
                      {isExcel ? (
                        <Box>
                          <Typography variant='caption' color='text.secondary' className='block mbe-1'>
                            Tên file Excel đã nhập
                          </Typography>
                          <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <i className='tabler-file-spreadsheet text-[20px]' />
                            {batch.excelFileName || 'smart_pricing_sheet.xlsx'}
                          </Typography>
                        </Box>
                      ) : (
                        <Grid2 container spacing={4}>
                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography variant='caption' color='text.secondary' className='block mbe-2'>
                              Thứ tự ưu tiên nguồn cung
                            </Typography>
                            <Stack direction='row' spacing={2} flexWrap='wrap' gap={1}>
                              {(batch.priorityOrder || [batch.criterion || 'price']).map((crit, idx) => (
                                <Chip
                                  key={crit}
                                  size='small'
                                  label={`${idx + 1}. ${criterionLabels[crit as 'price' | 'quality' | 'bestseller'] || crit}`}
                                  color='primary'
                                  variant={idx === 0 ? 'filled' : 'outlined'}
                                  sx={{ fontWeight: 600 }}
                                />
                              ))}
                            </Stack>
                          </Grid2>

                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography variant='caption' color='text.secondary' className='block mbe-1'>
                              Tỉ lệ Markup toàn sàn áp dụng
                            </Typography>
                            <Typography variant='body2' sx={{ fontWeight: 700, color: 'text.primary' }}>
                              +{batch.globalMarkup}%
                            </Typography>
                          </Grid2>

                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography variant='caption' color='text.secondary' className='block mbe-2'>
                              Quy tắc vùng ghi đè ({(batch.regionalOverrides || []).length})
                            </Typography>
                            {(batch.regionalOverrides || []).length > 0 ? (
                              <Stack direction='row' spacing={1.5} flexWrap='wrap' gap={1}>
                                {(batch.regionalOverrides || []).map((reg) => (
                                  <Chip key={reg} size='small' label={reg} variant='tonal' color='info' />
                                ))}
                              </Stack>
                            ) : (
                              <Typography variant='body2' color='text.disabled' fontStyle='italic'>
                                Không ghi đè vùng
                              </Typography>
                            )}
                          </Grid2>

                          <Grid2 size={{ xs: 12, md: 6 }}>
                            <Typography variant='caption' color='text.secondary' className='block mbe-2'>
                              Quy tắc quốc gia ghi đè ({(batch.countryOverrides || []).length})
                            </Typography>
                            {(batch.countryOverrides || []).length > 0 ? (
                              <Stack direction='row' spacing={1.5} flexWrap='wrap' gap={1}>
                                {(batch.countryOverrides || []).map((c) => (
                                  <Chip key={c} size='small' label={c} variant='tonal' color='warning' />
                                ))}
                              </Stack>
                            ) : (
                              <Typography variant='body2' color='text.disabled' fontStyle='italic'>
                                Không ghi đè quốc gia
                              </Typography>
                            )}
                          </Grid2>
                        </Grid2>
                      )}

                      {!isSuccess && (
                        <Alert severity='error' variant='outlined' icon={<i className='tabler-alert-triangle' />} className='mt-2'>
                          <strong>Lỗi hệ thống:</strong> Đợt chạy bị hủy hoặc file Excel không hợp lệ.
                        </Alert>
                      )}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          )
        })}

        {filteredBatches.length === 0 && (
          <Paper variant='outlined' sx={{ py: 10, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 1.5 }}>
            <i className='tabler-history text-[48px] text-disabled' />
            <Typography variant='h6' color='text.secondary' sx={{ mt: 2, fontWeight: 600 }}>
              Không tìm thấy đợt định giá nào.
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Hãy thử thay đổi điều kiện tìm kiếm hoặc tạo một đợt định giá mới.
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* PAGINATION */}
      {filteredBatches.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component='div'
          count={filteredBatches.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Dòng mỗi trang:'
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
          sx={{ borderTop: '1px solid', borderColor: 'divider', bg: 'background.paper', borderRadius: 1.5 }}
        />
      )}
    </Box>
  )
}

export default AgentPricingHistoryView
