'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import { type Agent, type AgentTier } from './data'

type Props = {
  open: boolean
  mode: 'view' | 'edit'
  agent: Agent | null
  onClose: () => void
  onSave: (next: Agent) => void
  onSwitchMode: (mode: 'view' | 'edit') => void
}

const emptyAgent = (): Agent => ({
  id: '',
  name: '',
  owner: '',
  phone: '',
  email: '',
  tier: 'Silver',
  walletBalanceVND: 0,
  totalSalesVND: 0,
  ordersCount: 0,
  apiKeyEnabled: false,
  status: 'active',
  joinedAt: new Date().toISOString().split('T')[0]
})

const AgentDrawer = ({ open, mode, agent, onClose, onSave, onSwitchMode }: Props) => {
  const [form, setForm] = useState<Agent>(agent ?? emptyAgent())

  useEffect(() => {
    if (agent) {
      setForm(agent)
    } else {
      setForm(emptyAgent())
    }
  }, [agent, open])

  const setField = <K extends keyof Agent>(key: K, value: Agent[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 480 } } }}
    >
      {/* Header */}
      <Box className='flex items-center justify-between p-5' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box>
          <Typography variant='h5' className='font-bold'>
            {mode === 'view' && 'Hồ sơ đại lý'}
            {mode === 'edit' && 'Cập nhật thông tin đại lý'}
          </Typography>
          {agent && (
            <Typography variant='caption' color='text.secondary'>
              Mã đại lý: {form.id} · Hoạt động từ {form.joinedAt}
            </Typography>
          )}
        </Box>
        <IconButton size='small' onClick={onClose}>
          <i className='tabler-x text-[20px]' />
        </IconButton>
      </Box>

      {/* Content */}
      <Box className='flex-1 overflow-y-auto p-5'>
        {mode === 'view' && (
          <Stack spacing={5}>
            {/* Core Info */}
            <Box>
              <Typography variant='h6' className='font-bold mbe-3'>Thông tin chung</Typography>
              <Stack spacing={3}>
                <Box className='flex justify-between'>
                  <Typography color='text.secondary' variant='body2'>Tên thương hiệu:</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='body2'>{form.name}</Typography>
                </Box>
                <Box className='flex justify-between'>
                  <Typography color='text.secondary' variant='body2'>Chủ sở hữu:</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='body2'>{form.owner}</Typography>
                </Box>
                <Box className='flex justify-between'>
                  <Typography color='text.secondary' variant='body2'>Cấp bậc (Tier):</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='body2'>{form.tier}</Typography>
                </Box>
                <Box className='flex justify-between'>
                  <Typography color='text.secondary' variant='body2'>API Gateway:</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='body2' color={form.apiKeyEnabled ? 'success.main' : 'text.disabled'}>
                    {form.apiKeyEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Financial Metrics */}
            <Box>
              <Typography variant='h6' className='font-bold mbe-3'>Chỉ số tài chính</Typography>
              <Stack spacing={3}>
                <Box className='flex justify-between items-center'>
                  <Typography color='text.secondary' variant='body2'>Ví ký quỹ hiện tại:</Typography>
                  <Typography sx={{ fontWeight: 700 }} variant='body1' color={form.walletBalanceVND >= 0 ? 'success.main' : 'error.main'}>
                    {form.walletBalanceVND.toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>
                <Box className='flex justify-between'>
                  <Typography color='text.secondary' variant='body2'>Tổng doanh số bán lẻ:</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='body2'>{form.totalSalesVND.toLocaleString('vi-VN')}đ</Typography>
                </Box>
                <Box className='flex justify-between'>
                  <Typography color='text.secondary' variant='body2'>Tổng số đơn hàng:</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='body2'>{form.ordersCount.toLocaleString('vi-VN')} đơn</Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Contact details */}
            <Box>
              <Typography variant='h6' className='font-bold mbe-3'>Liên hệ</Typography>
              <Stack spacing={3}>
                <Box className='flex justify-between'>
                  <Typography color='text.secondary' variant='body2'>Số điện thoại:</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='body2'>{form.phone}</Typography>
                </Box>
                <Box className='flex justify-between'>
                  <Typography color='text.secondary' variant='body2'>Email:</Typography>
                  <Typography sx={{ fontWeight: 600 }} variant='body2'>{form.email}</Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        )}

        {mode === 'edit' && (
          <Stack spacing={4}>
            <TextField
              fullWidth
              label='Tên đại lý'
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              variant='outlined'
            />
            <TextField
              fullWidth
              label='Chủ sở hữu'
              value={form.owner}
              onChange={e => setField('owner', e.target.value)}
              variant='outlined'
            />
            <TextField
              fullWidth
              label='Số điện thoại'
              value={form.phone}
              onChange={e => setField('phone', e.target.value)}
              variant='outlined'
            />
            <TextField
              fullWidth
              label='Email'
              value={form.email}
              onChange={e => setField('email', e.target.value)}
              variant='outlined'
            />
            <TextField
              fullWidth
              select
              label='Cấp bậc (Tier)'
              value={form.tier}
              onChange={e => setField('tier', e.target.value as AgentTier)}
              variant='outlined'
            >
              <MenuItem value='Platinum'>Platinum</MenuItem>
              <MenuItem value='Gold'>Gold</MenuItem>
              <MenuItem value='Silver'>Silver</MenuItem>
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={form.apiKeyEnabled}
                  onChange={e => setField('apiKeyEnabled', e.target.checked)}
                  color='primary'
                />
              }
              label='Kích hoạt cổng tích hợp API Gateway'
            />
          </Stack>
        )}

      </Box>

      {/* Footer */}
      <Box className='p-5' sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction='row' spacing={2} className='w-full'>
          {mode === 'view' && (
            <Button
              fullWidth
              variant='contained'
              color='primary'
              onClick={() => onSwitchMode('edit')}
              startIcon={<i className='tabler-pencil text-[18px]' />}
            >
              Sửa thông tin
            </Button>
          )}

          {mode === 'edit' && (
            <>
              <Button variant='tonal' color='secondary' className='flex-1' onClick={() => onSwitchMode('view')}>
                Quay lại
              </Button>
              <Button variant='contained' color='primary' className='flex-1' onClick={handleSave}>
                Lưu thay đổi
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Drawer>
  )
}

export default AgentDrawer
