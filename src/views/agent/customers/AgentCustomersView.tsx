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
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

import { useRouter } from 'next/navigation'

import AppConfirmDialog from '@/components/common/AppConfirmDialog'
import CustomerDrawer, { type DrawerMode } from './CustomerDrawer'
import {
  CUSTOMERS,
  channelLabel,
  daysAgo,
  initials,
  statusChip,
  typeChip,
  type Customer
} from './data'

const KPI_CONFIG = [
  { key: 'total', label: 'Tổng khách hàng', icon: 'tabler-users', color: 'primary' as const },
  { key: 'active', label: 'Đang hoạt động', icon: 'tabler-user-check', color: 'success' as const },
  { key: 'new30d', label: 'Mới trong 30 ngày', icon: 'tabler-user-plus', color: 'info' as const },
  { key: 'revenue', label: 'Doanh thu (VND)', icon: 'tabler-cash', color: 'warning' as const }
]

const AgentCustomersView = () => {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [channel, setChannel] = useState('all')
  const [status, setStatus] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('view')
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null)
  const [lockTarget, setLockTarget] = useState<Customer | null>(null)

  const handleToggleLock = () => {
    if (!lockTarget) return
    setCustomers(prev =>
      prev.map(c =>
        c.id === lockTarget.id
          ? { ...c, status: c.status === 'blocked' ? 'active' : 'blocked' }
          : c
      )
    )
    setLockTarget(null)
  }

  const openDrawer = (c: Customer, mode: DrawerMode) => {
    setActiveCustomer(c)
    setDrawerMode(mode)
    setDrawerOpen(true)
  }

  const handleSave = (next: Customer) => {
    setCustomers(prev => prev.map(c => (c.id === next.id ? next : c)))
    setActiveCustomer(next)
  }

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      return (
        matchSearch &&
        (type === 'all' || c.type === type) &&
        (channel === 'all' || c.channel === channel) &&
        (status === 'all' || c.status === status)
      )
    })
  }, [customers, search, type, channel, status])

  const kpis = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 86_400_000
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      new30d: customers.filter(c => new Date(c.joinedAt).getTime() >= thirtyDaysAgo).length,
      revenue: customers.reduce((sum, c) => sum + c.totalSpentVND, 0)
    }
  }, [customers])

  const formatKpiValue = (key: string, val: number) =>
    key === 'revenue' ? `${(val / 1_000_000).toFixed(1)}M` : val.toLocaleString('vi-VN')

  const activeFilterCount = [type, channel, status].filter(v => v !== 'all').length

  const resetFilters = () => {
    setSearch('')
    setType('all')
    setChannel('all')
    setStatus('all')
  }

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Quản lý khách hàng
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Danh sách khách hàng mua eSIM / SIM vật lý trên app của bạn.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-upload' />}>
            Import CSV
          </Button>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>
            Xuất Excel
          </Button>
          <Button variant='contained' startIcon={<i className='tabler-plus' />}>
            Thêm khách hàng
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
              placeholder='Tìm theo tên, SĐT, email, mã KH...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ flex: 1, maxWidth: 380 }}
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
              Hiển thị <strong>{filtered.length}</strong> / {customers.length} KH
            </Typography>
          </Box>

          <Box className='grid gap-3' sx={{ gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
            <TextField size='small' select label='Loại khách' value={type} onChange={e => setType(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='individual'>Cá nhân</MenuItem>
              <MenuItem value='business'>Doanh nghiệp</MenuItem>
              <MenuItem value='vip'>VIP</MenuItem>
            </TextField>
            <TextField size='small' select label='Kênh đăng ký' value={channel} onChange={e => setChannel(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='app'>App</MenuItem>
              <MenuItem value='web'>Website</MenuItem>
              <MenuItem value='referral'>Giới thiệu</MenuItem>
              <MenuItem value='imported'>Import</MenuItem>
            </TextField>
            <TextField size='small' select label='Trạng thái' value={status} onChange={e => setStatus(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='active'>Hoạt động</MenuItem>
              <MenuItem value='inactive'>Không hoạt động</MenuItem>
              <MenuItem value='blocked'>Đã khoá</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Kênh</TableCell>
                <TableCell align='right'>Số đơn</TableCell>
                <TableCell align='right'>Tổng chi tiêu</TableCell>
                <TableCell>Lần mua gần nhất</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align='right'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Box
                      className='flex items-center gap-3 cursor-pointer'
                      onClick={() => router.push(`/agent/customers/${c.id}`)}
                      sx={{ '&:hover': { '& .cus-name': { color: 'primary.main' } } }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: `rgba(var(--mui-palette-primary-mainChannel) / 0.12)`,
                          color: 'primary.main',
                          fontWeight: 600,
                          fontSize: 14
                        }}
                      >
                        {initials(c.name)}
                      </Avatar>
                      <Box>
                        <Typography className='cus-name' sx={{ fontWeight: 600, transition: 'color 0.15s ease' }}>
                          {c.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {c.id} · Tham gia {daysAgo(c.joinedAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {c.phone}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {c.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{typeChip(c.type)}</TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {channelLabel[c.channel]}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography sx={{ fontWeight: 600 }}>{c.orders}</Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography sx={{ fontWeight: 600 }}>
                      {c.totalSpentVND.toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {c.lastOrderAt ? (
                      <>
                        <Typography variant='body2'>{c.lastOrderAt}</Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {daysAgo(c.lastOrderAt)}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant='caption' color='text.disabled'>
                        Chưa mua
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{statusChip(c.status)}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                      <Tooltip title='Xem chi tiết'>
                        <IconButton size='small' onClick={() => router.push(`/agent/customers/${c.id}`)}>
                          <i className='tabler-eye text-[20px]' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Chỉnh sửa'>
                        <IconButton size='small' onClick={() => openDrawer(c, 'edit')}>
                          <i className='tabler-pencil text-[20px]' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={c.status === 'blocked' ? 'Mở khoá tài khoản' : 'Khoá tài khoản'}>
                        <IconButton size='small' onClick={() => setLockTarget(c)}>
                          <i className={`${c.status === 'blocked' ? 'tabler-lock-open' : 'tabler-lock'} text-[20px]`} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>Không có khách hàng nào khớp bộ lọc.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CustomerDrawer
        open={drawerOpen}
        mode={drawerMode}
        customer={activeCustomer}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        onSwitchMode={setDrawerMode}
      />

      <AppConfirmDialog
        open={!!lockTarget}
        onClose={() => setLockTarget(null)}
        onConfirm={handleToggleLock}
        severity={lockTarget?.status === 'blocked' ? 'primary' : 'warning'}
        icon={lockTarget?.status === 'blocked' ? 'tabler-lock-open' : 'tabler-lock'}
        title={lockTarget?.status === 'blocked' ? 'Mở khoá tài khoản' : 'Khoá tài khoản'}
        description={
          lockTarget?.status === 'blocked' ? (
            <>
              Bạn chắc chắn muốn mở khoá <strong>{lockTarget?.name}</strong> ({lockTarget?.email})? Khách
              hàng sẽ có thể đăng nhập và mua hàng trở lại.
            </>
          ) : (
            <>
              Bạn chắc chắn muốn khoá <strong>{lockTarget?.name}</strong> ({lockTarget?.email})? Khách
              hàng sẽ không thể đăng nhập và mua hàng cho đến khi được mở khoá.
            </>
          )
        }
        confirmLabel={lockTarget?.status === 'blocked' ? 'Mở khoá' : 'Khoá tài khoản'}
      />
    </Box>
  )
}

export default AgentCustomersView
