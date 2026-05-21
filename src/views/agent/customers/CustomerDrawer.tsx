'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Grid2 from '@mui/material/Grid2'

import AppDrawer from '@/components/common/AppDrawer'
import { statusChip, typeChip, initials, type Customer } from './data'

export type DrawerMode = 'view' | 'edit'

type Props = {
  open: boolean
  mode: DrawerMode
  customer: Customer | null
  onClose: () => void
  onSave: (next: Customer) => void
  onSwitchMode: (mode: DrawerMode) => void
}

const CustomerDrawer = ({ open, customer, onClose, onSave }: Props) => {
  const [form, setForm] = useState<Customer | null>(customer)

  useEffect(() => {
    setForm(customer)
  }, [customer, open])

  if (!customer || !form) return null

  const setField = <K extends keyof Customer>(key: K, value: Customer[K]) =>
    setForm(prev => (prev ? { ...prev, [key]: value } : prev))

  const subject = (
    <Box className='flex items-center gap-3'>
      <Avatar
        sx={{
          width: 56,
          height: 56,
          bgcolor: `rgba(var(--mui-palette-primary-mainChannel) / 0.12)`,
          color: 'primary.main',
          fontWeight: 700,
          fontSize: 18
        }}
      >
        {initials(customer.name)}
      </Avatar>
      <Box className='flex-1 min-is-0'>
        <Typography variant='h5' className='font-bold' noWrap>
          {customer.name}
        </Typography>
        <Box className='flex items-center gap-2 mbs-1 flex-wrap'>
          {typeChip(customer.type)}
          {statusChip(customer.status)}
        </Box>
      </Box>
    </Box>
  )

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
      >
        Lưu thay đổi
      </Button>
    </>
  )

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={560}
      title='Chỉnh sửa khách hàng'
      subtitle={customer.id}
      subject={subject}
      footer={footer}
    >
      <Stack spacing={3}>
        <Typography variant='subtitle2' className='uppercase' sx={{ letterSpacing: 0.8 }}>
          Thông tin liên hệ
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 size={12}>
            <TextField
              size='small'
              fullWidth
              label='Họ và tên'
              value={form.name}
              onChange={e => setField('name', e.target.value)}
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              size='small'
              fullWidth
              label='Số điện thoại'
              value={form.phone}
              onChange={e => setField('phone', e.target.value)}
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              size='small'
              fullWidth
              label='Email'
              value={form.email}
              onChange={e => setField('email', e.target.value)}
            />
          </Grid2>
        </Grid2>

        <Divider />

        <Typography variant='subtitle2' className='uppercase' sx={{ letterSpacing: 0.8 }}>
          Phân loại & trạng thái
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 size={6}>
            <TextField
              size='small'
              fullWidth
              select
              label='Loại khách'
              value={form.type}
              onChange={e => setField('type', e.target.value as Customer['type'])}
            >
              <MenuItem value='individual'>Cá nhân</MenuItem>
              <MenuItem value='business'>Doanh nghiệp</MenuItem>
              <MenuItem value='vip'>VIP</MenuItem>
            </TextField>
          </Grid2>
          <Grid2 size={6}>
            <TextField
              size='small'
              fullWidth
              select
              label='Trạng thái'
              value={form.status}
              onChange={e => setField('status', e.target.value as Customer['status'])}
            >
              <MenuItem value='active'>Hoạt động</MenuItem>
              <MenuItem value='inactive'>Không hoạt động</MenuItem>
              <MenuItem value='blocked'>Đã khoá</MenuItem>
            </TextField>
          </Grid2>
          <Grid2 size={12}>
            <TextField
              size='small'
              fullWidth
              select
              label='Kênh đăng ký'
              value={form.channel}
              onChange={e => setField('channel', e.target.value as Customer['channel'])}
            >
              <MenuItem value='app'>App</MenuItem>
              <MenuItem value='web'>Website</MenuItem>
              <MenuItem value='referral'>Giới thiệu</MenuItem>
              <MenuItem value='imported'>Import</MenuItem>
            </TextField>
          </Grid2>
        </Grid2>
      </Stack>
    </AppDrawer>
  )
}

export default CustomerDrawer
