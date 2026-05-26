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
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import OrderLogDialog from './OrderLogDialog'
import {
  ORDERS,
  statusColor,
  statusLabel,
  USD_VND,
  formatVND,
  formatUSD,
  formatUSDinVND,
  type Order,
  type OrderStatus
} from './data'

const KPI_CONFIG = [
  { key: 'total', label: 'Tổng số đơn hàng', icon: 'tabler-shopping-cart', color: 'primary' as const },
  { key: 'successRate', label: 'Tỷ lệ kích hoạt thành công', icon: 'tabler-circle-check', color: 'success' as const },
  { key: 'gmv', label: 'Doanh số toàn sàn (VND)', icon: 'tabler-cash', color: 'warning' as const },
  { key: 'failed', label: 'Số đơn hàng lỗi cần xử lý', icon: 'tabler-alert-triangle', color: 'error' as const }
]

const OrdersView = () => {
  const [orders, setOrders] = useState<Order[]>(ORDERS)
  const [search, setSearch] = useState('')
  const [agent, setAgent] = useState('all')
  const [supplier, setSupplier] = useState('all')
  const [status, setStatus] = useState('all')

  // Log Dialog state
  const [logOpen, setLogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Toast state
  const [toast, setToast] = useState<{ severity: 'success' | 'info'; message: string } | null>(null)

  // Unique filters lists
  const agentList = useMemo(() => Array.from(new Set(orders.map(o => o.agentName))), [orders])
  const supplierList = useMemo(() => Array.from(new Set(orders.map(o => o.supplier))), [orders])

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.packageName.toLowerCase().includes(q)
      return (
        matchSearch &&
        (agent === 'all' || o.agentName === agent) &&
        (supplier === 'all' || o.supplier === supplier) &&
        (status === 'all' || o.status === status)
      )
    })
  }, [orders, search, agent, supplier, status])

  const kpis = useMemo(() => {
    const totalCount = orders.length
    const successCount = orders.filter(o => o.status === 'success').length
    const failedCount = orders.filter(o => o.status === 'failed').length
    const successRate = totalCount > 0 ? (successCount / (totalCount - orders.filter(o => o.status === 'refunded').length)) * 100 : 100
    const gmv = orders.reduce((sum, o) => o.status === 'success' ? sum + o.retailPriceVND : sum, 0)
    return {
      total: totalCount,
      successRate: `${successRate.toFixed(1)}%`,
      gmv,
      failed: failedCount
    }
  }, [orders])

  const formatKpiValue = (key: string, val: any) => {
    if (key === 'gmv') {
      return `${(val / 1_000_000).toFixed(1)}M`
    }
    return val
  }

  const handleRetry = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedLogs = JSON.parse(o.activationLog)
          updatedLogs.push({ time: new Date().toTimeString().split(' ')[0], event: 'Admin 3M kích hoạt yêu cầu Thử lại (Retry) cấp phát eSIM' })
          updatedLogs.push({ time: new Date().toTimeString().split(' ')[0], event: 'Gọi API Airalo/GoMoWorld: SUCCESS' })
          updatedLogs.push({ time: new Date().toTimeString().split(' ')[0], event: 'Cấp phát thành công eSIM' })
          return {
            ...o,
            status: 'success',
            activationLog: JSON.stringify(updatedLogs, null, 2)
          }
        }
        return o
      })
    )
    setToast({ severity: 'success', message: `Đã thực hiện thử lại cấp phát thành công cho đơn hàng ${orderId}!` })
  }

  const handleRefund = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedLogs = JSON.parse(o.activationLog)
          updatedLogs.push({ time: new Date().toTimeString().split(' ')[0], event: 'Admin 3M thực hiện Hủy & Hoàn tiền' })
          updatedLogs.push({ time: new Date().toTimeString().split(' ')[0], event: 'Đã cộng trả lại số tiền vào ví ký quỹ của đại lý' })
          return {
            ...o,
            status: 'refunded',
            activationLog: JSON.stringify(updatedLogs, null, 2)
          }
        }
        return o
      })
    )
    setToast({ severity: 'info', message: `Đã hủy và hoàn trả số tiền thành công cho đơn hàng ${orderId} vào ví đại lý!` })
  }

  const activeFilterCount = [agent, supplier, status].filter(v => v !== 'all').length

  const resetFilters = () => {
    setSearch('')
    setAgent('all')
    setSupplier('all')
    setStatus('all')
  }

  const getMargin = (o: Order) => {
    const costVnd = o.costUSD * USD_VND
    const marginVnd = o.retailPriceVND - costVnd
    const marginPct = (marginVnd / costVnd) * 100
    return {
      vnd: marginVnd,
      pct: marginPct
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Đơn hàng toàn hệ thống
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Giám sát, cứu hộ kích hoạt eSIM kỹ thuật, thử lại cấp phát lỗi, và hoàn tiền giao dịch cho đại lý.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>
            Xuất Excel đơn hàng
          </Button>
        </Stack>
      </Box>

      {/* KPI Row */}
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

      {/* Filter and Table container */}
      <Card variant='outlined'>
        <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box className='flex items-center gap-3 mbe-3 flex-wrap'>
            <TextField
              size='small'
              placeholder='Tìm theo mã đơn, khách hàng, tên eSIM...'
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
              Hiển thị <strong>{filtered.length}</strong> / {orders.length} đơn hàng
            </Typography>
          </Box>

          <Box className='grid gap-3' sx={{ gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' } }}>
            <TextField size='small' select label='Lọc Đại lý (Agent)' value={agent} onChange={e => setAgent(e.target.value)}>
              <MenuItem value='all'>Tất cả đại lý</MenuItem>
              {agentList.map(a => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </TextField>
            <TextField size='small' select label='Nhà cung cấp nguồn' value={supplier} onChange={e => setSupplier(e.target.value)}>
              <MenuItem value='all'>Tất cả nhà cung cấp</MenuItem>
              {supplierList.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField size='small' select label='Trạng thái đơn' value={status} onChange={e => setStatus(e.target.value)}>
              <MenuItem value='all'>Tất cả trạng thái</MenuItem>
              <MenuItem value='success'>Thành công</MenuItem>
              <MenuItem value='pending'>Chờ duyệt</MenuItem>
              <MenuItem value='failed'>Thất bại</MenuItem>
              <MenuItem value='refunded'>Đã hoàn tiền</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Đại lý</TableCell>
                <TableCell>Sản phẩm eSIM</TableCell>
                <TableCell>Nguồn cấp</TableCell>
                <TableCell align='right'>Giá vốn (Cost)</TableCell>
                <TableCell align='right'>Giá bán</TableCell>
                <TableCell align='right'>Biên độ lãi</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align='right'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(o => {
                const margin = getMargin(o)
                return (
                  <TableRow key={o.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{o.id}</TableCell>
                    <TableCell>{o.customerName}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{o.agentName}</TableCell>
                    <TableCell>{o.packageName}</TableCell>
                    <TableCell>{o.supplier}</TableCell>
                    <TableCell align='right'>
                      <Typography variant='body2'>{formatUSD(o.costUSD)}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {formatUSDinVND(o.costUSD)}
                      </Typography>
                    </TableCell>
                    <TableCell align='right' sx={{ fontWeight: 600 }}>
                      {formatVND(o.retailPriceVND)}
                    </TableCell>
                    <TableCell align='right'>
                      {o.status === 'success' ? (
                        <>
                          <Typography variant='body2' color={margin.vnd > 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 600 }}>
                            +{formatVND(margin.vnd)}
                          </Typography>
                          <Typography variant='caption' color={margin.vnd > 0 ? 'success.main' : 'error.main'}>
                            +{margin.pct.toFixed(0)}%
                          </Typography>
                        </>
                      ) : (
                        <Typography variant='caption' color='text.disabled'>
                          --
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={statusColor[o.status]}
                        label={statusLabel[o.status]}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                        <Tooltip title='Xem Log kỹ thuật'>
                          <IconButton size='small' onClick={() => {
                            setSelectedOrder(o)
                            setLogOpen(true)
                          }}>
                            <i className='tabler-file-code text-[20px] text-primary' />
                          </IconButton>
                        </Tooltip>
                        
                        {o.status === 'failed' && (
                          <Tooltip title='Thử lại kích hoạt (Retry)'>
                            <IconButton size='small' onClick={() => handleRetry(o.id)}>
                              <i className='tabler-refresh text-[20px] text-success' />
                            </IconButton>
                          </Tooltip>
                        )}

                        {(o.status === 'failed' || o.status === 'pending') && (
                          <Tooltip title='Hủy & Hoàn tiền về ví đại lý'>
                            <IconButton size='small' onClick={() => handleRefund(o.id)}>
                              <i className='tabler-circle-x text-[20px] text-danger' />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
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

      <OrderLogDialog
        open={logOpen}
        order={selectedOrder}
        onClose={() => setLogOpen(false)}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast?.severity ?? 'success'} onClose={() => setToast(null)}>
          {toast?.message ?? ''}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default OrdersView
