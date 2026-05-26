'use client'

import { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import * as XLSX from 'xlsx'

export type PricingBatch = {
  id: string
  appliedAt: string
  type: 'rule' | 'excel'
  version: string
  criterion?: 'price' | 'quality' | 'bestseller'
  priorityOrder?: string[]
  globalMarkup?: number
  regionalOverrides?: string[]
  countryOverrides?: string[]
  excelFileName?: string
  packagesCount: number
  status: 'success' | 'failed'
  appliedBy: string
  packagesSnapshot?: {
    id: string
    name: string
    region: string
    country: string
    supplier: string
    costVND: number
    costUSD: number
    markupPct: number
    sellPriceVND: number
  }[]
}

type Props = {
  open: boolean
  batches: PricingBatch[]
  onClose: () => void
}

const criterionLabels: Record<'price' | 'quality' | 'bestseller', string> = {
  price: 'Tối ưu Giá vốn tốt nhất (Price)',
  quality: 'Chất lượng hàng đầu (Quality)',
  bestseller: 'Sản lượng bán chạy (Best Seller)'
}

const PricingHistoryDrawer = ({ open, batches, onClose }: Props) => {
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedBatch(prev => (prev === id ? null : id))
  }

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

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 540 } } }}
    >
      {/* HEADER */}
      <Box className='flex items-center justify-between p-6' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box className='flex items-center gap-3'>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(var(--mui-palette-secondary-mainChannel) / 0.1)',
              color: 'text.secondary'
            }}
          >
            <i className='tabler-history text-[22px]' />
          </Box>
          <Box>
            <Typography variant='h5' className='font-bold'>
              Lịch sử định giá & Đợt chạy
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Nhật ký quản lý các đợt áp dụng định giá (Quy tắc & Nhập Excel).
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <i className='tabler-x' />
        </IconButton>
      </Box>

      {/* BODY */}
      <Box className='p-6 flex-1 overflow-auto bg-action-hover'>
        <Stack spacing={4}>
          {batches.map((batch) => {
            const isExpanded = expandedBatch === batch.id
            const isSuccess = batch.status === 'success'
            const isExcel = batch.type === 'excel'

            return (
              <Card
                key={batch.id}
                variant='outlined'
                sx={{
                  borderLeft: '5px solid',
                  borderLeftColor: isSuccess ? 'success.main' : 'error.main',
                  borderColor: isExpanded ? 'primary.main' : 'divider',
                  boxShadow: isExpanded ? '0 4px 16px rgba(var(--mui-palette-primary-mainChannel) / 0.15)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                    borderColor: isExpanded ? 'primary.main' : 'rgba(var(--mui-palette-primary-mainChannel) / 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
                  {/* Summary Card Header */}
                  <Box className='flex items-start justify-between mbe-2'>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction='row' alignItems='center' spacing={2} className='mbe-1' flexWrap='wrap' gap={1}>
                        <Typography sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                          {batch.id}
                        </Typography>
                        <Chip
                          size='small'
                          variant='tonal'
                          color={isExcel ? 'warning' : 'primary'}
                          label={isExcel ? 'Nhập từ Excel' : 'Theo Quy tắc'}
                          icon={<i className={isExcel ? 'tabler-file-spreadsheet text-[14px]' : 'tabler-settings text-[14px]'} />}
                        />
                        <Chip
                          size='small'
                          color='info'
                          variant='outlined'
                          label={batch.version}
                          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                        <Chip
                          size='small'
                          variant='tonal'
                          color={isSuccess ? 'success' : 'error'}
                          label={isSuccess ? 'Thành công' : 'Thất bại'}
                          icon={<i className={isSuccess ? 'tabler-circle-check text-[14px]' : 'tabler-circle-x text-[14px]'} />}
                        />
                      </Stack>
                      <Typography variant='caption' color='text.secondary' className='block mt-1'>
                        Được chạy lúc: <strong>{batch.appliedAt}</strong>
                      </Typography>
                    </Box>
                    <IconButton size='small' onClick={() => toggleExpand(batch.id)} color='primary'>
                      <i className={isExpanded ? 'tabler-chevron-up' : 'tabler-chevron-down'} />
                    </IconButton>
                  </Box>

                  {/* Summary Info */}
                  <Box className='flex justify-between items-center mt-3 bg-action-hover p-2.5 rounded' sx={{ backgroundColor: 'action.hover' }}>
                    <Box>
                      <Typography variant='caption' color='text.secondary' className='block'>Kiểu đợt chạy</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {isExcel ? 'Tinh chỉnh tay' : 'Công thức tự động'}
                      </Typography>
                    </Box>
                    <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', height: 24 }} />
                    <Box>
                      <Typography variant='caption' color='text.secondary' className='block'>Số gói cập nhật</Typography>
                      <Typography sx={{ fontWeight: 600 }}>{batch.packagesCount} gói</Typography>
                    </Box>
                    <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', height: 24 }} />
                    <Box>
                      <Typography variant='caption' color='text.secondary' className='block'>Người vận hành</Typography>
                      <Typography sx={{ fontWeight: 600 }}>{batch.appliedBy}</Typography>
                    </Box>
                  </Box>

                  {/* Direct Download Button (Always visible for success runs without expanding) */}
                  {isSuccess && (
                    <Box sx={{ mt: 3.5 }}>
                      <Button
                        variant='contained'
                        fullWidth
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
                          py: 2,
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
                        Tải bảng giá phiên bản {batch.version} (.xlsx)
                      </Button>
                    </Box>
                  )}

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <Box className='mbs-4'>
                      <Divider className='mbe-4' sx={{ my: 3 }} />
                      
                      <Stack spacing={3}>
                        {isExcel ? (
                          <>
                            {/* Excel Source File */}
                            <Box>
                              <Typography variant='caption' color='text.secondary' className='block mbe-1'>
                                Tên file Excel nguồn
                              </Typography>
                              <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <i className='tabler-file-spreadsheet text-[18px]' />
                                {batch.excelFileName || 'smart_pricing_sheet.xlsx'}
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <>
                            {/* Criterion Used */}
                            <Box>
                              <Typography variant='caption' color='text.secondary' className='block mbe-1'>
                                Thứ tự ưu tiên nguồn cung
                              </Typography>
                              <Stack direction='row' spacing={1.5} flexWrap='wrap' gap={1}>
                                {(batch.priorityOrder || [batch.criterion || 'price']).map((crit, idx) => (
                                  <Chip
                                    key={crit}
                                    size='small'
                                    label={`${idx + 1}. ${criterionLabels[crit as 'price' | 'quality' | 'bestseller'] || crit}`}
                                    color='primary'
                                    variant={idx === 0 ? 'filled' : 'outlined'}
                                    sx={{ fontWeight: 500 }}
                                  />
                                ))}
                              </Stack>
                            </Box>

                            {/* Global Markup */}
                            <Box>
                              <Typography variant='caption' color='text.secondary' className='block mbe-1'>
                                Tỉ lệ Markup toàn sàn áp dụng
                              </Typography>
                              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                +{batch.globalMarkup}%
                              </Typography>
                            </Box>

                            {/* Regional rules overrides */}
                            <Box>
                              <Typography variant='caption' color='text.secondary' className='block mbe-1.5'>
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
                            </Box>

                            {/* Country rules overrides */}
                            <Box>
                              <Typography variant='caption' color='text.secondary' className='block mbe-1.5'>
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
                            </Box>
                          </>
                        )}

                        {/* Failure reason if failed */}
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
        </Stack>
      </Box>

      {/* FOOTER */}
      <Box className='p-4 flex justify-end bg-background' sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant='contained' onClick={onClose} color='secondary'>
          Đóng cửa sổ
        </Button>
      </Box>
    </Drawer>
  )
}

export default PricingHistoryDrawer
