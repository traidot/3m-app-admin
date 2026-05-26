'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import {
  AGENT_PACKAGES,
  cheapestSource,
  costVND,
  marginPct,
  type AgentPackage
} from './data'
import SourcePoolDrawer from './SourcePoolDrawer'
import PricingHistoryDrawer, { type PricingBatch } from './PricingHistoryDrawer'

const KPI_CONFIG = [
  { key: 'total', label: 'Tổng gói cước', icon: 'tabler-packages', color: 'primary' as const },
  { key: 'active', label: 'Đang bán', icon: 'tabler-circle-check', color: 'success' as const },
  { key: 'inactive', label: 'Tạm ẩn', icon: 'tabler-circle-off', color: 'secondary' as const },
  { key: 'warning', label: 'Cảnh báo nguồn', icon: 'tabler-alert-triangle', color: 'warning' as const }
]

const formatData = (pkg: AgentPackage) =>
  pkg.dataGB === 'unlimited' ? 'Không giới hạn' : `${pkg.dataGB}GB`

const AgentPackagesView = () => {
  const [packages, setPackages] = useState<AgentPackage[]>(AGENT_PACKAGES)
  const [batches, setBatches] = useState<PricingBatch[]>([])

  useEffect(() => {
    const storedPkgs = localStorage.getItem('3m_agent_packages')
    if (storedPkgs) {
      try {
        setPackages(JSON.parse(storedPkgs))
      } catch (e) {
        console.error(e)
      }
    } else {
      localStorage.setItem('3m_agent_packages', JSON.stringify(AGENT_PACKAGES))
    }

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

  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<string>('all')
  const [country, setCountry] = useState<string>('all')
  const [simType, setSimType] = useState<string>('all')
  const [dataSize, setDataSize] = useState<string>('all')
  const [duration, setDuration] = useState<string>('all')
  const [quotaType, setQuotaType] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activePkg, setActivePkg] = useState<AgentPackage | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [editPriceOpen, setEditPriceOpen] = useState(false)
  const [editPkg, setEditPkg] = useState<AgentPackage | null>(null)
  const [newPriceVND, setNewPriceVND] = useState<number>(0)
  const [toastMessage, setToastMessage] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  const router = useRouter()

  const countryOptions = useMemo(() => {
    const map = new Map<string, { code: string; label: string; flag: string }>()
    packages.forEach(p => map.set(p.countryCode, { code: p.countryCode, label: p.country, flag: p.flag }))
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
  }, [packages])

  const filtered = useMemo(() => {
    return packages.filter(p => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.country.toLowerCase().includes(search.toLowerCase())
      const matchRegion = region === 'all' || p.region === region
      const matchCountry = country === 'all' || p.countryCode === country
      const matchSim = simType === 'all' || p.simType === simType
      const matchData =
        dataSize === 'all' ||
        (dataSize === 'unlimited' && p.dataGB === 'unlimited') ||
        (dataSize === '1-3' && typeof p.dataGB === 'number' && p.dataGB >= 1 && p.dataGB <= 3) ||
        (dataSize === '4-10' && typeof p.dataGB === 'number' && p.dataGB >= 4 && p.dataGB <= 10) ||
        (dataSize === '11-20' && typeof p.dataGB === 'number' && p.dataGB >= 11 && p.dataGB <= 20) ||
        (dataSize === '20+' && typeof p.dataGB === 'number' && p.dataGB > 20)
      const matchDuration =
        duration === 'all' ||
        (duration === '1-7' && p.durationDays >= 1 && p.durationDays <= 7) ||
        (duration === '8-15' && p.durationDays >= 8 && p.durationDays <= 15) ||
        (duration === '16-30' && p.durationDays >= 16 && p.durationDays <= 30) ||
        (duration === '30+' && p.durationDays > 30)
      const matchQuota = quotaType === 'all' || p.quotaType === quotaType
      const matchStatus =
        status === 'all' ||
        (status === 'active' && p.active) ||
        (status === 'inactive' && !p.active)
      return (
        matchSearch &&
        matchRegion &&
        matchCountry &&
        matchSim &&
        matchData &&
        matchDuration &&
        matchQuota &&
        matchStatus
      )
    })
  }, [packages, search, region, country, simType, dataSize, duration, quotaType, status])

  const activeFilterCount = [region, country, simType, dataSize, duration, quotaType, status].filter(
    v => v !== 'all'
  ).length

  const resetFilters = () => {
    setRegion('all')
    setCountry('all')
    setSimType('all')
    setDataSize('all')
    setDuration('all')
    setQuotaType('all')
    setStatus('all')
    setSearch('')
  }

  const kpis = useMemo(() => {
    const warning = packages.filter(p => {
      const src = cheapestSource(p)
      return !src || p.sources.filter(s => s.status === 'available').length === 0
    }).length
    return {
      total: packages.length,
      active: packages.filter(p => p.active).length,
      inactive: packages.filter(p => !p.active).length,
      warning
    }
  }, [packages])

  const toggleActive = (id: string) =>
    setPackages(prev => prev.map(p => (p.id === id ? { ...p, active: !p.active } : p)))

  const openDrawer = (pkg: AgentPackage) => {
    setActivePkg(pkg)
    setDrawerOpen(true)
  }

  const handleSavePinned = (pkgId: string, pinnedSourceId: string | null) => {
    setPackages(prev => prev.map(p => (p.id === pkgId ? { ...p, pinnedSourceId } : p)))
  }

  const handleOpenEditPrice = (pkg: AgentPackage) => {
    setEditPkg(pkg)
    setNewPriceVND(pkg.sellPriceVND)
    setEditPriceOpen(true)
  }

  const handleSavePrice = () => {
    if (!editPkg) return
    setPackages(prev =>
      prev.map(p => (p.id === editPkg.id ? { ...p, sellPriceVND: newPriceVND } : p))
    )
    setToastMessage(`Đã cập nhật giá bán mới cho gói ${editPkg.name}!`)
    setToastOpen(true)
    setEditPriceOpen(false)
  }

  return (
    <Box>
      {/* Page header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Quản lý gói cước
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Danh sách gói cước hiển thị trên mobile app. Giá vốn được lấy từ rổ nguồn trên chợ eSIM —
            hệ thống tự chọn nhà cung cấp rẻ nhất.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button
            variant='tonal'
            color='primary'
            startIcon={<i className='tabler-brain' />}
            onClick={() => router.push('/agent/packages/smart')}
          >
            Cấu hình thông minh
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            startIcon={<i className='tabler-history' />}
            onClick={() => router.push('/agent/packages/history')}
          >
            Lịch sử định giá
          </Button>
        </Stack>
      </Box>

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
                      {kpis[kpi.key as keyof typeof kpis]}
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

      {/* Filter toolbar + Table */}
      <Card variant='outlined'>
        <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box className='flex items-center gap-3 mbe-3'>
            <TextField
              size='small'
              placeholder='Tìm theo tên gói, quốc gia...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ flex: 1, maxWidth: 360 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-search text-[18px]' />
                  </InputAdornment>
                )
              }}
            />
            <Box className='flex-1' />
            {activeFilterCount > 0 && (
              <Button
                size='small'
                variant='text'
                color='secondary'
                onClick={resetFilters}
                startIcon={<i className='tabler-x text-[16px]' />}
              >
                Xoá lọc ({activeFilterCount})
              </Button>
            )}
            <Typography variant='caption' color='text.secondary'>
              Hiển thị <strong>{filtered.length}</strong> / {packages.length} gói
            </Typography>
          </Box>

          <Box className='grid gap-3' sx={{ gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' } }}>
            <TextField size='small' select label='Vùng' value={region} onChange={e => setRegion(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='Asia'>Châu Á</MenuItem>
              <MenuItem value='Europe'>Châu Âu</MenuItem>
              <MenuItem value='America'>Châu Mỹ</MenuItem>
              <MenuItem value='Africa'>Châu Phi</MenuItem>
              <MenuItem value='Oceania'>Châu Đại Dương</MenuItem>
              <MenuItem value='Global'>Toàn cầu</MenuItem>
            </TextField>

            <TextField size='small' select label='Quốc gia' value={country} onChange={e => setCountry(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              {countryOptions.map(c => (
                <MenuItem key={c.code} value={c.code}>
                  {c.flag} {c.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField size='small' select label='Loại SIM' value={simType} onChange={e => setSimType(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='esim'>eSIM</MenuItem>
              <MenuItem value='physical'>SIM vật lý</MenuItem>
            </TextField>

            <TextField size='small' select label='Dung lượng' value={dataSize} onChange={e => setDataSize(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='1-3'>1 – 3 GB</MenuItem>
              <MenuItem value='4-10'>4 – 10 GB</MenuItem>
              <MenuItem value='11-20'>11 – 20 GB</MenuItem>
              <MenuItem value='20+'>Trên 20 GB</MenuItem>
              <MenuItem value='unlimited'>Không giới hạn</MenuItem>
            </TextField>

            <TextField size='small' select label='Số ngày' value={duration} onChange={e => setDuration(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='1-7'>1 – 7 ngày</MenuItem>
              <MenuItem value='8-15'>8 – 15 ngày</MenuItem>
              <MenuItem value='16-30'>16 – 30 ngày</MenuItem>
              <MenuItem value='30+'>Trên 30 ngày</MenuItem>
            </TextField>

            <TextField size='small' select label='Loại gói' value={quotaType} onChange={e => setQuotaType(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='daily'>Daily</MenuItem>
              <MenuItem value='total'>Total</MenuItem>
            </TextField>

            <TextField size='small' select label='Trạng thái' value={status} onChange={e => setStatus(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='active'>Đang bán</MenuItem>
              <MenuItem value='inactive'>Tạm ẩn</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Tên gói</TableCell>
                <TableCell>Quốc gia</TableCell>
                <TableCell>Dung lượng</TableCell>
                <TableCell>Số ngày</TableCell>
                <TableCell>Loại SIM</TableCell>
                <TableCell>Loại gói</TableCell>
                <TableCell align='right'>Giá vốn</TableCell>
                <TableCell align='right'>Giá bán</TableCell>
                <TableCell align='right'>Lãi</TableCell>
                <TableCell align='center'>Đang bán</TableCell>
                <TableCell align='right'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(pkg => {
                const src = cheapestSource(pkg)
                const cost = costVND(pkg)
                const margin = marginPct(pkg)
                const availableCount = pkg.sources.filter(s => s.status === 'available').length

                return (
                  <TableRow key={pkg.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{pkg.name}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {pkg.id}{pkg.type && pkg.type !== 'Data only' ? ` · ${pkg.type}` : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className='flex items-center gap-2'>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            backgroundColor: 'action.hover',
                            flexShrink: 0
                          }}
                        >
                          {pkg.flag}
                        </Box>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                            {pkg.country}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {formatData(pkg)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{pkg.durationDays} ngày</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={pkg.simType === 'esim' ? 'primary' : 'warning'}
                        label={pkg.simType === 'esim' ? 'eSIM' : 'Vật lý'}
                        icon={<i className={`${pkg.simType === 'esim' ? 'tabler-device-mobile' : 'tabler-device-sd-card'} text-[14px]`} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={pkg.quotaType === 'daily' ? 'info' : 'secondary'}
                        label={pkg.quotaType === 'daily' ? 'Daily' : 'Total'}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      {src ? (
                        <>
                          <Typography sx={{ fontWeight: 600 }}>
                            {cost.toLocaleString('vi-VN')}đ
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            ${src.costUSD.toFixed(2)}
                          </Typography>
                        </>
                      ) : (
                        <Chip size='small' color='error' variant='tonal' label='Hết nguồn' />
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 600 }}>
                        {pkg.sellPriceVND.toLocaleString('vi-VN')}đ
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={margin >= 30 ? 'success' : margin >= 10 ? 'warning' : 'error'}
                        label={`${margin > 0 ? '+' : ''}${margin}%`}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      <Switch
                        checked={pkg.active}
                        onChange={() => toggleActive(pkg.id)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                        <Tooltip title='Xem rổ nguồn cung'>
                          <IconButton size='small' onClick={() => openDrawer(pkg)}>
                            <i className='tabler-stack-2 text-[20px]' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Chỉnh sửa giá bán'>
                          <IconButton size='small' onClick={() => handleOpenEditPrice(pkg)}>
                            <i className='tabler-pencil text-[20px]' />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>Không có gói cước nào khớp bộ lọc.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Drawer */}
      <SourcePoolDrawer
        open={drawerOpen}
        pkg={activePkg}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSavePinned}
      />



      {/* Edit Retail Price Dialog */}
      <Dialog
        open={editPriceOpen}
        onClose={() => setEditPriceOpen(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Chỉnh sửa giá bán lẻ</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editPkg && (
            <Stack spacing={4} sx={{ mt: 1 }}>
              {/* Package Meta Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3, borderRadius: 1.5, backgroundColor: 'action.hover' }}>
                <Typography fontSize={24}>{editPkg.flag}</Typography>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {editPkg.name}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {editPkg.id} · {editPkg.region}
                  </Typography>
                </Box>
              </Box>

              {/* Pricing Context */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                <Typography variant='body2' color='text.secondary'>Giá vốn sỉ hiện tại:</Typography>
                <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {costVND(editPkg).toLocaleString('vi-VN')}đ
                </Typography>
              </Box>

              {/* Price input field */}
              <TextField
                autoFocus
                label='Giá bán lẻ mới (VND)'
                type='number'
                fullWidth
                value={newPriceVND}
                onChange={e => setNewPriceVND(Math.max(0, Number(e.target.value)))}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>đ</InputAdornment>
                }}
                helperText={(() => {
                  const cost = costVND(editPkg)
                  if (cost <= 0) return ''
                  const margin = Math.round(((newPriceVND - cost) / cost) * 100)
                  return (
                    <Typography
                      variant='caption'
                      component='span'
                      sx={{
                        fontWeight: 500,
                        color: margin >= 30 ? 'success.main' : margin >= 10 ? 'warning.main' : 'error.main'
                      }}
                    >
                      Biên lợi nhuận dự kiến: {margin > 0 ? '+' : ''}{margin}%
                    </Typography>
                  )
                })()}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 5, pb: 4 }}>
          <Button variant='tonal' color='secondary' onClick={() => setEditPriceOpen(false)}>
            Huỷ bỏ
          </Button>
          <Button variant='contained' color='primary' onClick={handleSavePrice} disabled={!editPkg || newPriceVND <= 0}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity='success'
          variant='filled'
          sx={{ width: '100%', boxShadow: 3 }}
          icon={<i className='tabler-circle-check text-[22px]' />}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AgentPackagesView
