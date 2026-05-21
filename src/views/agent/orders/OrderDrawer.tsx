'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid2 from '@mui/material/Grid2'

import AppDrawer from '@/components/common/AppDrawer'

type OrderStatus = 'pending' | 'paid' | 'activated' | 'completed' | 'cancelled' | 'refunded'

type Order = {
  id: string
  customer: { name: string; phone: string }
  package: { name: string; country: string; flag: string }
  simType: 'esim' | 'physical'
  qty: number
  amountVND: number
  payment: string
  status: OrderStatus
  channel: string
  createdAt: string
  activatedAt: string | null
}

type Props = {
  open: boolean
  order: Order | null
  onClose: () => void
  paymentLabel: string
  channelLabel: string
  statusMeta: { label: string; color: 'warning' | 'info' | 'success' | 'error' | 'secondary' }
}

type TimelineStep = { key: OrderStatus; label: string; icon: string }

const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'pending', label: 'Tạo đơn', icon: 'tabler-shopping-cart' },
  { key: 'paid', label: 'Thanh toán', icon: 'tabler-credit-card' },
  { key: 'activated', label: 'Kích hoạt', icon: 'tabler-bolt' },
  { key: 'completed', label: 'Hoàn tất', icon: 'tabler-circle-check' }
]

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  paid: 1,
  activated: 2,
  completed: 3,
  cancelled: -1,
  refunded: -1
}

const OrderDrawer = ({ open, order, onClose, paymentLabel, channelLabel, statusMeta }: Props) => {
  if (!order) return null

  const reached = STATUS_ORDER[order.status]
  const isTerminated = order.status === 'cancelled' || order.status === 'refunded'

  const subject = (
    <Box className='flex items-start gap-3'>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          backgroundColor: 'action.hover',
          flexShrink: 0
        }}
      >
        {order.package.flag}
      </Box>
      <Box className='flex-1 min-is-0'>
        <Typography variant='h6' className='font-bold' noWrap>
          {order.package.name}
        </Typography>
        <Box className='flex items-center gap-2 mbs-1 flex-wrap'>
          <Chip size='small' variant='tonal' color={statusMeta.color} label={statusMeta.label} />
          <Chip
            size='small'
            variant='tonal'
            color={order.simType === 'esim' ? 'primary' : 'warning'}
            label={order.simType === 'esim' ? 'eSIM' : 'SIM vật lý'}
          />
        </Box>
      </Box>
    </Box>
  )

  const canCancel = order.status === 'pending'
  const canResend = order.simType === 'esim' && (order.status === 'paid' || order.status === 'activated' || order.status === 'completed')

  const footer = (
    <>
      <Button variant='tonal' color='secondary' onClick={onClose}>
        Đóng
      </Button>
      <Button variant='tonal' color='secondary' startIcon={<i className='tabler-printer text-[18px]' />}>
        In hoá đơn
      </Button>
      {canResend && (
        <Button variant='contained' startIcon={<i className='tabler-mail-forward text-[18px]' />}>
          Gửi lại eSIM
        </Button>
      )}
      {canCancel && (
        <Button variant='contained' color='error' startIcon={<i className='tabler-x text-[18px]' />}>
          Huỷ đơn
        </Button>
      )}
    </>
  )

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={600}
      title='Chi tiết đơn hàng'
      subtitle={order.id}
      subject={subject}
      footer={footer}
    >
      <Stack spacing={3}>
        {/* Timeline */}
        {!isTerminated && (
          <Box>
            <Typography variant='subtitle2' className='uppercase mbe-3' sx={{ letterSpacing: 0.8 }}>
              Tiến độ đơn hàng
            </Typography>
            <Box className='flex items-center justify-between' sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 18,
                  left: 18,
                  right: 18,
                  height: 2,
                  backgroundColor: 'divider',
                  zIndex: 0
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 18,
                  left: 18,
                  width: `calc(${(reached / (TIMELINE_STEPS.length - 1)) * 100}% - 36px * ${reached / (TIMELINE_STEPS.length - 1)})`,
                  maxWidth: 'calc(100% - 36px)',
                  height: 2,
                  backgroundColor: 'success.main',
                  zIndex: 0,
                  transition: 'width 0.3s ease'
                }}
              />
              {TIMELINE_STEPS.map((s, i) => {
                const done = i <= reached
                const current = i === reached
                return (
                  <Box
                    key={s.key}
                    className='flex flex-col items-center'
                    sx={{ position: 'relative', zIndex: 1 }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: done ? 'success.main' : 'background.paper',
                        border: '2px solid',
                        borderColor: done ? 'success.main' : 'divider',
                        color: done ? '#fff' : 'text.disabled',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <i className={`${done ? 'tabler-check' : s.icon} text-[16px]`} />
                    </Box>
                    <Typography
                      variant='caption'
                      sx={{
                        mt: 1,
                        fontWeight: current ? 700 : 500,
                        color: done ? 'text.primary' : 'text.disabled'
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}

        {isTerminated && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              backgroundColor: `rgba(var(--mui-palette-${statusMeta.color}-mainChannel) / 0.08)`,
              border: '1px solid',
              borderColor: `${statusMeta.color}.main`,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box sx={{ color: `${statusMeta.color}.main` }}>
              <i className={`${order.status === 'refunded' ? 'tabler-receipt-refund' : 'tabler-ban'} text-[24px]`} />
            </Box>
            <Box>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Đơn hàng đã {statusMeta.label.toLowerCase()}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Đơn không còn ở trạng thái xử lý.
              </Typography>
            </Box>
          </Box>
        )}

        <Divider />

        {/* Customer */}
        <Box>
          <Typography variant='subtitle2' className='uppercase mbe-2' sx={{ letterSpacing: 0.8 }}>
            Khách hàng
          </Typography>
          <InfoRow icon='tabler-user' label='Họ tên' value={order.customer.name} />
          <InfoRow icon='tabler-phone' label='Số điện thoại' value={order.customer.phone} />
        </Box>

        <Divider />

        {/* Package */}
        <Box>
          <Typography variant='subtitle2' className='uppercase mbe-2' sx={{ letterSpacing: 0.8 }}>
            Gói cước
          </Typography>
          <Grid2 container spacing={2}>
            <Cell label='Tên gói' value={order.package.name} />
            <Cell label='Quốc gia' value={`${order.package.flag} ${order.package.country}`} />
            <Cell label='Số lượng' value={order.qty.toString()} />
            <Cell label='Loại SIM' value={order.simType === 'esim' ? 'eSIM' : 'SIM vật lý'} />
          </Grid2>
        </Box>

        <Divider />

        {/* Payment */}
        <Box>
          <Typography variant='subtitle2' className='uppercase mbe-2' sx={{ letterSpacing: 0.8 }}>
            Thanh toán
          </Typography>
          <Grid2 container spacing={2}>
            <Cell label='Cổng thanh toán' value={paymentLabel} />
            <Cell label='Kênh đặt đơn' value={channelLabel} />
            <Cell label='Ngày đặt' value={order.createdAt} />
            <Cell label='Ngày kích hoạt' value={order.activatedAt ?? 'Chưa kích hoạt'} muted={!order.activatedAt} />
          </Grid2>

          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1.5,
              backgroundColor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography variant='caption' color='text.secondary'>
                Tổng tiền
              </Typography>
              <Typography variant='h5' className='font-bold'>
                {order.amountVND.toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
            <Box className='text-right'>
              <Typography variant='caption' color='text.secondary'>
                Đơn giá
              </Typography>
              <Typography variant='body2'>
                {Math.round(order.amountVND / order.qty).toLocaleString('vi-VN')}đ × {order.qty}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Stack>
    </AppDrawer>
  )
}

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <Box className='flex items-center gap-3 mbe-2'>
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
      <Typography variant='body2' sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Box>
)

const Cell = ({ label, value, muted }: { label: string; value: string; muted?: boolean }) => (
  <Grid2 size={6}>
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Typography variant='body2' sx={{ fontWeight: 500, color: muted ? 'text.disabled' : 'text.primary' }}>
      {value}
    </Typography>
  </Grid2>
)

export default OrderDrawer
