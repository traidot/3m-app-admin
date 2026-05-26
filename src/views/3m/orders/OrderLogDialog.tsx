'use client'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

import { type Order } from './data'

type Props = {
  open: boolean
  order: Order | null
  onClose: () => void
}

type LogStep = {
  time: string
  event: string
}

const OrderLogDialog = ({ open, order, onClose }: Props) => {
  if (!order) return null

  let steps: LogStep[] = []
  try {
    steps = JSON.parse(order.activationLog)
  } catch (e) {
    steps = [{ time: '--:--:--', event: order.activationLog }]
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle className='flex items-center justify-between p-5'>
        <Box>
          <Typography variant='h5' className='font-bold'>
            Nhật ký cấp phát eSIM
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Đơn hàng: {order.id} · eSIM: {order.packageName}
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 5 }}>
        <Typography variant='subtitle2' className='font-bold mbe-2'>
          Thông tin Kỹ thuật đơn hàng:
        </Typography>
        <Stack spacing={2} className='mbe-4'>
          <Box className='flex justify-between'>
            <Typography variant='body2' color='text.secondary'>Nhà cung cấp nguồn:</Typography>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>{order.supplier}</Typography>
          </Box>
          <Box className='flex justify-between'>
            <Typography variant='body2' color='text.secondary'>Giá gốc (Cost USD):</Typography>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>${order.costUSD.toFixed(2)}</Typography>
          </Box>
          <Box className='flex justify-between'>
            <Typography variant='body2' color='text.secondary'>Giá bán Đại lý (VND):</Typography>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>{order.retailPriceVND.toLocaleString('vi-VN')}đ</Typography>
          </Box>
        </Stack>

        <Typography variant='subtitle2' className='font-bold mbe-2'>
          Chi tiết log API & Kết nối mạng:
        </Typography>
        
        {/* Terminal log wrapper */}
        <Box
          sx={{
            bgcolor: '#1e1e1e',
            color: '#a9b7c6',
            fontFamily: 'monospace',
            p: 4,
            borderRadius: 1.5,
            maxHeight: 280,
            overflowY: 'auto',
            fontSize: '12px',
            lineHeight: 1.6,
            border: '1px solid #333'
          }}
        >
          {steps.map((step, idx) => (
            <Box key={idx} className='mbe-2 flex gap-3 items-start'>
              <Box component='span' sx={{ color: '#28c76f', flexShrink: 0 }}>
                [{step.time}]
              </Box>
              <Box component='span' sx={{ color: step.event.toLowerCase().includes('lỗi') || step.event.toLowerCase().includes('thất bại') ? '#ea5455' : '#a9b7c6' }}>
                {step.event}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions className='p-4'>
        <Button variant='contained' onClick={onClose}>
          Đóng cửa sổ
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderLogDialog
