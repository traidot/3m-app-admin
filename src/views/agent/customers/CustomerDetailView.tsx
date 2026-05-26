'use client'

import { useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Tooltip from '@mui/material/Tooltip'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'

import { CUSTOMERS, channelLabel, daysAgo, initials, statusChip, typeChip, type Customer } from './data'
import CustomerDrawer, { type DrawerMode } from './CustomerDrawer'
import { COUPONS, STATUS_META, type Coupon } from '../coupons/data'

type Props = { customerId: string }

const RECENT_ORDERS = [
  { id: 'ORD-202605-0148', date: '2026-05-20', package: 'eSIM đi Nhật Bản', country: '🇯🇵 Nhật Bản', amount: 149_000, status: 'Hoàn tất' as const, color: 'success' as const },
  { id: 'ORD-202605-0139', date: '2026-05-18', package: 'eSIM Đông Nam Á 8 nước', country: '🌏 Đông Nam Á', amount: 119_000, status: 'Hoàn tất' as const, color: 'success' as const },
  { id: 'ORD-202604-0098', date: '2026-04-15', package: 'eSIM đi Hàn Quốc', country: '🇰🇷 Hàn Quốc', amount: 245_000, status: 'Hoàn tất' as const, color: 'success' as const },
  { id: 'ORD-202603-0061', date: '2026-03-22', package: 'eSIM Châu Âu 30 nước', country: '🇪🇺 Châu Âu', amount: 399_000, status: 'Hoàn tất' as const, color: 'success' as const },
  { id: 'ORD-202602-0024', date: '2026-02-08', package: 'eSIM đi Nhật Bản', country: '🇯🇵 Nhật Bản', amount: 149_000, status: 'Đã kích hoạt' as const, color: 'info' as const }
]

type ESimStatus = 'purchased' | 'active' | 'expired' | 'cancelled'

const ESIM_STATUS_META: Record<ESimStatus, { label: string; color: 'info' | 'success' | 'secondary' | 'error'; icon: string }> = {
  purchased: { label: 'Đã mua', color: 'info', icon: 'tabler-shopping-cart' },
  active: { label: 'Đang dùng', color: 'success', icon: 'tabler-broadcast' },
  expired: { label: 'Hết hạn', color: 'secondary', icon: 'tabler-clock-off' },
  cancelled: { label: 'Đã huỷ', color: 'error', icon: 'tabler-ban' }
}

const CUSTOMER_ESIMS: {
  iccid: string
  country: string
  plan: string
  orderId: string
  purchasedAt: string
  activatedAt: string | null
  expiresAt: string | null
  status: ESimStatus
}[] = [
  {
    iccid: '8984 0420 1234 5678 901',
    country: '🇯🇵 Nhật Bản',
    plan: '5GB / 7 ngày',
    orderId: 'ORD-202605-0148',
    purchasedAt: '2026-05-20 14:32',
    activatedAt: '2026-05-20 14:35',
    expiresAt: '2026-05-27',
    status: 'active'
  },
  {
    iccid: '8984 0420 1234 5678 902',
    country: '🇪🇺 Châu Âu',
    plan: '5GB / 30 ngày',
    orderId: 'ORD-202603-0061',
    purchasedAt: '2026-03-22 17:48',
    activatedAt: '2026-03-22 18:00',
    expiresAt: '2026-04-21',
    status: 'expired'
  },
  {
    iccid: '8984 0420 1234 5678 903',
    country: '🇰🇷 Hàn Quốc',
    plan: '10GB / 15 ngày',
    orderId: 'ORD-202604-0098',
    purchasedAt: '2026-04-15 17:48',
    activatedAt: null,
    expiresAt: null,
    status: 'purchased'
  }
]

const ACTIVITY: { date: string; type: 'order' | 'note' | 'support' | 'login' | 'tier'; title: string; description?: string }[] = [
  { date: '2026-05-21 08:15', type: 'login', title: 'Đăng nhập app', description: 'iPhone 15 · iOS 18.2' },
  { date: '2026-05-20 14:35', type: 'order', title: 'Đặt đơn ORD-202605-0148', description: 'eSIM đi Nhật Bản · 149.000đ' },
  { date: '2026-05-15 10:02', type: 'support', title: 'Gửi yêu cầu hỗ trợ', description: 'Câu hỏi về kích hoạt eSIM' },
  { date: '2026-04-15 17:48', type: 'order', title: 'Đặt đơn ORD-202604-0098', description: 'eSIM đi Hàn Quốc · 245.000đ' },
  { date: '2026-03-10 09:30', type: 'tier', title: 'Nâng hạng VIP', description: 'Đạt mốc 5 đơn hàng' },
  { date: '2025-08-12 11:00', type: 'note', title: 'Đăng ký tài khoản', description: 'Kênh: App' }
]

const ACTIVITY_META: Record<typeof ACTIVITY[number]['type'], { icon: string; color: 'primary' | 'info' | 'warning' | 'success' | 'secondary' }> = {
  order: { icon: 'tabler-shopping-cart', color: 'success' },
  note: { icon: 'tabler-note', color: 'secondary' },
  support: { icon: 'tabler-headset', color: 'warning' },
  login: { icon: 'tabler-login', color: 'info' },
  tier: { icon: 'tabler-crown', color: 'primary' }
}

const NOTES = [
  { id: 'n1', author: 'Trần Thanh Hà', avatar: 'TH', date: '2026-05-15 10:30', content: 'Khách hàng VIP, hỗ trợ kích hoạt qua Zalo. Đã gửi hướng dẫn cụ thể.' },
  { id: 'n2', author: 'Lê Hoàng Sơn', avatar: 'HS', date: '2026-04-22 14:12', content: 'Khách phản hồi tốt về tốc độ kích hoạt eSIM.' }
]

type VoucherStatus = 'used' | 'available' | 'expired'
const VOUCHER_STATUS_META: Record<VoucherStatus, { label: string; color: 'success' | 'info' | 'secondary'; icon: string }> = {
  used:      { label: 'Đã dùng',    color: 'success',   icon: 'tabler-circle-check' },
  available: { label: 'Chưa dùng',  color: 'info',      icon: 'tabler-clock' },
  expired:   { label: 'Hết hạn',   color: 'secondary', icon: 'tabler-clock-off' },
}

const CUSTOMER_VOUCHERS: {
  id: string
  code: string
  campaignName: string
  type: 'percent' | 'fixed'
  value: number
  sentAt: string
  expireAt: string | null
  usedAt: string | null
  status: VoucherStatus
  sentBy: string
}[] = [
  { id: 'v1', code: 'VIP25',      campaignName: 'Ưu đãi khách VIP',           type: 'percent', value: 25,     sentAt: '2026-05-20', expireAt: null,         usedAt: '2026-05-20', status: 'used',      sentBy: 'Hệ thống' },
  { id: 'v2', code: 'SUMMER2026', campaignName: 'Khách hàng hè 2026',          type: 'percent', value: 15,     sentAt: '2026-05-01', expireAt: '2026-08-31', usedAt: null,         status: 'available', sentBy: 'Trần Thanh Hà' },
  { id: 'v3', code: 'JP10',       campaignName: 'Giảm giá gói Nhật Bản',       type: 'percent', value: 10,     sentAt: '2026-05-15', expireAt: '2026-06-15', usedAt: null,         status: 'available', sentBy: 'Hệ thống' },
  { id: 'v4', code: 'WELCOME50K', campaignName: 'Chào mừng đăng ký',           type: 'fixed',   value: 50000,  sentAt: '2025-08-12', expireAt: null,         usedAt: '2025-09-01', status: 'used',      sentBy: 'Hệ thống' },
  { id: 'v5', code: 'BLACKFRIDAY',campaignName: 'Black Friday 2025',           type: 'percent', value: 30,     sentAt: '2025-11-25', expireAt: '2025-12-01', usedAt: null,         status: 'expired',   sentBy: 'Hệ thống' },
]

type PointTxnType = 'earn' | 'redeem' | 'adjust' | 'expire'

const POINT_TXN_META: Record<PointTxnType, { label: string; color: 'success' | 'info' | 'warning' | 'secondary'; icon: string }> = {
  earn: { label: 'Tích luỹ', color: 'success', icon: 'tabler-plus' },
  redeem: { label: 'Đổi quà', color: 'info', icon: 'tabler-gift' },
  adjust: { label: 'Điều chỉnh', color: 'warning', icon: 'tabler-edit' },
  expire: { label: 'Hết hạn', color: 'secondary', icon: 'tabler-clock-off' }
}

const POINT_HISTORY: { id: string; date: string; type: PointTxnType; title: string; ref?: string; delta: number; balance: number }[] = [
  { id: 'p1', date: '2026-05-20 14:35', type: 'earn', title: 'Đơn ORD-202605-0148', ref: 'eSIM đi Nhật Bản · 149.000đ', delta: 149, balance: 4_280 },
  { id: 'p2', date: '2026-05-18 14:05', type: 'earn', title: 'Đơn ORD-202605-0139', ref: 'eSIM Đông Nam Á · 119.000đ', delta: 119, balance: 4_131 },
  { id: 'p3', date: '2026-05-10 09:00', type: 'redeem', title: 'Đổi voucher 50K', ref: 'VC-COUPON-50K', delta: -500, balance: 4_012 },
  { id: 'p4', date: '2026-04-15 17:50', type: 'earn', title: 'Đơn ORD-202604-0098', ref: 'eSIM đi Hàn Quốc · 245.000đ', delta: 245, balance: 4_512 },
  { id: 'p5', date: '2026-03-22 18:00', type: 'earn', title: 'Đơn ORD-202603-0061', ref: 'eSIM Châu Âu · 399.000đ', delta: 399, balance: 4_267 },
  { id: 'p6', date: '2026-03-10 09:30', type: 'adjust', title: 'Thưởng nâng hạng VIP', ref: 'Bonus tier upgrade', delta: 1_000, balance: 3_868 },
  { id: 'p7', date: '2026-02-08 14:05', type: 'earn', title: 'Đơn ORD-202602-0024', ref: 'eSIM đi Nhật Bản · 149.000đ', delta: 149, balance: 2_868 },
  { id: 'p8', date: '2026-01-31 23:59', type: 'expire', title: 'Hết hạn điểm 2025', ref: 'Điểm tích luỹ năm 2025 hết hạn', delta: -340, balance: 2_719 }
]

const TIER_THRESHOLDS = [
  { tier: 'Đồng', from: 0, to: 1_000, color: '#CD7F32' },
  { tier: 'Bạc', from: 1_000, to: 3_000, color: '#C0C0C0' },
  { tier: 'Vàng', from: 3_000, to: 7_000, color: '#F59E0B' },
  { tier: 'Bạch kim', from: 7_000, to: 15_000, color: '#A78BFA' }
] as const

const POINTS_BALANCE = 4_280
const POINTS_EARNED_LIFETIME = 6_120
const POINTS_REDEEMED_LIFETIME = 1_840
const POINTS_EXPIRING_NEXT = 340 // tháng tới

const CustomerDetailView = ({ customerId }: Props) => {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS)
  const [tab, setTab] = useState<'overview' | 'orders' | 'esims' | 'points' | 'vouchers' | 'notes' | 'activity'>('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('edit')
  const [newNote, setNewNote] = useState('')
  const [voucherOpen, setVoucherOpen] = useState(false)

  const customer = useMemo(() => customers.find(c => c.id === customerId), [customers, customerId])

  if (!customer) {
    return (
      <Box>
        <Card variant='outlined'>
          <CardContent className='text-center' sx={{ py: 8 }}>
            <Typography variant='h6'>Không tìm thấy khách hàng</Typography>
            <Typography variant='body2' color='text.secondary' className='mbe-4'>
              Khách hàng với mã <strong>{customerId}</strong> không tồn tại.
            </Typography>
            <Button variant='contained' component={Link} href='/agent/customers'>
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  const handleSave = (next: Customer) => {
    setCustomers(prev => prev.map(c => (c.id === next.id ? next : c)))
  }

  const aov = customer.orders > 0 ? Math.round(customer.totalSpentVND / customer.orders) : 0

  return (
    <Box>
      {/* Breadcrumb + back */}
      <Box className='flex items-center justify-between mbe-4 flex-wrap gap-2'>
        <Box className='flex items-center gap-2'>
          <IconButton size='small' onClick={() => router.push('/agent/customers')}>
            <i className='tabler-arrow-left text-[20px]' />
          </IconButton>
          <Breadcrumbs separator='/' aria-label='breadcrumb'>
            <Link href='/agent/customers' style={{ color: 'var(--mui-palette-text-secondary)', textDecoration: 'none' }}>
              Khách hàng
            </Link>
            <Typography color='text.primary' sx={{ fontWeight: 500 }}>
              {customer.name}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Stack direction='row' spacing={1.5}>
          <Button
            variant='contained'
            startIcon={<i className='tabler-pencil' />}
            onClick={() => {
              setDrawerMode('edit')
              setDrawerOpen(true)
            }}
          >
            Chỉnh sửa
          </Button>
        </Stack>
      </Box>

      {/* Profile + Stats */}
      <Grid2 container spacing={4} className='mbe-4'>
        {/* Profile card */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ height: '100%' }}>
            <CardContent>
              <Box className='flex items-center gap-3 mbe-4'>
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: `rgba(var(--mui-palette-primary-mainChannel) / 0.12)`,
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: 24
                  }}
                >
                  {initials(customer.name)}
                </Avatar>
                <Box className='flex-1 min-is-0'>
                  <Typography variant='h5' className='font-bold' noWrap>
                    {customer.name}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {customer.id}
                  </Typography>
                  <Box className='flex items-center gap-2 mbs-1 flex-wrap'>
                    {typeChip(customer.type)}
                    {statusChip(customer.status)}
                  </Box>
                </Box>
              </Box>


            </CardContent>
          </Card>
        </Grid2>

        {/* Stats card */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Grid2 container spacing={4} sx={{ height: '100%' }}>
            <StatCard label='Tổng số đơn' value={customer.orders.toString()} icon='tabler-shopping-cart' color='primary' />
            <StatCard
              label='Tổng chi tiêu'
              value={`${(customer.totalSpentVND / 1_000_000).toFixed(1)}M`}
              suffix='đ'
              icon='tabler-cash'
              color='success'
            />
            <StatCard
              label='Giá trị TB / đơn'
              value={aov > 0 ? `${(aov / 1_000).toFixed(0)}K` : '—'}
              suffix={aov > 0 ? 'đ' : undefined}
              icon='tabler-chart-bar'
              color='info'
            />
            <StatCard
              label='Lần mua gần nhất'
              value={customer.lastOrderAt ?? 'Chưa mua'}
              caption={customer.lastOrderAt ? daysAgo(customer.lastOrderAt) ?? undefined : undefined}
              icon='tabler-clock'
              color='warning'
            />
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Tabs */}
      <Card variant='outlined'>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tab value='overview' label='Tổng quan' />
          <Tab value='orders' label={`Đơn hàng (${customer.orders})`} />
          <Tab value='esims' label={`eSIM đã mua (${CUSTOMER_ESIMS.length})`} />
          <Tab value='points' label={`Điểm tích luỹ (${POINTS_BALANCE.toLocaleString('vi-VN')})`} />
          <Tab value='vouchers' label={`Voucher (${CUSTOMER_VOUCHERS.length})`} />
          <Tab value='notes' label={`Ghi chú (${NOTES.length})`} />
          <Tab value='activity' label='Hoạt động' />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {tab === 'overview' && (
            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant='subtitle2' className='uppercase mbe-3' sx={{ letterSpacing: 0.8 }}>
                  Đơn hàng gần đây
                </Typography>
                <Stack spacing={1.5}>
                  {RECENT_ORDERS.slice(0, 3).map(o => (
                    <Box
                      key={o.id}
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2
                      }}
                    >
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {o.id}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {o.date} · {o.country}
                        </Typography>
                      </Box>
                      <Box className='text-right'>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {o.amount.toLocaleString('vi-VN')}đ
                        </Typography>
                        <Chip size='small' variant='tonal' color={o.color} label={o.status} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant='subtitle2' className='uppercase mbe-3' sx={{ letterSpacing: 0.8 }}>
                  Hoạt động gần đây
                </Typography>
                <Stack spacing={2}>
                  {ACTIVITY.slice(0, 4).map((a, i) => {
                    const meta = ACTIVITY_META[a.type]
                    return (
                      <Box key={i} className='flex items-start gap-3'>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: `rgba(var(--mui-palette-${meta.color}-mainChannel) / 0.10)`,
                            color: `${meta.color}.main`,
                            flexShrink: 0
                          }}
                        >
                          <i className={`${meta.icon} text-[16px]`} />
                        </Box>
                        <Box className='flex-1'>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {a.title}
                          </Typography>
                          {a.description && (
                            <Typography variant='caption' color='text.secondary' className='block'>
                              {a.description}
                            </Typography>
                          )}
                          <Typography variant='caption' color='text.disabled'>
                            {a.date}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  })}
                </Stack>
              </Grid2>
            </Grid2>
          )}

          {tab === 'orders' && (
            <Table size='medium'>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn</TableCell>
                  <TableCell>Gói cước</TableCell>
                  <TableCell>Ngày đặt</TableCell>
                  <TableCell align='right'>Số tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align='right'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {RECENT_ORDERS.map(o => (
                  <TableRow key={o.id} hover>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {o.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {o.package}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {o.country}
                      </Typography>
                    </TableCell>
                    <TableCell>{o.date}</TableCell>
                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 600 }}>{o.amount.toLocaleString('vi-VN')}đ</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size='small' variant='tonal' color={o.color} label={o.status} />
                    </TableCell>
                    <TableCell align='right'>
                      <Tooltip title='Xem chi tiết'>
                        <IconButton size='small'>
                          <i className='tabler-eye text-[18px]' />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {tab === 'esims' && (
            <Stack spacing={2}>
              {CUSTOMER_ESIMS.map(e => {
                const meta = ESIM_STATUS_META[e.status]
                return (
                  <Box
                    key={e.iccid}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box className='flex items-start justify-between mbe-3 flex-wrap gap-2'>
                      <Box>
                        <Typography variant='body1' sx={{ fontWeight: 700 }}>
                          {e.country} · {e.plan}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' sx={{ fontFamily: 'monospace' }}>
                          ICCID: {e.iccid}
                        </Typography>
                      </Box>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={meta.color}
                        label={meta.label}
                        icon={<i className={`${meta.icon} text-[14px]`} />}
                      />
                    </Box>
                    <Grid2 container spacing={3}>
                      <ESimInfoCell label='Mã đơn' value={e.orderId} mono />
                      <ESimInfoCell label='Ngày mua' value={e.purchasedAt} />
                      <ESimInfoCell
                        label='Ngày kích hoạt'
                        value={e.activatedAt ?? 'Chưa kích hoạt'}
                        muted={!e.activatedAt}
                      />
                      <ESimInfoCell
                        label='Ngày hết hạn'
                        value={e.expiresAt ?? '—'}
                        muted={!e.expiresAt}
                      />
                    </Grid2>
                  </Box>
                )
              })}
            </Stack>
          )}

          {tab === 'points' && <PointsTab />}

          {tab === 'vouchers' && (
            <Stack spacing={2}>
              <Box className='flex items-center justify-between'>
                <Typography variant='subtitle2' sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>Danh sách Voucher đã nhận</Typography>
                <Button size='small' variant='tonal' color='primary' startIcon={<i className='tabler-gift' />} onClick={() => setVoucherOpen(true)}>
                  Tặng voucher mới
                </Button>
              </Box>
              {CUSTOMER_VOUCHERS.map(v => {
                const sm = VOUCHER_STATUS_META[v.status]
                const isUsed = v.status === 'used'
                const isExpired = v.status === 'expired'
                return (
                  <Box key={v.id} sx={{
                    p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider',
                    display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap',
                    opacity: isExpired ? 0.6 : 1,
                    transition: 'all 0.15s',
                    '&:hover': { borderColor: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
                  }}>
                    {/* Icon */}
                    <Box sx={{
                      width: 44, height: 44, borderRadius: 1.5, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: isUsed
                        ? 'rgba(var(--mui-palette-success-mainChannel)/0.10)'
                        : isExpired
                        ? 'action.hover'
                        : 'rgba(var(--mui-palette-primary-mainChannel)/0.10)',
                      color: isUsed ? 'success.main' : isExpired ? 'text.disabled' : 'primary.main'
                    }}>
                      <i className='tabler-ticket text-[22px]' />
                    </Box>

                    {/* Code + campaign */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box className='flex items-center gap-2 flex-wrap'>
                        <Typography sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.95rem', letterSpacing: 1 }}>
                          {v.code}
                        </Typography>
                        <Chip
                          size='small'
                          variant='tonal'
                          color={v.type === 'percent' ? 'primary' : 'success'}
                          label={v.type === 'percent' ? `−${v.value}%` : `−${v.value.toLocaleString('vi-VN')}đ`}
                          sx={{ fontWeight: 700 }}
                        />
                        <Chip
                          size='small'
                          variant='tonal'
                          color={sm.color}
                          label={sm.label}
                          icon={<i className={`${sm.icon} text-[13px]`} />}
                        />
                      </Box>
                      <Typography variant='caption' color='text.secondary'>{v.campaignName}</Typography>
                    </Box>

                    {/* Meta info */}
                    <Stack spacing={0.5} sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography variant='caption' color='text.secondary'>
                        Gửi: <strong>{v.sentAt}</strong> bởi {v.sentBy}
                      </Typography>
                      {v.usedAt && (
                        <Typography variant='caption' color='success.main'>
                          ✓ Dùng: {v.usedAt}
                        </Typography>
                      )}
                      {!v.usedAt && v.expireAt && (
                        <Typography variant='caption' color={isExpired ? 'text.disabled' : 'warning.main'}>
                          HSD: {v.expireAt}
                        </Typography>
                      )}
                      {!v.usedAt && !v.expireAt && !isExpired && (
                        <Typography variant='caption' color='text.secondary'>Không hết hạn</Typography>
                      )}
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          )}

          {tab === 'notes' && (
            <Stack spacing={3}>
              {/* Add note */}
              <Box>
                <TextField
                  size='small'
                  fullWidth
                  multiline
                  rows={2}
                  placeholder='Thêm ghi chú về khách hàng...'
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                />
                <Box className='flex justify-end mbs-2'>
                  <Button
                    variant='contained'
                    size='small'
                    disabled={!newNote.trim()}
                    startIcon={<i className='tabler-plus text-[16px]' />}
                  >
                    Thêm ghi chú
                  </Button>
                </Box>
              </Box>
              <Divider />
              {NOTES.map(n => (
                <Box key={n.id} className='flex items-start gap-3'>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: `rgba(var(--mui-palette-primary-mainChannel) / 0.12)`,
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: 13
                    }}
                  >
                    {n.avatar}
                  </Avatar>
                  <Box className='flex-1'>
                    <Box className='flex items-center gap-2 mbe-1'>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {n.author}
                      </Typography>
                      <Typography variant='caption' color='text.disabled'>
                        {n.date}
                      </Typography>
                    </Box>
                    <Typography variant='body2' color='text.secondary'>
                      {n.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}

          {tab === 'activity' && (
            <Stack spacing={3}>
              {ACTIVITY.map((a, i) => {
                const meta = ACTIVITY_META[a.type]
                return (
                  <Box key={i} className='flex items-start gap-3'>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `rgba(var(--mui-palette-${meta.color}-mainChannel) / 0.10)`,
                        color: `${meta.color}.main`,
                        flexShrink: 0
                      }}
                    >
                      <i className={`${meta.icon} text-[18px]`} />
                    </Box>
                    <Box className='flex-1'>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {a.title}
                      </Typography>
                      {a.description && (
                        <Typography variant='caption' color='text.secondary' className='block'>
                          {a.description}
                        </Typography>
                      )}
                      <Typography variant='caption' color='text.disabled'>
                        {a.date}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          )}
        </Box>
      </Card>

      <CustomerDrawer
        open={drawerOpen}
        mode={drawerMode}
        customer={customer}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        onSwitchMode={setDrawerMode}
      />

      <GiftVoucherDialog
        open={voucherOpen}
        customer={customer}
        onClose={() => setVoucherOpen(false)}
      />
    </Box>
  )
}

const PointsTab = () => {
  const currentTier = TIER_THRESHOLDS.find(t => POINTS_BALANCE >= t.from && POINTS_BALANCE < t.to) ?? TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1]
  const nextTier = TIER_THRESHOLDS[TIER_THRESHOLDS.indexOf(currentTier) + 1]
  const progressPct = nextTier
    ? Math.round(((POINTS_BALANCE - currentTier.from) / (currentTier.to - currentTier.from)) * 100)
    : 100

  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add')
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustReason, setAdjustReason] = useState('')
  const [adjustNote, setAdjustNote] = useState('')

  const handleAdjustSubmit = useCallback(() => {
    // In real app: call API to adjust points
    console.log({ adjustType, adjustAmount, adjustReason, adjustNote })
    setAdjustOpen(false)
    setAdjustAmount('')
    setAdjustReason('')
    setAdjustNote('')
  }, [adjustType, adjustAmount, adjustReason, adjustNote])

  return (
    <Stack spacing={4}>
      {/* Summary cards */}
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <Box className='flex items-center gap-3 mbe-3'>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${currentTier.color}22`,
                  color: currentTier.color
                }}
              >
                <i className='tabler-crown text-[26px]' />
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Hạng hiện tại
                </Typography>
                <Typography variant='h5' className='font-bold' sx={{ color: currentTier.color }}>
                  {currentTier.tier}
                </Typography>
              </Box>
            </Box>
            {nextTier && (
              <>
                <Box className='flex items-center justify-between mbe-1'>
                  <Typography variant='caption' color='text.secondary'>
                    Còn {(nextTier.from - POINTS_BALANCE).toLocaleString('vi-VN')} điểm lên hạng{' '}
                    <strong>{nextTier.tier}</strong>
                  </Typography>
                  <Typography variant='caption' sx={{ fontWeight: 600 }}>
                    {progressPct}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'action.hover',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${progressPct}%`,
                      backgroundColor: currentTier.color
                    }}
                  />
                </Box>
              </>
            )}
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography variant='caption' color='text.secondary'>
              Điểm khả dụng
            </Typography>
            <Box className='flex items-baseline gap-2'>
              <Typography variant='h3' className='font-black' color='primary'>
                {POINTS_BALANCE.toLocaleString('vi-VN')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                điểm
              </Typography>
            </Box>
            {POINTS_EXPIRING_NEXT > 0 && (
              <Box className='flex items-center gap-1 mbs-2'>
                <i className='tabler-clock-exclamation text-[16px] text-[var(--mui-palette-warning-main)]' />
                <Typography variant='caption' color='warning.main'>
                  {POINTS_EXPIRING_NEXT.toLocaleString('vi-VN')} điểm sẽ hết hạn tháng tới
                </Typography>
              </Box>
            )}
          </Box>
        </Grid2>

        <Grid2 size={6}>
          <Box
            sx={{ p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}
          >
            <Typography variant='caption' color='text.secondary'>
              Đã tích luỹ
            </Typography>
            <Typography variant='h5' className='font-bold' color='success.main'>
              +{POINTS_EARNED_LIFETIME.toLocaleString('vi-VN')}
            </Typography>
          </Box>
        </Grid2>
        <Grid2 size={6}>
          <Box
            sx={{ p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}
          >
            <Typography variant='caption' color='text.secondary'>
              Đã đổi
            </Typography>
            <Typography variant='h5' className='font-bold' color='info.main'>
              −{POINTS_REDEEMED_LIFETIME.toLocaleString('vi-VN')}
            </Typography>
          </Box>
        </Grid2>
      </Grid2>

      <Divider />

      {/* History table */}
      <Box>
        <Box className='flex items-center justify-between mbe-3'>
          <Typography variant='subtitle2' className='uppercase' sx={{ letterSpacing: 0.8 }}>
            Lịch sử giao dịch điểm
          </Typography>
          <Button
            size='small'
            variant='contained'
            color='warning'
            startIcon={<i className='tabler-adjustments-horizontal' />}
            onClick={() => setAdjustOpen(true)}
          >
            Hiệu chỉnh số điểm
          </Button>
        </Box>

        {/* Adjust Points Dialog */}
        <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)} maxWidth='xs' fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box className='flex items-center gap-2'>
              <Box sx={{
                width: 36, height: 36, borderRadius: 1.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(var(--mui-palette-warning-mainChannel) / 0.12)',
                color: 'warning.main'
              }}>
                <i className='tabler-adjustments-horizontal text-[20px]' />
              </Box>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>Hiệu chỉnh số điểm</Typography>
                <Typography variant='caption' color='text.secondary'>Số dư hiện tại: <strong>{POINTS_BALANCE.toLocaleString('vi-VN')} điểm</strong></Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={3}>
              {/* Loại điều chỉnh */}
              <Box>
                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1, fontWeight: 600 }}>Loại điều chỉnh</Typography>
                <RadioGroup row value={adjustType} onChange={e => setAdjustType(e.target.value as 'add' | 'deduct')}>
                  <FormControlLabel
                    value='add'
                    control={<Radio color='success' size='small' />}
                    label={
                      <Box className='flex items-center gap-1'>
                        <i className='tabler-plus text-[15px] text-[var(--mui-palette-success-main)]' />
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>Cộng điểm</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value='deduct'
                    control={<Radio color='error' size='small' />}
                    label={
                      <Box className='flex items-center gap-1'>
                        <i className='tabler-minus text-[15px] text-[var(--mui-palette-error-main)]' />
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>Trừ điểm</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </Box>

              {/* Số điểm */}
              <TextField
                label='Số điểm'
                size='small'
                type='number'
                fullWidth
                value={adjustAmount}
                onChange={e => setAdjustAmount(e.target.value)}
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: adjustType === 'add' ? 'success.main' : 'error.main' }}>
                        {adjustType === 'add' ? '+' : '−'}
                      </Typography>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: adjustType === 'add' ? 'rgba(var(--mui-palette-success-mainChannel) / 0.4)' : 'rgba(var(--mui-palette-error-mainChannel) / 0.4)' }
                  }
                }}
              />

              {/* Lý do */}
              <TextField
                select
                label='Lý do điều chỉnh'
                size='small'
                fullWidth
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
              >
                <MenuItem value=''>-- Chọn lý do --</MenuItem>
                <MenuItem value='bonus'>Thưởng thủ công</MenuItem>
                <MenuItem value='correction'>Đính chính lỗi hệ thống</MenuItem>
                <MenuItem value='campaign'>Chiến dịch khuyến mãi</MenuItem>
                <MenuItem value='tier_upgrade'>Thưởng nâng hạng</MenuItem>
                <MenuItem value='refund'>Hoàn điểm đơn huỷ</MenuItem>
                <MenuItem value='other'>Khác</MenuItem>
              </TextField>

              {/* Ghi chú */}
              <TextField
                label='Ghi chú thêm (tùy chọn)'
                size='small'
                fullWidth
                multiline
                rows={2}
                value={adjustNote}
                onChange={e => setAdjustNote(e.target.value)}
                placeholder='Mô tả chi tiết lý do điều chỉnh...'
              />

              {/* Preview */}
              {adjustAmount && Number(adjustAmount) > 0 && (
                <Box sx={{
                  p: 2, borderRadius: 1.5,
                  backgroundColor: adjustType === 'add'
                    ? 'rgba(var(--mui-palette-success-mainChannel) / 0.06)'
                    : 'rgba(var(--mui-palette-error-mainChannel) / 0.06)',
                  border: '1px solid',
                  borderColor: adjustType === 'add'
                    ? 'rgba(var(--mui-palette-success-mainChannel) / 0.2)'
                    : 'rgba(var(--mui-palette-error-mainChannel) / 0.2)'
                }}>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 0.5 }}>Xem trước kết quả</Typography>
                  <Box className='flex items-center justify-between'>
                    <Typography variant='body2' color='text.secondary'>Số dư sau điều chỉnh</Typography>
                    <Typography variant='h6' sx={{ fontWeight: 700, color: adjustType === 'add' ? 'success.main' : 'error.main' }}>
                      {(POINTS_BALANCE + (adjustType === 'add' ? 1 : -1) * Number(adjustAmount)).toLocaleString('vi-VN')} điểm
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
            <Button variant='tonal' color='secondary' onClick={() => setAdjustOpen(false)} fullWidth>
              Huỷ
            </Button>
            <Button
              variant='contained'
              color={adjustType === 'add' ? 'success' : 'error'}
              fullWidth
              disabled={!adjustAmount || Number(adjustAmount) <= 0 || !adjustReason}
              onClick={handleAdjustSubmit}
              startIcon={<i className={`${adjustType === 'add' ? 'tabler-plus' : 'tabler-minus'} text-[16px]`} />}
            >
              {adjustType === 'add' ? 'Cộng điểm' : 'Trừ điểm'}
            </Button>
          </DialogActions>
        </Dialog>
        <Table size='medium'>
          <TableHead>
            <TableRow>
              <TableCell>Thời gian</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell align='right'>Điểm</TableCell>
              <TableCell align='right'>Số dư</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {POINT_HISTORY.map(t => {
              const meta = POINT_TXN_META[t.type]
              const positive = t.delta > 0
              return (
                <TableRow key={t.id} hover>
                  <TableCell>
                    <Typography variant='body2'>{t.date.split(' ')[0]}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {t.date.split(' ')[1]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={meta.color}
                      label={meta.label}
                      icon={<i className={`${meta.icon} text-[14px]`} />}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {t.title}
                    </Typography>
                    {t.ref && (
                      <Typography variant='caption' color='text.secondary'>
                        {t.ref}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align='right'>
                    <Typography sx={{ fontWeight: 700, color: positive ? 'success.main' : 'error.main' }}>
                      {positive ? '+' : ''}
                      {t.delta.toLocaleString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {t.balance.toLocaleString('vi-VN')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  )
}

const ESimInfoCell = ({
  label,
  value,
  mono,
  muted
}: {
  label: string
  value: string
  mono?: boolean
  muted?: boolean
}) => (
  <Grid2 size={{ xs: 6, md: 3 }}>
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Typography
      variant='body2'
      sx={{
        fontWeight: 500,
        fontFamily: mono ? 'monospace' : undefined,
        color: muted ? 'text.disabled' : 'text.primary'
      }}
    >
      {value}
    </Typography>
  </Grid2>
)

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <Box className='flex items-center gap-3'>
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'action.hover',
        color: 'text.secondary',
        flexShrink: 0
      }}
    >
      <i className={`${icon} text-[16px]`} />
    </Box>
    <Box className='flex-1 min-is-0'>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='body2' sx={{ fontWeight: 500 }} noWrap>
        {value}
      </Typography>
    </Box>
  </Box>
)

const StatCard = ({
  label,
  value,
  suffix,
  caption,
  icon,
  color
}: {
  label: string
  value: string
  suffix?: string
  caption?: string
  icon: string
  color: 'primary' | 'success' | 'info' | 'warning'
}) => (
  <Grid2 size={{ xs: 6, md: 6 }}>
    <Card variant='outlined' sx={{ height: '100%' }}>
      <CardContent>
        <Box className='flex items-center justify-between'>
          <Box className='flex-1'>
            <Typography variant='caption' color='text.secondary'>
              {label}
            </Typography>
            <Box className='flex items-baseline gap-1'>
              <Typography variant='h4' className='font-bold'>
                {value}
              </Typography>
              {suffix && (
                <Typography variant='body2' color='text.secondary'>
                  {suffix}
                </Typography>
              )}
            </Box>
            {caption && (
              <Typography variant='caption' color='text.secondary'>
                {caption}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `rgba(var(--mui-palette-${color}-mainChannel) / 0.10)`,
              color: `${color}.main`
            }}
          >
            <i className={`${icon} text-[22px]`} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grid2>
)

// ─── Gift Voucher Dialog ───────────────────────────────────────────────────────
const ACTIVE_COUPONS = COUPONS.filter(c => c.status === 'active')

type GiftTarget = 'individual' | 'tier' | 'all'

const TIER_OPTIONS = [
  { value: 'dong', label: 'Hạng Đồng', icon: '🥉' },
  { value: 'bac', label: 'Hạng Bạc', icon: '🥈' },
  { value: 'vang', label: 'Hạng Vàng', icon: '🥇' },
  { value: 'bach_kim', label: 'Hạng Bạch Kim', icon: '💎' },
]

const GiftVoucherDialog = ({
  open,
  customer,
  onClose
}: {
  open: boolean
  customer: Customer
  onClose: () => void
}) => {
  const [target, setTarget] = useState<GiftTarget>('individual')
  const [selectedTiers, setSelectedTiers] = useState<string[]>([])
  const [selectedCouponId, setSelectedCouponId] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const selectedCoupon: Coupon | undefined = ACTIVE_COUPONS.find(c => c.id === selectedCouponId)

  const toggleTier = (val: string) => {
    setSelectedTiers(prev => prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val])
  }

  const handleClose = () => {
    setSent(false)
    setSelectedCouponId('')
    setTarget('individual')
    setSelectedTiers([])
    setReason('')
    setNote('')
    onClose()
  }

  const handleSend = () => {
    setSent(true)
  }

  const canSend = selectedCouponId && reason && (
    target === 'individual' ||
    (target === 'tier' && selectedTiers.length > 0) ||
    target === 'all'
  )

  const recipientLabel = target === 'individual'
    ? `${customer.name} (${customer.id})`
    : target === 'tier'
    ? `${selectedTiers.length} hạng được chọn`
    : 'Toàn bộ khách hàng'

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box className='flex items-center gap-2'>
          <Box sx={{
            width: 40, height: 40, borderRadius: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(var(--mui-palette-secondary-mainChannel)/0.15), rgba(var(--mui-palette-primary-mainChannel)/0.15))',
            color: 'primary.main'
          }}>
            <i className='tabler-gift text-[22px]' />
          </Box>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>Tặng Voucher</Typography>
            <Typography variant='caption' color='text.secondary'>Gửi mã giảm giá đến khách hàng</Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {sent ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: '50%', mx: 'auto', mb: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(var(--mui-palette-success-mainChannel) / 0.12)',
              color: 'success.main'
            }}>
              <i className='tabler-circle-check text-[40px]' />
            </Box>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>Gửi thành công!</Typography>
            <Typography variant='body2' color='text.secondary'>
              Voucher <strong>{selectedCoupon?.code}</strong> đã được gửi đến <strong>{recipientLabel}</strong>
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Bước 1: Chọn đối tượng */}
            <Box>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                1. Đối tượng nhận
              </Typography>
              <Stack direction='row' spacing={1.5} flexWrap='wrap' gap={1}>
                {[
                  { val: 'individual' as GiftTarget, label: 'Khách hàng này', icon: 'tabler-user' },
                  { val: 'tier' as GiftTarget, label: 'Theo hạng', icon: 'tabler-crown' },
                  { val: 'all' as GiftTarget, label: 'Tất cả khách hàng', icon: 'tabler-users' },
                ].map(opt => (
                  <Box
                    key={opt.val}
                    onClick={() => setTarget(opt.val)}
                    sx={{
                      px: 2, py: 1.5, borderRadius: 2, cursor: 'pointer',
                      border: '2px solid',
                      borderColor: target === opt.val ? 'primary.main' : 'divider',
                      backgroundColor: target === opt.val ? 'rgba(var(--mui-palette-primary-mainChannel) / 0.06)' : 'transparent',
                      transition: 'all 0.15s ease',
                      display: 'flex', alignItems: 'center', gap: 1,
                      '&:hover': { borderColor: 'primary.main' }
                    }}
                  >
                    <i className={`${opt.icon} text-[18px]`} style={{ color: target === opt.val ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-secondary)' }} />
                    <Typography variant='body2' sx={{ fontWeight: target === opt.val ? 700 : 400, color: target === opt.val ? 'primary.main' : 'text.primary' }}>
                      {opt.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Nếu theo hạng */}
              {target === 'tier' && (
                <Box sx={{ mt: 2, pl: 1 }}>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>Chọn hạng thành viên:</Typography>
                  <Stack direction='row' spacing={1} flexWrap='wrap' gap={1}>
                    {TIER_OPTIONS.map(t => (
                      <Chip
                        key={t.value}
                        label={`${t.icon} ${t.label}`}
                        variant={selectedTiers.includes(t.value) ? 'filled' : 'outlined'}
                        color={selectedTiers.includes(t.value) ? 'primary' : 'default'}
                        onClick={() => toggleTier(t.value)}
                        sx={{ cursor: 'pointer', fontWeight: selectedTiers.includes(t.value) ? 700 : 400 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Nếu gửi tất cả */}
              {target === 'all' && (
                <Alert severity='warning' variant='outlined' sx={{ mt: 2 }} icon={<i className='tabler-alert-triangle' />}>
                  Voucher sẽ được gửi đến <strong>toàn bộ khách hàng</strong> trong hệ thống. Hãy kiểm tra kỹ trước khi gửi.
                </Alert>
              )}

              {/* Nếu cá nhân: hiện thẻ khách */}
              {target === 'individual' && (
                <Box sx={{
                  mt: 2, p: 2, borderRadius: 1.5, border: '1px solid',
                  borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2
                }}>
                  <Avatar sx={{
                    width: 36, height: 36,
                    bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.12)',
                    color: 'primary.main', fontWeight: 700, fontSize: 13
                  }}>
                    {initials(customer.name)}
                  </Avatar>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>{customer.name}</Typography>
                    <Typography variant='caption' color='text.secondary'>{customer.id} · {customer.phone}</Typography>
                  </Box>
                  {typeChip(customer.type)}
                </Box>
              )}
            </Box>

            <Divider />

            {/* Bước 2: Chọn voucher */}
            <Box>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                2. Chọn Voucher
              </Typography>
              <TextField
                select
                label='Mã voucher'
                size='small'
                fullWidth
                value={selectedCouponId}
                onChange={e => setSelectedCouponId(e.target.value)}
              >
                <MenuItem value=''>-- Chọn voucher đang hoạt động --</MenuItem>
                {ACTIVE_COUPONS.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    <Box className='flex items-center gap-2 w-full'>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>{c.code}</Typography>
                        <Typography variant='caption' color='text.secondary'>{c.name}</Typography>
                      </Box>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={c.type === 'percent' ? 'primary' : 'success'}
                        label={c.type === 'percent' ? `−${c.value}%` : `−${c.value.toLocaleString('vi-VN')}đ`}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              {/* Preview coupon được chọn */}
              {selectedCoupon && (
                <Box sx={{
                  mt: 2, p: 2.5, borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(var(--mui-palette-primary-mainChannel)/0.06) 0%, rgba(var(--mui-palette-secondary-mainChannel)/0.06) 100%)',
                  border: '1px dashed', borderColor: 'rgba(var(--mui-palette-primary-mainChannel)/0.3)',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, fontSize: 100 }}>🎫</Box>
                  <Box className='flex items-start justify-between'>
                    <Box>
                      <Typography variant='h6' sx={{ fontWeight: 800, fontFamily: 'monospace', letterSpacing: 1.5, color: 'primary.main' }}>
                        {selectedCoupon.code}
                      </Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600, mt: 0.5 }}>{selectedCoupon.name}</Typography>
                      {selectedCoupon.description && (
                        <Typography variant='caption' color='text.secondary'>{selectedCoupon.description}</Typography>
                      )}
                    </Box>
                    <Chip
                      color={selectedCoupon.type === 'percent' ? 'primary' : 'success'}
                      variant='filled'
                      label={selectedCoupon.type === 'percent' ? `Giảm ${selectedCoupon.value}%` : `Giảm ${selectedCoupon.value.toLocaleString('vi-VN')}đ`}
                      sx={{ fontWeight: 800, fontSize: '0.9rem' }}
                    />
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction='row' spacing={3} flexWrap='wrap' gap={1}>
                    {selectedCoupon.minOrderVND && (
                      <Typography variant='caption' color='text.secondary'>
                        Đơn tối thiểu: <strong>{selectedCoupon.minOrderVND.toLocaleString('vi-VN')}đ</strong>
                      </Typography>
                    )}
                    {selectedCoupon.endAt && (
                      <Typography variant='caption' color='text.secondary'>
                        HSD: <strong>{selectedCoupon.endAt}</strong>
                      </Typography>
                    )}
                    {selectedCoupon.perCustomerLimit && (
                      <Typography variant='caption' color='text.secondary'>
                        Mỗi KH: <strong>{selectedCoupon.perCustomerLimit} lần</strong>
                      </Typography>
                    )}
                    <Chip size='small' variant='tonal' color={STATUS_META[selectedCoupon.status].color as any} label={STATUS_META[selectedCoupon.status].label} />
                  </Stack>
                </Box>
              )}
            </Box>

            <Divider />

            {/* Bước 3: Lý do & ghi chú */}
            <Box>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                3. Lý do & Ghi chú
              </Typography>
              <Stack spacing={2}>
                <TextField
                  select
                  label='Lý do tặng'
                  size='small'
                  fullWidth
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                >
                  <MenuItem value=''>-- Chọn lý do --</MenuItem>
                  <MenuItem value='loyalty'>Tri ân khách hàng thân thiết</MenuItem>
                  <MenuItem value='birthday'>Sinh nhật</MenuItem>
                  <MenuItem value='tier_upgrade'>Chúc mừng nâng hạng</MenuItem>
                  <MenuItem value='compensation'>Bù đắp sự cố</MenuItem>
                  <MenuItem value='campaign'>Chiến dịch Marketing</MenuItem>
                  <MenuItem value='referral'>Thưởng giới thiệu bạn bè</MenuItem>
                  <MenuItem value='other'>Khác</MenuItem>
                </TextField>
                <TextField
                  label='Ghi chú thêm (tùy chọn)'
                  size='small'
                  fullWidth
                  multiline
                  rows={2}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder='Thông điệp kèm theo khi gửi voucher...'
                />
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        {sent ? (
          <Button variant='contained' fullWidth onClick={handleClose} startIcon={<i className='tabler-check' />}>
            Đóng
          </Button>
        ) : (
          <>
            <Button variant='tonal' color='secondary' onClick={handleClose} fullWidth>
              Huỷ
            </Button>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              disabled={!canSend}
              onClick={handleSend}
              startIcon={<i className='tabler-send' />}
            >
              Gửi Voucher
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default CustomerDetailView
