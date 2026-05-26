'use client'

import { useMemo, useState, useCallback } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'

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

type CampaignStatus = 'sent' | 'sending' | 'scheduled' | 'failed'
const CAMPAIGN_STATUS_META: Record<CampaignStatus, { label: string; color: 'success' | 'info' | 'warning' | 'error'; icon: string }> = {
  sent:      { label: 'Đã gửi',      color: 'success', icon: 'tabler-circle-check' },
  sending:   { label: 'Đang gửi',    color: 'info',    icon: 'tabler-loader' },
  scheduled: { label: 'Đã lên lịch', color: 'warning', icon: 'tabler-calendar-time' },
  failed:    { label: 'Thất bại',    color: 'error',   icon: 'tabler-alert-circle' },
}

const SEND_CAMPAIGNS: {
  id: string
  name: string
  couponCode: string
  couponValue: string
  target: string
  channel: string
  recipientCount: number
  usedCount: number
  sentAt: string
  sentBy: string
  status: CampaignStatus
  note: string
}[] = [
  { id: 'SC-001', name: 'Tri ân khách VIP tháng 5',    couponCode: 'VIP25',       couponValue: 'Giảm 25%',    target: 'Hạng Vàng + Bạch Kim',   channel: 'Push + Email', recipientCount: 312,   usedCount: 187, sentAt: '2026-05-20 09:00', sentBy: 'Trần Thanh Hà',  status: 'sent',      note: 'Chiến dịch định kỳ Q2' },
  { id: 'SC-002', name: 'Khuyến mãi hè 2026',           couponCode: 'SUMMER2026',  couponValue: 'Giảm 15%',    target: 'Tất cả khách hàng',       channel: 'Push',         recipientCount: 1284,  usedCount: 450, sentAt: '2026-05-01 08:30', sentBy: 'Hệ thống',        status: 'sent',      note: '' },
  { id: 'SC-003', name: 'Ưu đãi gói Nhật - tháng 5',   couponCode: 'JP10',        couponValue: 'Giảm 10%',    target: '≥ 2 đơn hàng',           channel: 'Email',        recipientCount: 489,   usedCount: 89,  sentAt: '2026-05-15 10:00', sentBy: 'Lê Hoàng Sơn',   status: 'sent',      note: 'Nhắm vào khách mua gói Nhật' },
  { id: 'SC-004', name: 'Chào mừng tháng 6',            couponCode: 'SUMMER2026',  couponValue: 'Giảm 15%',    target: 'Đăng ký sau 01/05/2026',  channel: 'Push',         recipientCount: 210,   usedCount: 0,   sentAt: '2026-06-01 00:00', sentBy: 'Hệ thống',        status: 'scheduled', note: 'Tự động gửi đầu tháng 6' },
  { id: 'SC-005', name: 'Win-back khách không mua 30 ngày', couponCode: 'JP10',    couponValue: 'Giảm 10%',    target: 'Không mua ≥ 30 ngày',    channel: 'Push + Email', recipientCount: 178,   usedCount: 22,  sentAt: '2026-04-28 14:00', sentBy: 'Trần Thanh Hà',  status: 'sent',      note: 'Tái kích hoạt khách cũ' },
  { id: 'SC-006', name: 'Black Friday 2025',             couponCode: 'BLACKFRIDAY', couponValue: 'Giảm 30%',    target: 'Tất cả khách hàng',       channel: 'Push + Email', recipientCount: 2500,  usedCount: 982, sentAt: '2025-11-25 07:00', sentBy: 'Hệ thống',        status: 'sent',      note: '' },
  { id: 'SC-007', name: 'Test gửi chiến dịch mới',      couponCode: 'JP10',        couponValue: 'Giảm 10%',    target: 'Hạng Đồng',              channel: 'Push',         recipientCount: 50,    usedCount: 0,   sentAt: '2026-05-22 16:45', sentBy: 'Lê Hoàng Sơn',   status: 'failed',    note: 'Lỗi kết nối push service' },
]

const AgentCouponsView = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS)
  const [pageTab, setPageTab] = useState<'coupons' | 'campaigns'>('coupons')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [scope, setScope] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create')
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [giftCoupon, setGiftCoupon] = useState<Coupon | null>(null)

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
  const [detailCampaign, setDetailCampaign] = useState<typeof SEND_CAMPAIGNS[0] | null>(null)

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
        {pageTab === 'coupons' ? (
          <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => openDrawer(null, 'create')}>
            Thêm coupon
          </Button>
        ) : (
          <Button variant='contained' color='primary' startIcon={<i className='tabler-rocket' />} disabled>
            Khởi chạy chiến dịch mới
          </Button>
        )}
      </Box>

      {/* Page Tabs */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mbe: 3, mb: 4 }}>
        <Tabs value={pageTab} onChange={(_, v) => setPageTab(v)}>
          <Tab value='coupons' label='Danh sách coupon' icon={<i className='tabler-discount text-[17px]' />} iconPosition='start' />
          <Tab value='campaigns' label={`Chiến dịch gửi (${SEND_CAMPAIGNS.length})`} icon={<i className='tabler-rocket text-[17px]' />} iconPosition='start' />
        </Tabs>
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

      {/* ── COUPON LIST TAB ── */}
      {pageTab === 'coupons' && (
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
                <TableCell align='right'>Đã gửi</TableCell>
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
                        {c.sentCount.toLocaleString('vi-VN')}
                      </Typography>
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
                        {c.status === 'active' && (
                          <Tooltip title='Gửi voucher cho khách'>
                            <IconButton size='small' color='primary' onClick={() => setGiftCoupon(c)}
                              sx={{ color: 'primary.main', backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel)/0.08)', '&:hover': { backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel)/0.16)' } }}
                            >
                              <i className='tabler-send text-[18px]' />
                            </IconButton>
                          </Tooltip>
                        )}
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
      )}

      {/* ── SEND CAMPAIGNS TAB ── */}
      {pageTab === 'campaigns' && (
        <Card variant='outlined'>
          <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box className='flex items-center justify-between gap-3 flex-wrap'>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  Lịch sử chiến dịch gửi
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Theo dõi các lượt gửi voucher hàng loạt cho khách hàng.
                </Typography>
              </Box>
              <Chip
                variant='tonal'
                color='primary'
                icon={<i className='tabler-rocket text-[16px]' />}
                label={`${SEND_CAMPAIGNS.length} chiến dịch`}
              />
            </Box>
          </Box>

          <TableContainer>
            <Table size='medium'>
              <TableHead>
                <TableRow>
                  <TableCell>Chiến dịch</TableCell>
                  <TableCell>Mã coupon</TableCell>
                  <TableCell>Đối tượng</TableCell>
                  <TableCell>Kênh</TableCell>
                  <TableCell align='right'>Người nhận</TableCell>
                  <TableCell align='right'>Đã dùng</TableCell>
                  <TableCell>Thời gian gửi</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align='right'>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SEND_CAMPAIGNS.map(campaign => {
                  const sm = CAMPAIGN_STATUS_META[campaign.status]
                  const usedPct = campaign.recipientCount
                    ? Math.round((campaign.usedCount / campaign.recipientCount) * 100)
                    : 0

                  return (
                    <TableRow key={campaign.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{campaign.name}</Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {campaign.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                          {campaign.couponCode}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {campaign.couponValue}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{campaign.target}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size='small'
                          variant='tonal'
                          color='info'
                          label={campaign.channel}
                          icon={<i className='tabler-bell text-[14px]' />}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <Typography sx={{ fontWeight: 600 }}>
                          {campaign.recipientCount.toLocaleString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography sx={{ fontWeight: 600 }}>
                          {campaign.usedCount.toLocaleString('vi-VN')}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {usedPct}% chuyển đổi
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{campaign.sentAt}</Typography>
                        <Typography variant='caption' color='text.secondary'>
                          bởi {campaign.sentBy}
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
                        <Tooltip title='Xem chi tiết'>
                          <IconButton size='small' onClick={() => setDetailCampaign(campaign)}>
                            <i className='tabler-eye text-[20px]' />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

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

      <GiftVoucherFromCouponDialog
        coupon={giftCoupon}
        onClose={(msg) => {
          if (msg) setToast(msg)
          setGiftCoupon(null)
        }}
      />

      <Dialog
        open={!!detailCampaign}
        onClose={() => setDetailCampaign(null)}
        maxWidth='sm'
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box className='flex items-center gap-2'>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              <i className='tabler-rocket text-[22px]' />
            </Avatar>
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                Chi tiết chiến dịch
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {detailCampaign?.id}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {detailCampaign && (
            <Stack spacing={2}>
              {[
                { label: 'Tên chiến dịch', value: detailCampaign.name },
                { label: 'Coupon', value: `${detailCampaign.couponCode} · ${detailCampaign.couponValue}` },
                { label: 'Đối tượng', value: detailCampaign.target },
                { label: 'Kênh gửi', value: detailCampaign.channel },
                { label: 'Người nhận', value: detailCampaign.recipientCount.toLocaleString('vi-VN') },
                { label: 'Đã dùng', value: detailCampaign.usedCount.toLocaleString('vi-VN') },
                { label: 'Thời gian gửi', value: detailCampaign.sentAt },
                { label: 'Người gửi', value: detailCampaign.sentBy },
                { label: 'Ghi chú', value: detailCampaign.note || 'Không có ghi chú' }
              ].map(row => (
                <Box key={row.label} className='flex items-start justify-between gap-4'>
                  <Typography variant='body2' color='text.secondary'>
                    {row.label}
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right' }}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant='contained' onClick={() => setDetailCampaign(null)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

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

// ─── Mock customer count for preview ──────────────────────────────────────────
const MOCK_CUSTOMER_TOTAL = 1_284

function estimateCount(filters: {
  tiers: string[]
  minOrders: string
  minSpend: string
  regAfter: string
  inactiveDays: string
}): number {
  let base = MOCK_CUSTOMER_TOTAL
  if (filters.tiers.length > 0) base = Math.round(base * (filters.tiers.length / 4) * 0.6)
  if (filters.minOrders) base = Math.round(base * (1 - Number(filters.minOrders) * 0.08))
  if (filters.minSpend) base = Math.round(base * (1 - Number(filters.minSpend) / 20_000_000))
  if (filters.regAfter) base = Math.round(base * 0.45)
  if (filters.inactiveDays) base = Math.round(base * 0.3)
  return Math.max(1, Math.min(base, MOCK_CUSTOMER_TOTAL))
}

const TIER_OPTIONS = [
  { value: 'dong', label: 'Đồng', icon: '🥉' },
  { value: 'bac', label: 'Bạc', icon: '🥈' },
  { value: 'vang', label: 'Vàng', icon: '🥇' },
  { value: 'bach_kim', label: 'Bạch Kim', icon: '💎' },
]

const GiftVoucherFromCouponDialog = ({
  coupon,
  onClose
}: {
  coupon: Coupon | null
  onClose: (toastMsg?: string) => void
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [campaignName, setCampaignName] = useState('')
  const [tiers, setTiers] = useState<string[]>([])
  const [minOrders, setMinOrders] = useState('')
  const [minSpend, setMinSpend] = useState('')
  const [regAfter, setRegAfter] = useState('')
  const [inactiveDays, setInactiveDays] = useState('')
  const [channel, setChannel] = useState<'push' | 'email' | 'both'>('push')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const toggleTier = (v: string) => setTiers(p => p.includes(v) ? p.filter(t => t !== v) : [...p, v])

  const estimatedCount = estimateCount({ tiers, minOrders, minSpend, regAfter, inactiveDays })
  const noFilter = tiers.length === 0 && !minOrders && !minSpend && !regAfter && !inactiveDays

  const handleReset = () => {
    setStep(1); setCampaignName(''); setTiers([]); setMinOrders('')
    setMinSpend(''); setRegAfter(''); setInactiveDays('')
    setChannel('push'); setMessage(''); setSent(false)
  }

  const handleClose = (msg?: string) => { handleReset(); onClose(msg) }

  if (!coupon) return null

  const formatVal = coupon.type === 'percent'
    ? `Giảm ${coupon.value}%`
    : `Giảm ${coupon.value.toLocaleString('vi-VN')}đ`

  return (
    <Dialog open={!!coupon} onClose={() => handleClose()} maxWidth='sm' fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 0 }}>
        <Box className='flex items-center gap-2 mbe-1'>
          <Box sx={{
            width: 40, height: 40, borderRadius: 1.5, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(var(--mui-palette-primary-mainChannel)/0.15), rgba(var(--mui-palette-secondary-mainChannel)/0.15))',
            color: 'primary.main'
          }}>
            <i className='tabler-rocket text-[22px]' />
          </Box>
          <Box className='flex-1'>
            <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>Gửi Voucher Hàng Loạt</Typography>
            <Typography variant='caption' color='text.secondary'>Chiến dịch gửi mã: <strong style={{ fontFamily: 'monospace' }}>{coupon.code}</strong> · {formatVal}</Typography>
          </Box>
        </Box>

        {/* Step indicator */}
        {!sent && (
          <Stack direction='row' spacing={0} sx={{ mt: 2, mb: 0 }}>
            {[
              { n: 1, label: 'Đối tượng' },
              { n: 2, label: 'Thông báo' },
              { n: 3, label: 'Xác nhận' },
            ].map((s, i) => (
              <Box key={s.n} className='flex items-center' sx={{ flex: 1 }}>
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: step >= s.n ? 'primary.main' : 'action.hover',
                  color: step >= s.n ? 'common.white' : 'text.disabled',
                  fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s'
                }}>
                  {step > s.n ? <i className='tabler-check text-[14px]' /> : s.n}
                </Box>
                <Typography variant='caption' sx={{ ml: 1, fontWeight: step === s.n ? 700 : 400, color: step >= s.n ? 'primary.main' : 'text.disabled', whiteSpace: 'nowrap' }}>
                  {s.label}
                </Typography>
                {i < 2 && <Box sx={{ flex: 1, height: 2, mx: 1, backgroundColor: step > s.n ? 'primary.main' : 'divider', transition: 'all 0.3s' }} />}
              </Box>
            ))}
          </Stack>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {sent ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(var(--mui-palette-success-mainChannel)/0.12)', color: 'success.main'
            }}>
              <i className='tabler-circle-check text-[46px]' />
            </Box>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>Chiến dịch đã được khởi chạy!</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Voucher <strong>{coupon.code}</strong> đang được gửi đến <strong>{estimatedCount.toLocaleString('vi-VN')}</strong> khách hàng qua {channel === 'push' ? 'Push notification' : channel === 'email' ? 'Email' : 'Push + Email'}.
            </Typography>
            <Chip label={campaignName || 'Chiến dịch chưa đặt tên'} color='primary' variant='tonal' icon={<i className='tabler-rocket text-[14px]' />} />
          </Box>
        ) : step === 1 ? (
          <Stack spacing={3}>
            {/* Tên chiến dịch */}
            <TextField
              label='Tên chiến dịch (tùy chọn)'
              size='small'
              fullWidth
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder='VD: Tri ân khách VIP tháng 5...'
              InputProps={{ startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}><i className='tabler-flag text-[16px]' /></Box> }}
            />

            <Divider><Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>BỘ LỌC ĐỐI TƯỢNG</Typography></Divider>

            {/* Hạng thành viên */}
            <Box>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1, fontWeight: 600 }}>Hạng thành viên</Typography>
              <Stack direction='row' spacing={1} flexWrap='wrap' gap={1}>
                {TIER_OPTIONS.map(t => (
                  <Chip
                    key={t.value}
                    label={`${t.icon} ${t.label}`}
                    variant={tiers.includes(t.value) ? 'filled' : 'outlined'}
                    color={tiers.includes(t.value) ? 'primary' : 'default'}
                    onClick={() => toggleTier(t.value)}
                    sx={{ cursor: 'pointer', fontWeight: tiers.includes(t.value) ? 700 : 400 }}
                  />
                ))}
                <Chip
                  label='Tất cả hạng'
                  variant={tiers.length === 0 ? 'filled' : 'outlined'}
                  color={tiers.length === 0 ? 'secondary' : 'default'}
                  onClick={() => setTiers([])}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>
            </Box>

            {/* Số đơn & Chi tiêu */}
            <Box className='grid grid-cols-2 gap-3'>
              <TextField
                label='Số đơn hàng ≥'
                size='small'
                type='number'
                value={minOrders}
                onChange={e => setMinOrders(e.target.value)}
                placeholder='VD: 3'
                inputProps={{ min: 0 }}
                InputProps={{ endAdornment: <Typography variant='caption' color='text.secondary'>đơn</Typography> }}
              />
              <TextField
                label='Tổng chi tiêu ≥'
                size='small'
                type='number'
                value={minSpend}
                onChange={e => setMinSpend(e.target.value)}
                placeholder='VD: 500000'
                inputProps={{ min: 0 }}
                InputProps={{ endAdornment: <Typography variant='caption' color='text.secondary'>đ</Typography> }}
              />
            </Box>

            {/* Ngày đăng ký & Không hoạt động */}
            <Box className='grid grid-cols-2 gap-3'>
              <TextField
                label='Đăng ký sau ngày'
                size='small'
                type='date'
                value={regAfter}
                onChange={e => setRegAfter(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label='Không mua trong X ngày'
                size='small'
                type='number'
                value={inactiveDays}
                onChange={e => setInactiveDays(e.target.value)}
                placeholder='VD: 30'
                inputProps={{ min: 1 }}
                InputProps={{ endAdornment: <Typography variant='caption' color='text.secondary'>ngày</Typography> }}
              />
            </Box>

            {/* Preview đối tượng */}
            <Box sx={{
              p: 2.5, borderRadius: 2, border: '2px solid',
              borderColor: 'primary.main',
              background: 'rgba(var(--mui-palette-primary-mainChannel)/0.04)',
              display: 'flex', alignItems: 'center', gap: 2
            }}>
              <Box sx={{
                width: 48, height: 48, borderRadius: 1.5, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel)/0.12)', color: 'primary.main'
              }}>
                <i className='tabler-users text-[24px]' />
              </Box>
              <Box className='flex-1'>
                <Typography variant='caption' color='text.secondary'>Ước tính số khách khớp điều kiện</Typography>
                <Box className='flex items-baseline gap-1'>
                  <Typography variant='h4' sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {estimatedCount.toLocaleString('vi-VN')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>/ {MOCK_CUSTOMER_TOTAL.toLocaleString('vi-VN')} khách hàng</Typography>
                </Box>
                {noFilter && (
                  <Typography variant='caption' color='warning.main'>
                    <i className='tabler-alert-triangle text-[13px]' /> Chưa lọc → sẽ gửi toàn bộ khách hàng
                  </Typography>
                )}
              </Box>
            </Box>
          </Stack>
        ) : step === 2 ? (
          <Stack spacing={3}>
            {/* Kênh thông báo */}
            <Box>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1, fontWeight: 600 }}>KÊNH GỬI THÔNG BÁO</Typography>
              <RadioGroup row value={channel} onChange={e => setChannel(e.target.value as any)}>
                <FormControlLabel value='push' control={<Radio size='small' />} label={
                  <Box className='flex items-center gap-1'><i className='tabler-bell text-[15px]' /><Typography variant='body2'>Push Notification</Typography></Box>
                } />
                <FormControlLabel value='email' control={<Radio size='small' />} label={
                  <Box className='flex items-center gap-1'><i className='tabler-mail text-[15px]' /><Typography variant='body2'>Email</Typography></Box>
                } />
                <FormControlLabel value='both' control={<Radio size='small' />} label={
                  <Box className='flex items-center gap-1'><i className='tabler-stack-2 text-[15px]' /><Typography variant='body2'>Cả hai</Typography></Box>
                } />
              </RadioGroup>
            </Box>

            <Divider />

            {/* Nội dung thông báo */}
            <TextField
              label='Tiêu đề thông báo'
              size='small'
              fullWidth
              defaultValue={`🎁 Voucher ${coupon.code} dành riêng cho bạn!`}
            />
            <TextField
              label='Nội dung tin nhắn'
              size='small'
              fullWidth
              multiline
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`VD: Chúng tôi gửi tặng bạn mã ${coupon.code} — ${formatVal}. Sử dụng ngay khi đặt eSIM!`}
            />

            {/* Preview card */}
            <Box sx={{
              p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider',
              backgroundColor: 'action.hover'
            }}>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1, fontWeight: 600 }}>XEM TRƯỚC THÔNG BÁO</Typography>
              <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Box className='flex items-center gap-2 mbe-1'>
                  <Box sx={{ width: 28, height: 28, borderRadius: 1, backgroundColor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className='tabler-device-mobile text-[14px] text-white' />
                  </Box>
                  <Typography variant='caption' sx={{ fontWeight: 700 }}>3M App</Typography>
                  <Typography variant='caption' color='text.disabled' sx={{ ml: 'auto' }}>vừa xong</Typography>
                </Box>
                <Typography variant='body2' sx={{ fontWeight: 700 }}>🎁 Voucher {coupon.code} dành riêng cho bạn!</Typography>
                <Typography variant='caption' color='text.secondary'>
                  {message || `Sử dụng mã ${coupon.code} để nhận ${formatVal} cho đơn eSIM tiếp theo.`}
                </Typography>
              </Box>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Alert severity='warning' variant='outlined' icon={<i className='tabler-alert-triangle' />}>
              Hãy kiểm tra kỹ thông tin trước khi gửi. Chiến dịch <strong>không thể thu hồi</strong> sau khi đã khởi chạy.
            </Alert>

            {/* Summary */}
            {[
              { icon: 'tabler-flag', label: 'Tên chiến dịch', value: campaignName || '(Không đặt tên)' },
              { icon: 'tabler-discount', label: 'Voucher gửi', value: `${coupon.code} — ${formatVal}` },
              { icon: 'tabler-users', label: 'Số khách nhận', value: `~${estimatedCount.toLocaleString('vi-VN')} khách hàng` },
              { icon: 'tabler-bell', label: 'Kênh thông báo', value: channel === 'push' ? 'Push Notification' : channel === 'email' ? 'Email' : 'Push + Email' },
              { icon: 'tabler-crown', label: 'Hạng thành viên', value: tiers.length > 0 ? TIER_OPTIONS.filter(t => tiers.includes(t.value)).map(t => `${t.icon} ${t.label}`).join(', ') : 'Tất cả hạng' },
              ...(minOrders ? [{ icon: 'tabler-shopping-cart', label: 'Số đơn tối thiểu', value: `≥ ${minOrders} đơn` }] : []),
              ...(minSpend ? [{ icon: 'tabler-cash', label: 'Chi tiêu tối thiểu', value: `≥ ${Number(minSpend).toLocaleString('vi-VN')}đ` }] : []),
              ...(inactiveDays ? [{ icon: 'tabler-clock-off', label: 'Không hoạt động', value: `≥ ${inactiveDays} ngày` }] : []),
            ].map((row, i) => (
              <Box key={i} className='flex items-center gap-3'>
                <Box sx={{ width: 32, height: 32, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'action.hover', color: 'text.secondary', flexShrink: 0 }}>
                  <i className={`${row.icon} text-[16px]`} />
                </Box>
                <Box className='flex-1 flex items-center justify-between'>
                  <Typography variant='body2' color='text.secondary'>{row.label}</Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.value}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        {sent ? (
          <Button variant='contained' fullWidth onClick={() => handleClose(`Đã gửi ${coupon.code} đến ~${estimatedCount.toLocaleString('vi-VN')} khách`)} startIcon={<i className='tabler-check' />}>
            Đóng
          </Button>
        ) : (
          <>
            <Button variant='tonal' color='secondary' onClick={step === 1 ? () => handleClose() : () => setStep(s => (s - 1) as any)} fullWidth>
              {step === 1 ? 'Huỷ' : 'Quay lại'}
            </Button>
            {step < 3 ? (
              <Button variant='contained' fullWidth onClick={() => setStep(s => (s + 1) as any)} endIcon={<i className='tabler-arrow-right' />}>
                Tiếp theo
              </Button>
            ) : (
              <Button
                variant='contained'
                color='success'
                fullWidth
                onClick={() => setSent(true)}
                startIcon={<i className='tabler-rocket' />}
              >
                Khởi chạy chiến dịch
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
