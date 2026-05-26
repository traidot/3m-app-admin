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

import {
  AGENTS,
  tierColor,
  statusColor as agentStatusColor,
  statusLabel as agentStatusLabel,
  type Agent
} from '../agents/data'

const getDiscountPct = (tier: string) => {
  if (tier === 'Platinum') return 15
  if (tier === 'Gold') return 10
  if (tier === 'Silver') return 5
  return 0
}

const PackagesView = () => {
  const [packages] = useState<AdminPackage[]>(ADMIN_PACKAGES)

  // 1. Agent select filter
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENTS[0].id)

  // 2. Granular filters
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [country, setCountry] = useState('all')
  const [simType, setSimType] = useState('all')
  const [packageType, setPackageType] = useState('all')
  const [dataLimit, setDataLimit] = useState('all')
  const [durationDays, setDurationDays] = useState('all')

  const [status, setStatus] = useState('all')

  // Selected agent details
  const currentAgent = useMemo(() => {
    return AGENTS.find(a => a.id === selectedAgentId) || AGENTS[0]
  }, [selectedAgentId])

  // Unique list extractions for filter dropdowns
  const regionList = useMemo(() => Array.from(new Set(packages.map(p => p.region))), [packages])
  const countryList = useMemo(() => Array.from(new Set(packages.map(p => p.country))), [packages])
  const dataLimitList = useMemo(() => {
    const limits = packages.map(p => p.dataGB.toString())
    return Array.from(new Set(limits))
  }, [packages])
  const durationList = useMemo(() => {
    const durations = packages.map(p => p.durationDays.toString())
    return Array.from(new Set(durations))
  }, [packages])

  // Calculate stats dynamically based on selection
  const discountPct = useMemo(() => getDiscountPct(currentAgent.tier), [currentAgent])

  // Filtered packages
  const filtered = useMemo(() => {
    return packages.filter(p => {
      // Search
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q)

      // Dropdown filters
      const matchRegion = region === 'all' || p.region === region
      const matchCountry = country === 'all' || p.country === country
      const matchSimType = simType === 'all' || p.simType === simType
      
      const matchPkgType = packageType === 'all' || p.packageType === packageType

      const isPkgUnlimited = p.dataGB === 'unlimited'
      const matchData =
        dataLimit === 'all' ||
        (dataLimit === 'unlimited' && isPkgUnlimited) ||
        (dataLimit !== 'unlimited' && p.dataGB.toString() === dataLimit)

      const matchDuration = durationDays === 'all' || p.durationDays.toString() === durationDays

      const matchStatus =
        status === 'all' ||
        (status === 'active' && p.active) ||
        (status === 'inactive' && !p.active)

      // Calculate prices for numeric filters
      const cheapest = getCheapestSource(p)
      const costVnd = cheapest ? Math.round(cheapest.costUSD * USD_VND) : 0
      const agentPriceVND = Math.round(p.suggestedRetailPriceVND * (1 - discountPct / 100))
      const agentProfitVND = p.suggestedRetailPriceVND - agentPriceVND

      return (
        matchSearch &&
        matchRegion &&
        matchCountry &&
        matchSimType &&
        matchPkgType &&
        matchData &&
        matchDuration &&
        matchStatus
      )
    })
  }, [
    packages,
    search,
    region,
    country,
    simType,
    packageType,
    dataLimit,
    durationDays,
    status,
    discountPct
  ])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (search) count++
    if (region !== 'all') count++
    if (country !== 'all') count++
    if (simType !== 'all') count++
    if (packageType !== 'all') count++
    if (dataLimit !== 'all') count++
    if (durationDays !== 'all') count++
    if (status !== 'all') count++
    return count
  }, [
    search,
    region,
    country,
    simType,
    packageType,
    dataLimit,
    durationDays,
    status
  ])

  const resetFilters = () => {
    setSearch('')
    setRegion('all')
    setCountry('all')
    setSimType('all')
    setPackageType('all')
    setDataLimit('all')
    setDurationDays('all')
    setStatus('all')
  }

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Biểu phí đại lý toàn sàn
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Xem và lọc bảng giá cước eSIM / SIM vật lý chi tiết tương ứng với từng cấp bậc đại lý (Platinum/Gold/Silver).
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>
            Xuất Excel biểu giá đại lý
          </Button>
        </Stack>
      </Box>

      {/* AGENT AUDIT PANEL */}
      <Card variant='outlined' sx={{ mbe: 6, borderColor: 'primary.main', borderWidth: 1.5 }}>
        <CardContent sx={{ p: '20px !important' }}>
          <Grid2 container spacing={4} alignItems='center'>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography variant='subtitle2' className='font-bold mbe-2 flex items-center gap-1.5' color='primary.main'>
                <i className='tabler-user-cog text-[18px]' /> 1. Chọn Đại lý để xem Biểu giá
              </Typography>
              <TextField
                select
                fullWidth
                size='small'
                label='Đại lý phân phối'
                value={selectedAgentId}
                onChange={e => setSelectedAgentId(e.target.value)}
              >
                {AGENTS.map(a => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name} ({a.tier} Tier)
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 1,
                  backgroundColor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexWrap: 'wrap'
                }}
              >
                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>Hạng đại lý</Typography>
                  <Chip
                    size='small'
                    color={tierColor[currentAgent.tier]}
                    label={currentAgent.tier}
                    variant='tonal'
                    sx={{ fontWeight: 600, mt: 0.5 }}
                  />
                </Box>

                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>Trạng thái tài khoản</Typography>
                  <Chip
                    size='small'
                    color={agentStatusColor[currentAgent.status]}
                    label={agentStatusLabel[currentAgent.status]}
                    variant='tonal'
                    sx={{ fontWeight: 600, mt: 0.5 }}
                  />
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>Người đại diện</Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600, mt: 0.5 }}>{currentAgent.owner}</Typography>
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* ADVANCED FILTER MATRIX PANEL */}
      <Card variant='outlined' sx={{ mbe: 6 }}>
        <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'action.hover' }}>
          <Box className='flex items-center justify-between'>
            <Typography variant='subtitle2' className='font-bold flex items-center gap-1.5'>
              <i className='tabler-adjustments-horizontal text-[20px] text-primary' /> 2. Bộ lọc biểu giá chi tiết
            </Typography>
            {activeFilterCount > 0 && (
              <Button
                size='small'
                variant='text'
                color='secondary'
                onClick={resetFilters}
                startIcon={<i className='tabler-x text-[16px]' />}
              >
                Xóa tất cả ({activeFilterCount})
              </Button>
            )}
          </Box>
        </Box>
        <CardContent sx={{ p: 4 }}>
          <Grid2 container spacing={3}>
            {/* Search */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField
                fullWidth
                size='small'
                label='Từ khóa tìm kiếm'
                placeholder='Nhập mã gói, tên sản phẩm...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search text-[16px]' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid2>

            {/* Region */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField select fullWidth size='small' label='Vùng / Châu lục' value={region} onChange={e => setRegion(e.target.value)}>
                <MenuItem value='all'>Tất cả vùng</MenuItem>
                {regionList.map(r => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
            </Grid2>

            {/* Country */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField select fullWidth size='small' label='Quốc gia' value={country} onChange={e => setCountry(e.target.value)}>
                <MenuItem value='all'>Tất cả quốc gia</MenuItem>
                {countryList.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid2>

            {/* SIM Type */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField select fullWidth size='small' label='Loại SIM' value={simType} onChange={e => setSimType(e.target.value)}>
                <MenuItem value='all'>Tất cả loại SIM</MenuItem>
                <MenuItem value='esim'>eSIM</MenuItem>
                <MenuItem value='physical'>SIM vật lý</MenuItem>
              </TextField>
            </Grid2>

            {/* Package Type */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField select fullWidth size='small' label='Loại gói' value={packageType} onChange={e => setPackageType(e.target.value)}>
                <MenuItem value='all'>Tất cả loại gói</MenuItem>
                <MenuItem value='Total'>Total</MenuItem>
                <MenuItem value='Dailys'>Dailys</MenuItem>
              </TextField>
            </Grid2>

            {/* Data Limit */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField select fullWidth size='small' label='Dung lượng' value={dataLimit} onChange={e => setDataLimit(e.target.value)}>
                <MenuItem value='all'>Tất cả dung lượng</MenuItem>
                {dataLimitList.map(d => (
                  <MenuItem key={d} value={d}>
                    {d === 'unlimited' ? 'Không giới hạn' : `${d} GB`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>

            {/* Duration */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField select fullWidth size='small' label='Số ngày' value={durationDays} onChange={e => setDurationDays(e.target.value)}>
                <MenuItem value='all'>Tất cả số ngày</MenuItem>
                {durationList.map(d => (
                  <MenuItem key={d} value={d}>{d} ngày</MenuItem>
                ))}
              </TextField>
            </Grid2>



            {/* Status */}
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField select fullWidth size='small' label='Trạng thái gói' value={status} onChange={e => setStatus(e.target.value)}>
                <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                <MenuItem value='active'>Hoạt động</MenuItem>
                <MenuItem value='inactive'>Tạm ngưng</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* RESULTS COUNT & TABLE */}
      <Card variant='outlined'>
        <Box className='p-4 flex items-center justify-between' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant='subtitle2' className='font-bold' color='text.secondary'>
            Biểu phí thực hiển thị cho đại lý: <strong>{currentAgent.name}</strong>
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Tìm thấy <strong>{filtered.length}</strong> kết quả khớp bộ lọc
          </Typography>
        </Box>
        
        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Gói eSIM</TableCell>
                <TableCell>Loại SIM</TableCell>
                <TableCell>Quốc gia</TableCell>
                <TableCell>Loại gói</TableCell>
                <TableCell>Dung lượng</TableCell>
                <TableCell>Số ngày</TableCell>
                <TableCell align='right'>Giá mua</TableCell>
                <TableCell align='right'>Giá bán</TableCell>
                <TableCell align='right'>Lãi đại lý (VND)</TableCell>
                <TableCell>Trạng thái sàn</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(p => {
                const cheapest = getCheapestSource(p)
                const costVnd = cheapest ? Math.round(cheapest.costUSD * USD_VND) : 0
                const agentPriceVND = Math.round(p.suggestedRetailPriceVND * (1 - discountPct / 100))
                const agentProfitVND = p.suggestedRetailPriceVND - agentPriceVND
                
                return (
                  <TableRow key={p.id} hover>
                    {/* 1. Gói eSIM */}
                    <TableCell>
                      <Box className='flex items-center gap-3'>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            backgroundColor: 'action.hover',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)'
                          }}
                        >
                          {p.flag}
                        </Box>
                        <Box>
                          <Stack direction='row' spacing={1} alignItems='center'>
                            <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
                            {p.isFeatured && (
                              <Chip
                                size='small'
                                color='error'
                                variant='tonal'
                                label='Hot'
                                sx={{ height: 16, fontSize: '9px', fontWeight: 700 }}
                              />
                            )}
                          </Stack>
                          <Typography variant='caption' color='text.secondary'>
                            {p.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* 2. Loại SIM */}
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={p.simType === 'esim' ? 'primary' : 'info'}
                        label={p.simType === 'esim' ? 'eSIM' : 'SIM vật lý'}
                        sx={{ fontWeight: 600, textTransform: 'uppercase' }}
                      />
                    </TableCell>

                    {/* 3. Quốc gia */}
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {p.country}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Vùng: {p.region}
                      </Typography>
                    </TableCell>

                    {/* 4. Loại gói */}
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={p.packageType === 'Total' ? 'primary' : 'warning'}
                        label={p.packageType}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    {/* 5. Dung lượng */}
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {p.dataGB === 'unlimited' ? 'Không giới hạn' : `${p.dataGB} GB`}
                      </Typography>
                    </TableCell>

                    {/* 6. Số ngày */}
                    <TableCell>
                      <Typography variant='body2'>{p.durationDays} ngày</Typography>
                    </TableCell>

                    {/* 7. Giá mua */}
                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 700 }} color='primary.main'>
                        {agentPriceVND.toLocaleString('vi-VN')}đ
                      </Typography>
                    </TableCell>

                    {/* 8. Giá bán */}
                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 600 }}>
                        {p.suggestedRetailPriceVND.toLocaleString('vi-VN')}đ
                      </Typography>
                    </TableCell>

                    {/* 9. Lãi đại lý */}
                    <TableCell align='right'>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }} color='success.main'>
                          +{agentProfitVND.toLocaleString('vi-VN')}đ
                        </Typography>
                        <Typography variant='caption' color='success.main' sx={{ fontWeight: 600 }}>
                          ({discountPct}%)
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* 10. Trạng thái sàn */}
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={p.active ? 'success' : 'secondary'}
                        label={p.active ? 'Hoạt động' : 'Tạm ngưng'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align='center' sx={{ py: 6 }}>
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
