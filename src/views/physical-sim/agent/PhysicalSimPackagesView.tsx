'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'
import Grid2 from '@mui/material/Grid2'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'

interface PackageItem {
  code: string
  name: string
  supplier: 'Hồng Kông' | 'Mỹ'
  type: 'Daily' | 'Total'
  dataCap: string
  duration: number
  agentPrice: number // Retail base price
  status: 'Đang hoạt động' | 'Tạm ngưng'
}

interface MockAgent {
  id: string
  name: string
  tier: 'PLATINUM' | 'GOLD' | 'BRONZE'
  discountPercent: number
}

const PhysicalSimPackagesView = () => {
  const mockAgents: MockAgent[] = [
    { id: 'A001', name: 'TravelConnect Solutions', tier: 'PLATINUM', discountPercent: 15 },
    { id: 'A002', name: 'Global eSIM Hub', tier: 'GOLD', discountPercent: 10 },
    { id: 'A003', name: 'Việt Nam Sim Tour', tier: 'BRONZE', discountPercent: 5 }
  ]

  const [selectedAgent, setSelectedAgent] = useState<MockAgent>(mockAgents[0])

  // Read-only package list for Agent (matching Admin's configurations)
  const packagesList: PackageItem[] = [
    {
      code: 'HK-DAILY1',
      name: 'HK Daily Essential',
      supplier: 'Hồng Kông',
      type: 'Daily',
      dataCap: '1GB/Ngày',
      duration: 1,
      agentPrice: 15000,
      status: 'Đang hoạt động'
    },
    {
      code: 'HK-DAILY3',
      name: 'HK Daily HighCap',
      supplier: 'Hồng Kông',
      type: 'Daily',
      dataCap: '3GB/Ngày',
      duration: 3,
      agentPrice: 45000,
      status: 'Đang hoạt động'
    },
    {
      code: 'HK-PRO10',
      name: 'HK Pro Traveler 30D',
      supplier: 'Hồng Kông',
      type: 'Total',
      dataCap: '10GB',
      duration: 30,
      agentPrice: 90000,
      status: 'Đang hoạt động'
    },
    {
      code: 'US-TRAVEL5',
      name: 'US Travel Lite 5D',
      supplier: 'Mỹ',
      type: 'Total',
      dataCap: '5GB',
      duration: 5,
      agentPrice: 120000,
      status: 'Đang hoạt động'
    },
    {
      code: 'US-UNLIMITED7',
      name: 'US Unlimited Premium',
      supplier: 'Mỹ',
      type: 'Total',
      dataCap: 'Không giới hạn',
      duration: 7,
      agentPrice: 250000,
      status: 'Đang hoạt động'
    }
  ]

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dataFilter, setDataFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')

  // Counts
  const totalPackages = packagesList.length
  const hkPackages = packagesList.filter(p => p.supplier === 'Hồng Kông').length
  const usPackages = packagesList.filter(p => p.supplier === 'Mỹ').length

  // Distinct cap & duration lists
  const distinctDataCaps = Array.from(new Set(packagesList.map(p => p.dataCap)))
  const distinctDurations = Array.from(new Set(packagesList.map(p => p.duration))).sort((a, b) => a - b)

  // Filter Logic
  const filteredPackages = packagesList.filter(p => {
    const matchesSearch = p.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSupplier = supplierFilter === 'all' || p.supplier === supplierFilter
    const matchesType = typeFilter === 'all' || p.type === typeFilter
    const matchesData = dataFilter === 'all' || p.dataCap === dataFilter
    const matchesDuration = durationFilter === 'all' || p.duration.toString() === durationFilter

    return matchesSearch && matchesSupplier && matchesType && matchesData && matchesDuration
  })

  const getSupplierAvatar = (supplier: string) => {
    switch (supplier) {
      case 'Hồng Kông': return { bg: '#FF4D4D', char: 'H' }
      case 'Mỹ': return { bg: '#0090FF', char: 'M' }
      default: return { bg: '#7367F0', char: 'S' }
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'primary'
      case 'GOLD': return 'warning'
      case 'BRONZE': return 'secondary'
      default: return 'default'
    }
  }

  return (
    <>
      <PageHeader
        title="Bảng giá Gói cước SIM Vật lý"
        description="Tra cứu thông tin, đơn giá bán lẻ và giá chiết khấu ưu đãi được cá nhân hóa riêng theo từng tài khoản đại lý."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/agent/dashboard' },
          { label: 'Quản lý SIM trắng' },
          { label: 'Bảng giá Gói cước' }
        ]}
        className='mbe-6'
      />

      {/* Personalized Info Dashboard Header */}
      <Card className='border-none shadow-sm mbe-6 bg-primary/5 border border-dashed border-primary/20 overflow-hidden'>
        <CardContent className='p-5'>
          <Grid2 container spacing={4} alignItems='center'>
            <Grid2 size={{ xs: 12 }} className='flex items-start gap-4'>
              <Avatar variant='rounded' sx={{ bgcolor: 'primary.tonal', color: 'primary.main', width: 44, height: 44 }}>
                <i className='tabler-user-check text-2xl' />
              </Avatar>
              <Box>
                <Box className='flex items-center gap-2 mbe-1'>
                  <Typography variant='h6' className='font-black text-primary'>
                    Giá Cá Nhân Hóa Đại Lý
                  </Typography>
                  <Chip 
                    label={`CẤP ${selectedAgent.tier}`} 
                    color={getTierColor(selectedAgent.tier) as any} 
                    size='small' 
                    className='font-black text-[9px] h-5'
                  />
                  <Chip 
                    label={`Ưu đãi của Bạn: -${selectedAgent.discountPercent}%`} 
                    color='success' 
                    size='small' 
                    variant='tonal'
                    className='font-black text-[9px] h-5'
                  />
                </Box>
                <Typography variant='body2' className='text-slate-600 font-medium'>
                  Hệ thống tự động áp dụng giá bán đặc quyền dành riêng cho đại lý của bạn (<strong>{selectedAgent.name}</strong>). Mọi chi phí kích hoạt SIM vật lý sẽ khấu trừ trực tiếp từ số dư tài khoản của bạn.
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Summary Row */}
      <Grid2 container spacing={4} className='mbe-6'>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card className='border-none shadow-sm bg-primary/5 border border-primary/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Tổng số gói cước</Typography>
                <Typography variant='h5' className='font-black text-primary'>{totalPackages} gói cước</Typography>
                <Typography variant='caption' color='textSecondary' className='text-[10px] block mt-1'>Sẵn sàng áp dụng cho SIM trắng</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'primary.tonal', color: 'primary.main', width: 40, height: 40 }}>
                <i className='tabler-receipt-2 text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card className='border-none shadow-sm bg-error/5 border border-error/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Hạ tầng Hồng Kông</Typography>
                <Typography variant='h5' className='font-black text-error'>{hkPackages} gói khả dụng</Typography>
                <Typography variant='caption' color='textSecondary' className='text-[10px] block mt-1'>Mạng đối tác HK Telecom</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'error.tonal', color: 'error.main', width: 40, height: 40 }}>
                <i className='tabler-world text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card className='border-none shadow-sm bg-info/5 border border-info/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Hạ tầng Mỹ (USA)</Typography>
                <Typography variant='h5' className='font-black text-info'>{usPackages} gói khả dụng</Typography>
                <Typography variant='caption' color='textSecondary' className='text-[10px] block mt-1'>Tốc độ cao T-Mobile Roaming</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'info.tonal', color: 'info.main', width: 40, height: 40 }}>
                <i className='tabler-plane-departure text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Advanced Filters */}
      <Card className='border-none shadow-sm mbe-6'>
        <CardContent>
          <Grid2 container spacing={4} alignItems='center'>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Tìm kiếm gói</Typography>
              <TextField
                fullWidth
                size='small'
                placeholder='Nhập mã gói hoặc tên gói cước cần tìm...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Quốc gia</Typography>
              <Select fullWidth size='small' value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả quốc gia</MenuItem>
                <MenuItem value='Hồng Kông'>Hồng Kông</MenuItem>
                <MenuItem value='Mỹ'>Mỹ</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Loại (Type)</Typography>
              <Select fullWidth size='small' value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả các loại</MenuItem>
                <MenuItem value='Daily'>Daily (Theo ngày)</MenuItem>
                <MenuItem value='Total'>Total (Tổng dung lượng)</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Dung lượng</Typography>
              <Select fullWidth size='small' value={dataFilter} onChange={e => setDataFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả</MenuItem>
                {distinctDataCaps.map(cap => (
                  <MenuItem key={cap} value={cap}>{cap}</MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Số ngày</Typography>
              <Select fullWidth size='small' value={durationFilter} onChange={e => setDurationFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả</MenuItem>
                {distinctDurations.map(day => (
                  <MenuItem key={day} value={day.toString()}>{day} ngày</MenuItem>
                ))}
              </Select>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Packages Table (Personalized) */}
      <Card className='border-none shadow-sm overflow-hidden'>
        <TableContainer>
          <Table>
            <TableHead className='bg-slate-50'>
              <TableRow>
                <TableCell className='font-bold text-xs uppercase'>Mã gói cước</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Tên hiển thị gói</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Quốc gia / Hạ tầng</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Loại gói</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Dung lượng mạng</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Thời hạn</TableCell>
                <TableCell className='font-bold text-xs uppercase text-right'>Giá bán chuẩn lẻ</TableCell>
                <TableCell className='font-bold text-xs uppercase text-right bg-primary/5 text-primary border-l-2 border-primary'>Giá Đại lý của Bạn</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Quy tắc áp dụng</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg, idx) => {
                  const avatar = getSupplierAvatar(pkg.supplier)
                  const discountValue = (pkg.agentPrice * selectedAgent.discountPercent) / 100
                  const customPrice = pkg.agentPrice - discountValue

                  return (
                    <TableRow key={pkg.code || idx} hover>
                      <TableCell className='font-mono font-bold text-slate-800 text-xs'>{pkg.code}</TableCell>
                      <TableCell className='font-bold text-slate-700'>{pkg.name}</TableCell>
                      <TableCell>
                        <Box className='flex items-center gap-2'>
                          <Avatar 
                            variant='rounded' 
                            sx={{ 
                              backgroundColor: `${avatar.bg}15`, 
                              color: avatar.bg,
                              width: 26, 
                              height: 26,
                              fontSize: '11px',
                              fontWeight: '900'
                            }}
                          >
                            {avatar.char}
                          </Avatar>
                          <Typography variant='body2' className='font-bold' sx={{ color: avatar.bg }}>
                            {pkg.supplier}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pkg.type === 'Daily' ? 'Daily (reset ngày)' : 'Total (tổng dung lượng)'}
                          color={pkg.type === 'Daily' ? 'info' : 'warning'}
                          size='small'
                          variant='tonal'
                          className='font-bold text-[10px]'
                        />
                      </TableCell>
                      <TableCell className='font-semibold text-slate-600 text-xs'>{pkg.dataCap}</TableCell>
                      <TableCell className='text-center font-bold text-slate-700'>{pkg.duration} ngày</TableCell>
                      <TableCell className='text-right text-slate-400 font-medium text-xs decoration-slate-300 line-through'>
                        {pkg.agentPrice.toLocaleString('vi-VN')} đ
                      </TableCell>
                      <TableCell className='text-right bg-primary/5 border-l-2 border-primary'>
                        <Typography variant='subtitle2' className='font-black text-primary'>
                          {customPrice.toLocaleString('vi-VN')} đ
                        </Typography>
                        <Typography variant='caption' className='text-slate-400 text-[10px] block'>
                          Tiết kiệm: <b>-{discountValue.toLocaleString('vi-VN')} đ</b>
                        </Typography>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Chip 
                          label={`Cấp ${selectedAgent.tier} (-${selectedAgent.discountPercent}%)`} 
                          color={getTierColor(selectedAgent.tier) as any} 
                          size='small' 
                          variant='tonal'
                          className='font-bold text-[10px]'
                        />
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='contained'
                          color='primary'
                          size='small'
                          component={Link}
                          href='/agent/physical-sim/activation'
                          startIcon={<i className='tabler-bolt text-xs' />}
                          className='font-bold text-xs py-1 px-3'
                        >
                          Kích hoạt ngay
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align='center' sx={{ py: 6 }}>
                    <Typography color='textSecondary' variant='body2'>
                      Không tìm thấy gói cước nào khớp với cấu hình cần tìm.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
}

export default PhysicalSimPackagesView
