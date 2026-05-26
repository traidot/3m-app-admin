'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import {
  CUSTOMERS,
  typeColor,
  typeLabel,
  statusColor,
  statusLabel,
  channelLabel,
  type Customer
} from './data'

const KPI_CONFIG = [
  { key: 'total', label: 'Tổng khách hàng toàn sàn', icon: 'tabler-users', color: 'primary' as const },
  { key: 'active', label: 'Đang hoạt động', icon: 'tabler-user-check', color: 'success' as const },
  { key: 'new30d', label: 'Mới trong 30 ngày', icon: 'tabler-user-plus', color: 'info' as const },
  { key: 'spent', label: 'Doanh số bán lẻ tích lũy', icon: 'tabler-cash', color: 'warning' as const }
]

const CustomersView = () => {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS)
  const [search, setSearch] = useState('')
  const [agent, setAgent] = useState('all')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  
  // Toast notifications
  const [toast, setToast] = useState<string | null>(null)

  // Get unique list of agents
  const agentList = useMemo(() => {
    return Array.from(new Set(customers.map(c => c.agentName)))
  }, [customers])

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
        (agent === 'all' || c.agentName === agent) &&
        (type === 'all' || c.type === type) &&
        (status === 'all' || c.status === status)
      )
    })
  }, [customers, search, agent, type, status])

  const kpis = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 86_400_000
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      new30d: customers.filter(c => new Date(c.joinedAt).getTime() >= thirtyDaysAgo).length,
      spent: customers.reduce((sum, c) => sum + c.totalSpentVND, 0)
    }
  }, [customers])

  const formatKpiValue = (key: string, val: number) => {
    if (key === 'spent') {
      return `${(val / 1_000_000).toFixed(1)}M`
    }
    return val.toLocaleString('vi-VN')
  }

  const activeFilterCount = [agent, type, status].filter(v => v !== 'all').length

  const resetFilters = () => {
    setSearch('')
    setAgent('all')
    setType('all')
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
            Khách hàng theo đại lý
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Theo dõi chi tiêu, số đơn hàng và quản lý trạng thái tài khoản của khách hàng thuộc từng đại lý.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>
            Xuất báo cáo KH
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

      {/* Filter and Table Card */}
      <Card variant='outlined'>
        <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box className='flex items-center gap-3 mbe-3 flex-wrap'>
            <TextField
              size='small'
              placeholder='Tìm theo khách hàng, SĐT, Email, ID...'
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
              Hiển thị <strong>{filtered.length}</strong> / {customers.length} khách hàng
            </Typography>
          </Box>

          <Box className='grid gap-3' sx={{ gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' } }}>
            <TextField size='small' select label='Lọc theo Đại lý (Agent)' value={agent} onChange={e => setAgent(e.target.value)}>
              <MenuItem value='all'>Tất cả đại lý</MenuItem>
              {agentList.map(a => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </TextField>
            <TextField size='small' select label='Loại khách' value={type} onChange={e => setType(e.target.value)}>
              <MenuItem value='all'>Tất cả các loại</MenuItem>
              <MenuItem value='vip'>VIP</MenuItem>
              <MenuItem value='business'>Doanh nghiệp</MenuItem>
              <MenuItem value='individual'>Cá nhân</MenuItem>
            </TextField>
            <TextField size='small' select label='Trạng thái' value={status} onChange={e => setStatus(e.target.value)}>
              <MenuItem value='all'>Tất cả trạng thái</MenuItem>
              <MenuItem value='active'>Hoạt động</MenuItem>
              <MenuItem value='inactive'>Không hoạt động</MenuItem>
              <MenuItem value='blocked'>Đã khóa</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Đại lý chủ quản</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Phân loại</TableCell>
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
                      onClick={() => router.push(`/3m/customers/${c.id}`)}
                      sx={{ '&:hover': { '& .cus-name': { color: 'primary.main' } } }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: `rgba(var(--mui-palette-${typeColor[c.type]}-mainChannel) / 0.12)`,
                          color: `${typeColor[c.type]}.main`,
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
                          {c.id} · Tham gia {c.joinedAt}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {c.agentName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {c.phone}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {c.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={typeColor[c.type]}
                      label={typeLabel[c.type]}
                      sx={{ fontWeight: 600 }}
                    />
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
                      </>
                    ) : (
                      <Typography variant='caption' color='text.disabled'>
                        Chưa mua hàng
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      variant='tonal'
                      color={statusColor[c.status]}
                      label={statusLabel[c.status]}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                      <Tooltip title='Xem chi tiết'>
                        <IconButton size='small' onClick={() => router.push(`/3m/customers/${c.id}`)}>
                          <i className='tabler-eye text-[20px]' />
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

export default CustomersView
