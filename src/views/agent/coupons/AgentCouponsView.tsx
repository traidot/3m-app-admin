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

import AppConfirmDialog from '@/components/common/AppConfirmDialog'
import CouponDrawer, { type DrawerMode } from './CouponDrawer'
import { COUPONS, SCOPE_LABEL, STATUS_META, type Coupon } from './data'

const KPI_CONFIG = [
  { key: 'total', label: 'Tổng coupon', icon: 'tabler-discount', color: 'primary' as const },
  { key: 'active', label: 'Đang chạy', icon: 'tabler-circle-check', color: 'success' as const },
  { key: 'scheduled', label: 'Đã lên lịch', icon: 'tabler-calendar-time', color: 'info' as const },
  { key: 'usage', label: 'Tổng lượt dùng', icon: 'tabler-ticket', color: 'warning' as const }
]

const formatValue = (c: Coupon) =>
  c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString('vi-VN')}đ`

const AgentCouponsView = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [scope, setScope] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create')
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return coupons.filter(c => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      return (
        matchSearch &&
        (status === 'all' || c.status === status) &&
        (type === 'all' || c.type === type) &&
        (scope === 'all' || c.scope === scope)
      )
    })
  }, [coupons, search, status, type, scope])

  const kpis = useMemo(
    () => ({
      total: coupons.length,
      active: coupons.filter(c => c.status === 'active').length,
      scheduled: coupons.filter(c => c.status === 'scheduled').length,
      usage: coupons.reduce((s, c) => s + c.usedCount, 0)
    }),
    [coupons]
  )

  const formatKpiValue = (key: string, val: number) =>
    key === 'usage' ? val.toLocaleString('vi-VN') : val.toString()

  const openDrawer = (c: Coupon | null, mode: DrawerMode) => {
    setActiveCoupon(c)
    setDrawerMode(mode)
    setDrawerOpen(true)
  }

  const handleSave = (next: Coupon) => {
    setCoupons(prev => {
      const exists = prev.some(c => c.id === next.id)
      return exists ? prev.map(c => (c.id === next.id ? next : c)) : [next, ...prev]
    })
    setToast(drawerMode === 'create' ? 'Đã tạo coupon mới' : 'Đã lưu thay đổi')
  }

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setToast(`Đã copy mã ${code}`)
    } catch {
      setToast('Không thể copy. Hãy copy thủ công.')
    }
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setCoupons(prev => prev.filter(c => c.id !== deleteTarget.id))
    setToast(`Đã xoá coupon ${deleteTarget.code}`)
    setDeleteTarget(null)
  }

  const activeFilterCount = [status, type, scope].filter(v => v !== 'all').length

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Quản lý coupon
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Tạo và quản lý mã giảm giá hiển thị trên app cho khách hàng sử dụng khi đặt eSIM.
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<i className='tabler-plus' />}
          onClick={() => openDrawer(null, 'create')}
        >
          Thêm coupon
        </Button>
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
              placeholder='Tìm theo mã, tên coupon...'
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
                startIcon={<i className='tabler-x text-[16px]' />}
                onClick={() => {
                  setSearch('')
                  setStatus('all')
                  setType('all')
                  setScope('all')
                }}
              >
                Xoá lọc{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
            )}
            <Typography variant='caption' color='text.secondary'>
              Hiển thị <strong>{filtered.length}</strong> / {coupons.length} coupon
            </Typography>
          </Box>

          <Box
            className='grid gap-3'
            sx={{ gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}
          >
            <TextField size='small' select label='Trạng thái' value={status} onChange={e => setStatus(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='active'>Đang chạy</MenuItem>
              <MenuItem value='scheduled'>Đã lên lịch</MenuItem>
              <MenuItem value='paused'>Tạm dừng</MenuItem>
              <MenuItem value='expired'>Hết hạn</MenuItem>
            </TextField>
            <TextField size='small' select label='Loại giảm' value={type} onChange={e => setType(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='percent'>Phần trăm</MenuItem>
              <MenuItem value='fixed'>Số tiền cố định</MenuItem>
            </TextField>
            <TextField size='small' select label='Phạm vi' value={scope} onChange={e => setScope(e.target.value)}>
              <MenuItem value='all'>Tất cả phạm vi</MenuItem>
              <MenuItem value='first_order'>Đơn đầu tiên</MenuItem>
              <MenuItem value='specific_packages'>Gói chỉ định</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Mã coupon</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell align='right'>Giá trị</TableCell>
                <TableCell>Điều kiện</TableCell>
                <TableCell>Phạm vi</TableCell>
                <TableCell align='right'>Đã dùng</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align='right'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(c => {
                const sm = STATUS_META[c.status]
                const usagePct = c.usageLimit ? Math.min((c.usedCount / c.usageLimit) * 100, 100) : null
                return (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Box className='flex items-center gap-2'>
                        <Typography sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{c.code}</Typography>
                        <Tooltip title='Copy mã'>
                          <IconButton size='small' onClick={() => handleCopyCode(c.code)}>
                            <i className='tabler-copy text-[16px]' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant='caption' color='text.secondary'>
                        {c.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={c.type === 'percent' ? 'primary' : 'info'}
                        label={c.type === 'percent' ? '% Phần trăm' : 'Số cố định'}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 700 }}>{formatValue(c)}</Typography>
                      {c.maxDiscountVND && c.type === 'percent' && (
                        <Typography variant='caption' color='text.secondary'>
                          tối đa {c.maxDiscountVND.toLocaleString('vi-VN')}đ
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.minOrderVND ? (
                        <Typography variant='body2'>
                          Đơn ≥ {c.minOrderVND.toLocaleString('vi-VN')}đ
                        </Typography>
                      ) : (
                        <Typography variant='caption' color='text.disabled'>
                          Không giới hạn
                        </Typography>
                      )}
                      {c.perCustomerLimit && (
                        <Typography variant='caption' color='text.secondary' className='block'>
                          Mỗi khách: {c.perCustomerLimit} lần
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{SCOPE_LABEL[c.scope]}</Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 600 }}>
                        {c.usedCount.toLocaleString('vi-VN')}
                        {c.usageLimit ? ` / ${c.usageLimit.toLocaleString('vi-VN')}` : ''}
                      </Typography>
                      {usagePct !== null && (
                        <Box
                          sx={{
                            mt: 0.5,
                            ml: 'auto',
                            width: 80,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'action.hover',
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${usagePct}%`,
                              backgroundColor:
                                usagePct >= 90 ? 'error.main' : usagePct >= 70 ? 'warning.main' : 'success.main'
                            }}
                          />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{c.startAt}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {c.endAt ? `→ ${c.endAt}` : '→ Không hết hạn'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={sm.color}
                        label={sm.label}
                        icon={<i className={`${sm.icon} text-[14px]`} />}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                        <Tooltip title='Chỉnh sửa'>
                          <IconButton size='small' onClick={() => openDrawer(c, 'edit')}>
                            <i className='tabler-pencil text-[20px]' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Xoá coupon'>
                          <IconButton size='small' onClick={() => setDeleteTarget(c)}>
                            <i className='tabler-trash text-[20px]' />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>Không có coupon nào khớp bộ lọc.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CouponDrawer
        open={drawerOpen}
        mode={drawerMode}
        coupon={activeCoupon}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />

      <AppConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        severity='error'
        icon='tabler-trash'
        title='Xoá coupon'
        description={
          <>
            Bạn chắc chắn muốn xoá coupon <strong>{deleteTarget?.code}</strong>? Các đơn đã dùng coupon
            không bị ảnh hưởng nhưng khách sẽ không thể sử dụng mã này nữa.
          </>
        }
        confirmLabel='Xoá coupon'
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  )
}

export default AgentCouponsView
