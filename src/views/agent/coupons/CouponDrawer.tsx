'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Grid2 from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import AppDrawer from '@/components/common/AppDrawer'
import { type Coupon } from './data'

export type DrawerMode = 'edit' | 'create'

type Props = {
  open: boolean
  mode: DrawerMode
  coupon: Coupon | null
  onClose: () => void
  onSave: (next: Coupon) => void
}

const emptyCoupon = (): Coupon => ({
  id: `CPN-${Math.floor(Math.random() * 9000 + 1000)}`,
  code: '',
  name: '',
  description: '',
  type: 'percent',
  value: 10,
  minOrderVND: null,
  maxDiscountVND: null,
  usageLimit: null,
  perCustomerLimit: 1,
  usedCount: 0,
  sentCount: 0,
  scope: 'all',
  startAt: new Date().toISOString().slice(0, 10),
  endAt: null,
  status: 'active',
  createdAt: new Date().toISOString().slice(0, 10)
})

const CouponDrawer = ({ open, mode, coupon, onClose, onSave }: Props) => {
  const [form, setForm] = useState<Coupon>(coupon ?? emptyCoupon())

  useEffect(() => {
    setForm(coupon ?? emptyCoupon())
  }, [coupon, open])

  const isCreate = mode === 'create'

  const setField = <K extends keyof Coupon>(key: K, value: Coupon[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const footer = (
    <>
      <Button variant='tonal' color='secondary' onClick={onClose}>
        Huỷ
      </Button>
      <Button
        variant='contained'
        startIcon={<i className='tabler-device-floppy text-[18px]' />}
        onClick={() => {
          onSave(form)
          onClose()
        }}
        disabled={!form.code.trim() || !form.name.trim()}
      >
        {isCreate ? 'Tạo coupon' : 'Lưu thay đổi'}
      </Button>
    </>
  )

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={600}
      title={isCreate ? 'Thêm coupon mới' : 'Chỉnh sửa coupon'}
      subtitle={isCreate ? undefined : form.id}
      footer={footer}
    >
      <Stack spacing={3}>
        {/* Basic info */}
        <Box>
          <Typography variant='subtitle2' className='uppercase mbe-2' sx={{ letterSpacing: 0.8 }}>
            Thông tin cơ bản
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                label='Mã coupon'
                value={form.code}
                onChange={e => setField('code', e.target.value.toUpperCase())}
                placeholder='VD: SUMMER2026'
                inputProps={{ style: { fontFamily: 'monospace', textTransform: 'uppercase' } }}
                disabled={!isCreate}
                helperText={!isCreate ? 'Không thể đổi mã sau khi tạo' : 'Viết liền, không dấu'}
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                label='Tên hiển thị'
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                placeholder='VD: Khuyến mãi mùa hè'
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                size='small'
                fullWidth
                multiline
                rows={2}
                label='Mô tả'
                value={form.description ?? ''}
                onChange={e => setField('description', e.target.value)}
                placeholder='Mô tả ngắn hiển thị cho khách hàng...'
              />
            </Grid2>
          </Grid2>
        </Box>

        <Divider />

        {/* Discount */}
        <Box>
          <Typography variant='subtitle2' className='uppercase mbe-2' sx={{ letterSpacing: 0.8 }}>
            Giá trị giảm giá
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                select
                label='Loại giảm'
                value={form.type}
                onChange={e => setField('type', e.target.value as Coupon['type'])}
              >
                <MenuItem value='percent'>Phần trăm (%)</MenuItem>
                <MenuItem value='fixed'>Số tiền cố định</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                type='number'
                label={form.type === 'percent' ? 'Giá trị (%)' : 'Giá trị (VND)'}
                value={form.value}
                onChange={e => setField('value', Number(e.target.value))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>{form.type === 'percent' ? '%' : 'đ'}</InputAdornment>
                  )
                }}
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                type='number'
                label='Đơn tối thiểu'
                value={form.minOrderVND ?? ''}
                onChange={e => setField('minOrderVND', e.target.value ? Number(e.target.value) : null)}
                placeholder='Bỏ trống nếu không giới hạn'
                InputProps={{ endAdornment: <InputAdornment position='end'>đ</InputAdornment> }}
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                type='number'
                label='Giảm tối đa'
                value={form.maxDiscountVND ?? ''}
                onChange={e => setField('maxDiscountVND', e.target.value ? Number(e.target.value) : null)}
                disabled={form.type === 'fixed'}
                placeholder={form.type === 'fixed' ? 'Không cần (giảm cố định)' : 'Bỏ trống = không giới hạn'}
                InputProps={{ endAdornment: <InputAdornment position='end'>đ</InputAdornment> }}
              />
            </Grid2>
          </Grid2>
        </Box>

        <Divider />

        {/* Scope + Usage */}
        <Box>
          <Typography variant='subtitle2' className='uppercase mbe-2' sx={{ letterSpacing: 0.8 }}>
            Phạm vi & giới hạn
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={12}>
              <TextField
                size='small'
                fullWidth
                select
                label='Áp dụng cho'
                value={form.scope}
                onChange={e => setField('scope', e.target.value as Coupon['scope'])}
              >
                <MenuItem value='all'>Toàn bộ gói cước</MenuItem>
                <MenuItem value='first_order'>Đơn hàng đầu tiên của khách</MenuItem>
                <MenuItem value='specific_packages'>Gói cước chỉ định</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                type='number'
                label='Tổng lượt dùng tối đa'
                value={form.usageLimit ?? ''}
                onChange={e => setField('usageLimit', e.target.value ? Number(e.target.value) : null)}
                placeholder='Bỏ trống = không giới hạn'
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                type='number'
                label='Mỗi khách dùng tối đa'
                value={form.perCustomerLimit ?? ''}
                onChange={e => setField('perCustomerLimit', e.target.value ? Number(e.target.value) : null)}
                placeholder='Bỏ trống = không giới hạn'
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                type='number'
                label='Số lượng đã gửi'
                value={form.sentCount}
                onChange={e => setField('sentCount', Number(e.target.value))}
                placeholder='Số lượng coupon đã phát hành'
              />
            </Grid2>
          </Grid2>
        </Box>

        <Divider />

        {/* Time + Status */}
        <Box>
          <Typography variant='subtitle2' className='uppercase mbe-2' sx={{ letterSpacing: 0.8 }}>
            Thời gian & trạng thái
          </Typography>
          <Grid2 container spacing={3}>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                type='date'
                label='Ngày bắt đầu'
                value={form.startAt}
                onChange={e => setField('startAt', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                size='small'
                fullWidth
                type='date'
                label='Ngày kết thúc'
                value={form.endAt ?? ''}
                onChange={e => setField('endAt', e.target.value || null)}
                InputLabelProps={{ shrink: true }}
                helperText='Bỏ trống = không hết hạn'
              />
            </Grid2>
            <Grid2 size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.status === 'active' || form.status === 'scheduled'}
                    onChange={e => setField('status', e.target.checked ? 'active' : 'paused')}
                  />
                }
                label={form.status === 'paused' ? 'Tạm dừng (khách không thể dùng)' : 'Đang kích hoạt'}
              />
            </Grid2>
          </Grid2>
        </Box>
      </Stack>
    </AppDrawer>
  )
}

export default CouponDrawer
