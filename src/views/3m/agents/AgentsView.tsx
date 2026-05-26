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
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import AppConfirmDialog from '@/components/common/AppConfirmDialog'
import AgentDrawer from './AgentDrawer'
import {
  AGENTS,
  tierColor,
  statusColor,
  statusLabel,
  type Agent,
  type AgentTier
} from './data'

const KPI_CONFIG = [
  { key: 'total', label: 'Tổng số đại lý', icon: 'tabler-building-store', color: 'primary' as const },
  { key: 'wallet', label: 'Tổng tiền ký quỹ (VND)', icon: 'tabler-wallet', color: 'success' as const },
  { key: 'revenue', label: 'Doanh thu (VND)', icon: 'tabler-cash', color: 'warning' as const },
  { key: 'orders', label: 'Tổng đơn hàng', icon: 'tabler-shopping-cart', color: 'info' as const }
]

const AgentsView = () => {
  const [agents, setAgents] = useState<Agent[]>(AGENTS)
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState('all')
  const [status, setStatus] = useState('all')
  
  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view')
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  
  // Locking states
  const [lockTarget, setLockTarget] = useState<Agent | null>(null)
  
  // Toast notifications
  const [toast, setToast] = useState<string | null>(null)

  const handleToggleLock = () => {
    if (!lockTarget) return
    setAgents(prev =>
      prev.map(a =>
        a.id === lockTarget.id
          ? { ...a, status: a.status === 'blocked' ? 'active' : 'blocked' }
          : a
      )
    )
    setToast(lockTarget.status === 'blocked' ? 'Đã kích hoạt hoạt động lại đại lý' : 'Đã khóa tài khoản đại lý')
    setLockTarget(null)
  }

  const openDrawer = (a: Agent, mode: 'view' | 'edit') => {
    setActiveAgent(a)
    setDrawerMode(mode)
    setDrawerOpen(true)
  }

  const handleSave = (next: Agent) => {
    setAgents(prev => {
      const idx = prev.findIndex(a => a.id === next.id)
      if (idx !== -1) {
        const nextList = [...prev]
        nextList[idx] = next
        return nextList
      }
      return [...prev, next]
    })
    setToast('Đã lưu thông tin thay đổi đại lý thành công!')
    setActiveAgent(next)
  }

  const filtered = useMemo(() => {
    return agents.filter(a => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      return (
        matchSearch &&
        (tier === 'all' || a.tier === tier) &&
        (status === 'all' || a.status === status)
      )
    })
  }, [agents, search, tier, status])

  const kpis = useMemo(() => {
    return {
      total: agents.length,
      wallet: agents.reduce((sum, a) => sum + a.walletBalanceVND, 0),
      revenue: agents.reduce((sum, a) => sum + a.totalSalesVND, 0),
      orders: agents.reduce((sum, a) => sum + a.ordersCount, 0)
    }
  }, [agents])

  const formatKpiValue = (key: string, val: number) => {
    if (key === 'revenue' || key === 'wallet') {
      return `${(val / 1_000_000).toFixed(1)}M`
    }
    return val.toLocaleString('vi-VN')
  }

  const activeFilterCount = [tier, status].filter(v => v !== 'all').length

  const resetFilters = () => {
    setSearch('')
    setTier('all')
    setStatus('all')
  }

  const initials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map(w => w[0])
      .join('')
      .toUpperCase()

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Quản lý đại lý app
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Quản lý cấp bậc, ví tài chính ký quỹ, trạng thái và cổng API Gateway của từng đại lý.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>
            Xuất báo cáo
          </Button>
          <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => {
            setActiveAgent(null)
            setDrawerMode('edit')
            setDrawerOpen(true)
          }}>
            Thêm đại lý mới
          </Button>
        </Stack>
      </Box>

      {/* KPI Cards */}
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
              placeholder='Tìm theo đại lý, chủ sở hữu, SĐT, Email, ID...'
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
              Hiển thị <strong>{filtered.length}</strong> / {agents.length} đại lý
            </Typography>
          </Box>

          <Box className='grid gap-3' sx={{ gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' } }}>
            <TextField size='small' select label='Cấp bậc (Tier)' value={tier} onChange={e => setTier(e.target.value)}>
              <MenuItem value='all'>Tất cả cấp bậc</MenuItem>
              <MenuItem value='Platinum'>Platinum</MenuItem>
              <MenuItem value='Gold'>Gold</MenuItem>
              <MenuItem value='Silver'>Silver</MenuItem>
            </TextField>
            <TextField size='small' select label='Trạng thái' value={status} onChange={e => setStatus(e.target.value)}>
              <MenuItem value='all'>Tất cả trạng thái</MenuItem>
              <MenuItem value='active'>Hoạt động</MenuItem>
              <MenuItem value='blocked'>Đã khóa</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Đại lý</TableCell>
                <TableCell>Chủ sở hữu</TableCell>
                <TableCell>Cấp bậc</TableCell>
                <TableCell align='right'>Ví ký quỹ</TableCell>
                <TableCell align='right'>Doanh số tổng hợp</TableCell>
                <TableCell align='right'>Đơn hàng</TableCell>
                <TableCell>API Gateway</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align='right'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} hover>
                  <TableCell>
                    <Box
                      className='flex items-center gap-3 cursor-pointer'
                      onClick={() => openDrawer(a, 'view')}
                      sx={{ '&:hover': { '& .agt-name': { color: 'primary.main' } } }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: `rgba(var(--mui-palette-${tierColor[a.tier]}-mainChannel) / 0.12)`,
                          color: `${tierColor[a.tier]}.main`,
                          fontWeight: 600,
                          fontSize: 14
                        }}
                      >
                        {initials(a.name)}
                      </Avatar>
                      <Box>
                        <Typography className='agt-name' sx={{ fontWeight: 600, transition: 'color 0.15s ease' }}>
                          {a.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {a.id} · Tham gia {a.joinedAt}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {a.owner}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {a.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={tierColor[a.tier]}
                      label={a.tier}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <Typography sx={{ fontWeight: 700 }} color={a.walletBalanceVND >= 0 ? 'success.main' : 'error.main'}>
                      {a.walletBalanceVND.toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography sx={{ fontWeight: 600 }}>
                      {a.totalSalesVND.toLocaleString('vi-VN')}đ
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography sx={{ fontWeight: 600 }}>{a.ordersCount}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={a.apiKeyEnabled ? 'success' : 'secondary'}
                      label={a.apiKeyEnabled ? 'Active' : 'Off'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={statusColor[a.status]}
                      label={statusLabel[a.status]}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                      <Tooltip title='Xem & Sửa'>
                        <IconButton size='small' onClick={() => openDrawer(a, 'view')}>
                          <i className='tabler-eye text-[20px]' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={a.status === 'blocked' ? 'Kích hoạt lại' : 'Khóa tài khoản đại lý'}>
                        <IconButton size='small' onClick={() => setLockTarget(a)}>
                          <i className={`${a.status === 'blocked' ? 'tabler-lock-open' : 'tabler-lock'} text-[20px]`} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>Không có đại lý nào khớp bộ lọc.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <AgentDrawer
        open={drawerOpen}
        mode={drawerMode}
        agent={activeAgent}
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
        title={lockTarget?.status === 'blocked' ? 'Kích hoạt lại đại lý' : 'Khóa tài khoản đại lý'}
        description={
          lockTarget?.status === 'blocked' ? (
            <>
              Bạn chắc chắn muốn mở lại đại lý <strong>{lockTarget?.name}</strong> ({lockTarget?.owner})? Cửa hàng của đại lý sẽ có thể hoạt động mua bán eSIM trở lại bình thường.
            </>
          ) : (
            <>
              Bạn chắc chắn muốn khóa đại lý <strong>{lockTarget?.name}</strong> ({lockTarget?.owner})? Mọi giao dịch và mua sắm eSIM trên ứng dụng của đại lý này sẽ bị dừng ngay lập tức.
            </>
          )
        }
        confirmLabel={lockTarget?.status === 'blocked' ? 'Mở khóa' : 'Khóa đại lý'}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity='success' onClose={() => setToast(null)}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AgentsView
