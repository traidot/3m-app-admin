'use client'

import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Tooltip from '@mui/material/Tooltip'

import {
  ADMIN_PACKAGES,
  getCheapestSource,
  USD_VND,
  type AdminPackage
} from './data'

const KPI_CONFIG = [
  { key: 'total', label: 'Gói cước tập trung', icon: 'tabler-packages', color: 'primary' as const },
  { key: 'suppliers', label: 'Nhà cung cấp API', icon: 'tabler-api', color: 'success' as const },
  { key: 'active', label: 'Gói đang hoạt động', icon: 'tabler-activity', color: 'info' as const },
  { key: 'optimal', label: 'Nguồn giá rẻ nhất (%)', icon: 'tabler-discount-2', color: 'warning' as const }
]

const PackagesView = () => {
  const [packages] = useState<AdminPackage[]>(ADMIN_PACKAGES)
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [simType, setSimType] = useState('all')

  // List of unique regions
  const regionList = useMemo(() => Array.from(new Set(packages.map(p => p.region))), [packages])

  const filtered = useMemo(() => {
    return packages.filter(p => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      return (
        matchSearch &&
        (region === 'all' || p.region === region) &&
        (simType === 'all' || p.simType === simType)
      )
    })
  }, [packages, search, region, simType])

  const kpis = useMemo(() => {
    // Unique list of suppliers
    const suppliersSet = new Set<string>()
    packages.forEach(p => p.sources.forEach(s => suppliersSet.add(s.supplier)))

    return {
      total: packages.length,
      suppliers: suppliersSet.size,
      active: packages.filter(p => p.active).length,
      optimal: '100%'
    }
  }, [packages])

  const formatKpiValue = (key: string, val: any) => val

  const activeFilterCount = [region, simType].filter(v => v !== 'all').length

  const resetFilters = () => {
    setSearch('')
    setRegion('all')
    setSimType('all')
  }

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Bảng giá gói cước hệ thống
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Xem giá cost, các nguồn cung cấp API eSIM toàn cầu và so sánh tìm giá rẻ nhất.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>
            Xuất biểu phí
          </Button>
        </Stack>
      </Box>

      {/* View Only Alert */}
      <Alert severity='warning' icon={<i className='tabler-info-circle text-[22px]' />} className='mbe-6'>
        Giao diện tra cứu bảng giá cước tập trung của sàn — <strong>Chế độ Chỉ xem (View Only)</strong>. Chỉ có Agent mới có quyền CRUD cấu hình định giá bán của riêng họ.
      </Alert>

      {/* KPI row */}
      <Grid2 container spacing={4} className='mbe-6'>
        {KPI_CONFIG.map(kpi => (
          <Grid2 key={kpi.key} size={{ xs: 6, md: 3 }}>
            <Card variant='outlined'>
              <CardContent>
                <Box className='flex items-center justify-between'>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      {kpi.label}
                    </Typography>
                    <Typography variant='h4' className='font-bold'>
                      {formatKpiValue(kpi.key, kpis[kpi.key as keyof typeof kpis])}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `rgba(var(--mui-palette-${kpi.color}-mainChannel) / 0.10)`,
                      color: `var(--mui-palette-${kpi.color}-main)`
                    }}
                  >
                    <i className={`${kpi.icon} text-[22px]`} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Filter and Table Container */}
      <Card variant='outlined'>
        <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box className='flex items-center gap-3 mbe-3 flex-wrap'>
            <TextField
              size='small'
              placeholder='Tìm theo gói cước, quốc gia, ID...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ flex: 1, minWidth: 280, maxWidth: 420 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-search text-[18px]' />
                  </InputAdornment>
                )
              }}
            />
            <Box className='flex-grow' />
            {(activeFilterCount > 0 || search) && (
              <Button
                size='small'
                variant='text'
                color='secondary'
                onClick={resetFilters}
                startIcon={<i className='tabler-x text-[16px]' />}
              >
                Xoá lọc{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
            )}
            <Typography variant='caption' color='text.secondary'>
              Hiển thị <strong>{filtered.length}</strong> / {packages.length} gói cước
            </Typography>
          </Box>

          <Box className='grid gap-3' sx={{ gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' } }}>
            <TextField size='small' select label='Khu vực / Vùng' value={region} onChange={e => setRegion(e.target.value)}>
              <MenuItem value='all'>Tất cả khu vực</MenuItem>
              {regionList.map(r => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
            <TextField size='small' select label='Loại SIM' value={simType} onChange={e => setSimType(e.target.value)}>
              <MenuItem value='all'>Tất cả loại</MenuItem>
              <MenuItem value='esim'>eSIM</MenuItem>
              <MenuItem value='physical'>SIM vật lý</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Gói cước</TableCell>
                <TableCell>Khu vực / Quốc gia</TableCell>
                <TableCell>Nguồn rẻ nhất (Cost)</TableCell>
                <TableCell align='right'>Giá vốn quy đổi (VND)</TableCell>
                <TableCell align='right'>Giá bán lẻ đề xuất</TableCell>
                <TableCell>Các nguồn cấp tích hợp khác</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(p => {
                const cheapest = getCheapestSource(p)
                const costVnd = cheapest ? Math.round(cheapest.costUSD * USD_VND) : 0
                return (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Box className='flex items-center gap-3'>
                        <Typography variant='h5'>{p.flag}</Typography>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {p.id} · {p.simType === 'esim' ? 'eSIM' : 'SIM vật lý'} · {p.dataGB === 'unlimited' ? 'Không giới hạn' : `${p.dataGB}GB`} · {p.durationDays} ngày
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {p.country}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Vùng: {p.region}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {cheapest ? (
                        <>
                          <Typography variant='body2' color='success.main' sx={{ fontWeight: 600 }}>
                            {cheapest.supplier}
                          </Typography>
                          <Typography variant='caption' color='success.main'>
                            ${cheapest.costUSD.toFixed(2)} (Đánh giá: {cheapest.qualityRating}★)
                          </Typography>
                        </>
                      ) : (
                        <Typography color='text.disabled' variant='caption'>Hết nguồn cấp</Typography>
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {costVnd > 0 ? (
                        <Typography sx={{ fontWeight: 600 }}>
                          {costVnd.toLocaleString('vi-VN')}đ
                        </Typography>
                      ) : (
                        <Typography variant='caption' color='text.disabled'>--</Typography>
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 600 }}>
                        {p.suggestedRetailPriceVND.toLocaleString('vi-VN')}đ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        {p.sources.map((s, idx) => (
                          <Box key={idx} className='flex items-center gap-2'>
                            <Typography variant='caption' sx={{ fontWeight: s.supplier === cheapest?.supplier ? 600 : 400 }}>
                              {s.supplier}: ${s.costUSD.toFixed(2)}
                            </Typography>
                            {s.status === 'out_of_stock' && (
                              <Chip size='small' variant='tonal' color='error' label='OOS' sx={{ fontSize: '9px', height: '16px' }} />
                            )}
                            {s.status === 'paused' && (
                              <Chip size='small' variant='tonal' color='warning' label='Paused' sx={{ fontSize: '9px', height: '16px' }} />
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={p.active ? 'success' : 'secondary'}
                        label={p.active ? 'Đang hoạt động' : 'Tạm ngưng'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>Không có gói cước nào khớp bộ lọc.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default PackagesView
