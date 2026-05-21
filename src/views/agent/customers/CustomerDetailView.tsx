'use client'

import { useMemo, useState } from 'react'
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

import { CUSTOMERS, channelLabel, daysAgo, initials, statusChip, typeChip, type Customer } from './data'
import CustomerDrawer, { type DrawerMode } from './CustomerDrawer'

type Props = { customerId: string }

const RECENT_ORDERS = [
  { id: 'ORD-202605-0148', date: '2026-05-20', package: 'eSIM đi Nhật Bản', country: '🇯🇵 Nhật Bản', amount: 149_000, status: 'Hoàn tất' as const, color: 'success' as const },
  { id: 'ORD-202605-0139', date: '2026-05-18', package: 'eSIM Đông Nam Á 8 nước', country: '🌏 Đông Nam Á', amount: 119_000, status: 'Hoàn tất' as const, color: 'success' as const },
  { id: 'ORD-202604-0098', date: '2026-04-15', package: 'eSIM đi Hàn Quốc', country: '🇰🇷 Hàn Quốc', amount: 245_000, status: 'Hoàn tất' as const, color: 'success' as const },
  { id: 'ORD-202603-0061', date: '2026-03-22', package: 'eSIM Châu Âu 30 nước', country: '🇪🇺 Châu Âu', amount: 399_000, status: 'Hoàn tất' as const, color: 'success' as const },
  { id: 'ORD-202602-0024', date: '2026-02-08', package: 'eSIM đi Nhật Bản', country: '🇯🇵 Nhật Bản', amount: 149_000, status: 'Đã huỷ' as const, color: 'secondary' as const }
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

const CustomerDetailView = ({ customerId }: Props) => {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS)
  const [tab, setTab] = useState<'overview' | 'orders' | 'esims' | 'notes' | 'activity'>('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('edit')
  const [newNote, setNewNote] = useState('')

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
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-phone' />}>
            Gọi
          </Button>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-mail' />}>
            Gửi email
          </Button>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-gift' />}>
            Tặng voucher
          </Button>
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

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <InfoRow icon='tabler-phone' label='Số điện thoại' value={customer.phone} />
                <InfoRow icon='tabler-mail' label='Email' value={customer.email} />
                <InfoRow icon='tabler-arrow-down-right' label='Kênh đăng ký' value={channelLabel[customer.channel]} />
                <InfoRow
                  icon='tabler-calendar-event'
                  label='Tham gia'
                  value={`${customer.joinedAt} · ${daysAgo(customer.joinedAt)}`}
                />
              </Stack>
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
    </Box>
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

export default CustomerDetailView
