'use client'

import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
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
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'

import OrderDrawer from './OrderDrawer'

type OrderStatus = 'pending' | 'paid' | 'activated' | 'completed' | 'cancelled' | 'refunded'
type PaymentMethod = 'momo' | 'vnpay' | 'card' | 'bank_transfer' | 'wallet' | 'cod'
type SimType = 'esim' | 'physical'
type Channel = 'app' | 'web' | 'manual'

type Order = {
  id: string
  customer: { name: string; phone: string }
  package: { name: string; country: string; flag: string }
  simType: SimType
  qty: number
  amountVND: number
  payment: PaymentMethod
  status: OrderStatus
  channel: Channel
  createdAt: string
  activatedAt: string | null
}

const ORDERS: Order[] = [
  {
    id: 'ORD-202605-0148',
    customer: { name: 'Nguyễn Văn An', phone: '0901 234 567' },
    package: { name: 'eSIM đi Nhật Bản', country: 'Nhật Bản', flag: '🇯🇵' },
    simType: 'esim',
    qty: 1,
    amountVND: 149_000,
    payment: 'momo',
    status: 'completed',
    channel: 'app',
    createdAt: '2026-05-20 14:32',
    activatedAt: '2026-05-20 14:35'
  },
  {
    id: 'ORD-202605-0147',
    customer: { name: 'Phạm Quỳnh Như', phone: '0987 654 321' },
    package: { name: 'eSIM Châu Âu 30 nước', country: 'Châu Âu', flag: '🇪🇺' },
    simType: 'esim',
    qty: 2,
    amountVND: 798_000,
    payment: 'vnpay',
    status: 'activated',
    channel: 'app',
    createdAt: '2026-05-20 11:08',
    activatedAt: '2026-05-20 11:10'
  },
  {
    id: 'ORD-202605-0146',
    customer: { name: 'Sao Việt Travel', phone: '028 3822 1234' },
    package: { name: 'eSIM đi Hàn Quốc', country: 'Hàn Quốc', flag: '🇰🇷' },
    simType: 'esim',
    qty: 12,
    amountVND: 2_940_000,
    payment: 'bank_transfer',
    status: 'paid',
    channel: 'manual',
    createdAt: '2026-05-20 09:45',
    activatedAt: null
  },
  {
    id: 'ORD-202605-0145',
    customer: { name: 'Trần Thị Bích', phone: '0912 345 678' },
    package: { name: 'eSIM Đông Nam Á 8 nước', country: 'Đông Nam Á', flag: '🌏' },
    simType: 'esim',
    qty: 1,
    amountVND: 119_000,
    payment: 'momo',
    status: 'pending',
    channel: 'app',
    createdAt: '2026-05-20 08:22',
    activatedAt: null
  },
  {
    id: 'ORD-202605-0144',
    customer: { name: 'Lê Minh Chiến', phone: '0933 111 222' },
    package: { name: 'SIM vật lý đi Mỹ', country: 'Hoa Kỳ', flag: '🇺🇸' },
    simType: 'physical',
    qty: 1,
    amountVND: 599_000,
    payment: 'cod',
    status: 'paid',
    channel: 'web',
    createdAt: '2026-05-19 22:14',
    activatedAt: null
  },
  {
    id: 'ORD-202605-0143',
    customer: { name: 'Bùi Khánh Linh', phone: '0966 777 888' },
    package: { name: 'eSIM Toàn cầu 100 nước', country: 'Toàn cầu', flag: '🌐' },
    simType: 'esim',
    qty: 1,
    amountVND: 999_000,
    payment: 'card',
    status: 'completed',
    channel: 'app',
    createdAt: '2026-05-19 17:48',
    activatedAt: '2026-05-19 17:50'
  },
  {
    id: 'ORD-202605-0142',
    customer: { name: 'Travel Agent VN', phone: '024 7300 8989' },
    package: { name: 'eSIM đi Nhật Bản', country: 'Nhật Bản', flag: '🇯🇵' },
    simType: 'esim',
    qty: 25,
    amountVND: 3_725_000,
    payment: 'bank_transfer',
    status: 'activated',
    channel: 'manual',
    createdAt: '2026-05-19 15:30',
    activatedAt: '2026-05-19 16:12'
  },
  {
    id: 'ORD-202605-0141',
    customer: { name: 'Đỗ Tuấn Kiệt', phone: '0944 555 666' },
    package: { name: 'SIM vật lý đi Thái Lan', country: 'Thái Lan', flag: '🇹🇭' },
    simType: 'physical',
    qty: 1,
    amountVND: 199_000,
    payment: 'momo',
    status: 'cancelled',
    channel: 'app',
    createdAt: '2026-05-19 10:05',
    activatedAt: null
  },
  {
    id: 'ORD-202605-0140',
    customer: { name: 'Hoàng Văn Đạt', phone: '0978 222 333' },
    package: { name: 'eSIM đi Hàn Quốc', country: 'Hàn Quốc', flag: '🇰🇷' },
    simType: 'esim',
    qty: 1,
    amountVND: 245_000,
    payment: 'wallet',
    status: 'refunded',
    channel: 'app',
    createdAt: '2026-05-18 19:33',
    activatedAt: '2026-05-18 19:35'
  },
  {
    id: 'ORD-202605-0139',
    customer: { name: 'Nguyễn Văn An', phone: '0901 234 567' },
    package: { name: 'eSIM Đông Nam Á 8 nước', country: 'Đông Nam Á', flag: '🌏' },
    simType: 'esim',
    qty: 1,
    amountVND: 119_000,
    payment: 'momo',
    status: 'completed',
    channel: 'app',
    createdAt: '2026-05-18 14:02',
    activatedAt: '2026-05-18 14:05'
  }
]

const KPI_CONFIG = [
  { key: 'total', label: 'Tổng đơn', icon: 'tabler-shopping-cart', color: 'primary' as const },
  { key: 'success', label: 'Đã hoàn tất', icon: 'tabler-circle-check', color: 'success' as const },
  { key: 'processing', label: 'Đang xử lý', icon: 'tabler-clock', color: 'warning' as const },
  { key: 'revenue', label: 'Doanh thu (VND)', icon: 'tabler-cash', color: 'info' as const }
]

const statusMeta: Record<OrderStatus, { label: string; color: 'warning' | 'info' | 'success' | 'error' | 'secondary' }> = {
  pending: { label: 'Chờ thanh toán', color: 'warning' },
  paid: { label: 'Đã thanh toán', color: 'info' },
  activated: { label: 'Đã kích hoạt', color: 'info' },
  completed: { label: 'Hoàn tất', color: 'success' },
  cancelled: { label: 'Đã huỷ', color: 'secondary' },
  refunded: { label: 'Hoàn tiền', color: 'error' }
}

const paymentMeta: Record<PaymentMethod, { label: string; icon: string }> = {
  momo: { label: 'MoMo', icon: 'tabler-brand-mantine' },
  vnpay: { label: 'VNPay', icon: 'tabler-credit-card-pay' },
  card: { label: 'Thẻ', icon: 'tabler-credit-card' },
  bank_transfer: { label: 'Chuyển khoản', icon: 'tabler-building-bank' },
  wallet: { label: 'Ví agent', icon: 'tabler-wallet' },
  cod: { label: 'COD', icon: 'tabler-cash' }
}

const channelLabel: Record<Channel, string> = {
  app: 'App',
  web: 'Website',
  manual: 'Tạo tay'
}

const AgentOrdersView = () => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [payment, setPayment] = useState('all')
  const [simType, setSimType] = useState('all')
  const [channel, setChannel] = useState('all')
  const [timeRange, setTimeRange] = useState('all')

  const filtered = useMemo(() => {
    const now = Date.now()
    const ranges: Record<string, number> = {
      today: 1,
      '7d': 7,
      '30d': 30,
      '90d': 90
    }
    return ORDERS.filter(o => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q) ||
        o.package.name.toLowerCase().includes(q)
      const matchTime =
        timeRange === 'all' ||
        (ranges[timeRange] !== undefined &&
          now - new Date(o.createdAt).getTime() <= ranges[timeRange] * 86_400_000)
      return (
        matchSearch &&
        (status === 'all' || o.status === status) &&
        (payment === 'all' || o.payment === payment) &&
        (simType === 'all' || o.simType === simType) &&
        (channel === 'all' || o.channel === channel) &&
        matchTime
      )
    })
  }, [search, status, payment, simType, channel, timeRange])

  const kpis = useMemo(() => {
    return {
      total: ORDERS.length,
      success: ORDERS.filter(o => o.status === 'completed' || o.status === 'activated').length,
      processing: ORDERS.filter(o => o.status === 'pending' || o.status === 'paid').length,
      revenue: ORDERS.filter(o => o.status !== 'cancelled' && o.status !== 'refunded').reduce(
        (s, o) => s + o.amountVND,
        0
      )
    }
  }, [])

  const formatKpiValue = (key: string, val: number) =>
    key === 'revenue' ? `${(val / 1_000_000).toFixed(1)}M` : val.toLocaleString('vi-VN')

  const activeFilterCount = [status, payment, simType, channel, timeRange].filter(v => v !== 'all').length

  const resetFilters = () => {
    setSearch('')
    setStatus('all')
    setPayment('all')
    setSimType('all')
    setChannel('all')
    setTimeRange('all')
  }

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Quản lý đơn hàng
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Danh sách đơn hàng phát sinh trên app — eSIM kích hoạt tự động, SIM vật lý cần xử lý giao hàng.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>
            Xuất Excel
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

      {/* Filter + Table */}
      <Card variant='outlined'>
        <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box className='flex items-center gap-3 mbe-3'>
            <TextField
              size='small'
              placeholder='Tìm theo mã đơn, tên/SĐT khách, tên gói...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ flex: 1, maxWidth: 420 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-search text-[18px]' />
                  </InputAdornment>
                )
              }}
            />
            <Box className='flex-1' />
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
              Hiển thị <strong>{filtered.length}</strong> / {ORDERS.length} đơn
            </Typography>
          </Box>

          <Box className='grid gap-3' sx={{ gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' } }}>
            <TextField size='small' select label='Thời gian' value={timeRange} onChange={e => setTimeRange(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='today'>Hôm nay</MenuItem>
              <MenuItem value='7d'>7 ngày qua</MenuItem>
              <MenuItem value='30d'>30 ngày qua</MenuItem>
              <MenuItem value='90d'>90 ngày qua</MenuItem>
            </TextField>
            <TextField size='small' select label='Trạng thái' value={status} onChange={e => setStatus(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='pending'>Chờ thanh toán</MenuItem>
              <MenuItem value='paid'>Đã thanh toán</MenuItem>
              <MenuItem value='activated'>Đã kích hoạt</MenuItem>
              <MenuItem value='completed'>Hoàn tất</MenuItem>
              <MenuItem value='cancelled'>Đã huỷ</MenuItem>
              <MenuItem value='refunded'>Hoàn tiền</MenuItem>
            </TextField>
            <TextField size='small' select label='Loại SIM' value={simType} onChange={e => setSimType(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='esim'>eSIM</MenuItem>
              <MenuItem value='physical'>SIM vật lý</MenuItem>
            </TextField>
            <TextField size='small' select label='Thanh toán' value={payment} onChange={e => setPayment(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='momo'>MoMo</MenuItem>
              <MenuItem value='vnpay'>VNPay</MenuItem>
              <MenuItem value='card'>Thẻ</MenuItem>
              <MenuItem value='bank_transfer'>Chuyển khoản</MenuItem>
              <MenuItem value='wallet'>Ví agent</MenuItem>
              <MenuItem value='cod'>COD</MenuItem>
            </TextField>
            <TextField size='small' select label='Kênh' value={channel} onChange={e => setChannel(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='app'>App</MenuItem>
              <MenuItem value='web'>Website</MenuItem>
              <MenuItem value='manual'>Tạo tay</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Gói cước</TableCell>
                <TableCell>Loại SIM</TableCell>
                <TableCell align='right'>Số lượng</TableCell>
                <TableCell align='right'>Tổng tiền</TableCell>
                <TableCell>Thanh toán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell align='right'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{o.id}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {channelLabel[o.channel]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {o.customer.name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {o.customer.phone}
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
                        {o.package.flag}
                      </Box>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                          {o.package.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {o.package.country}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={o.simType === 'esim' ? 'primary' : 'warning'}
                      label={o.simType === 'esim' ? 'eSIM' : 'Vật lý'}
                      icon={<i className={`${o.simType === 'esim' ? 'tabler-device-mobile' : 'tabler-device-sd-card'} text-[14px]`} />}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <Typography sx={{ fontWeight: 600 }}>{o.qty}</Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography sx={{ fontWeight: 600 }}>
                      {o.amountVND.toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box className='flex items-center gap-2'>
                      <i className={`${paymentMeta[o.payment].icon} text-[16px] text-[var(--mui-palette-text-secondary)]`} />
                      <Typography variant='body2'>{paymentMeta[o.payment].label}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={statusMeta[o.status].color}
                      label={statusMeta[o.status].label}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{o.createdAt.split(' ')[0]}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {o.createdAt.split(' ')[1]}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                      <Tooltip title='Xem chi tiết'>
                        <IconButton size='small' onClick={() => setActiveOrder(o)}>
                          <i className='tabler-eye text-[20px]' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='In hoá đơn'>
                        <IconButton size='small'>
                          <i className='tabler-printer text-[20px]' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Thêm'>
                        <IconButton size='small'>
                          <i className='tabler-dots-vertical text-[20px]' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>Không có đơn hàng nào khớp bộ lọc.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <OrderDrawer
        open={!!activeOrder}
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        paymentLabel={activeOrder ? paymentMeta[activeOrder.payment].label : ''}
        channelLabel={activeOrder ? channelLabel[activeOrder.channel] : ''}
        statusMeta={activeOrder ? statusMeta[activeOrder.status] : { label: '', color: 'secondary' }}
      />
    </Box>
  )
}

export default AgentOrdersView
