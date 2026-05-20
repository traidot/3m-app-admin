'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'

import PageHeader from '@/components/layout/shared/PageHeader'

const TierDetail = ({ id }: { id: string }) => {
  const router = useRouter()
  const tierName = id.toUpperCase()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  let color = 'primary'
  if (tierName === 'GOLD') color = 'warning'
  if (tierName === 'SILVER') color = 'secondary'

  const mockAgents = [
    { id: 'a001', name: 'Đại lý Toàn Cầu', email: 'global@example.com' },
    { id: 'a002', name: 'E-sim Việt Nam', email: 'vn@example.com' },
    { id: 'a003', name: 'Phụ kiện Số', email: 'pk@example.com' },
    { id: 'a004', name: 'Travel Sim Store', email: 'store@example.com' }
  ]

  return (
    <>
      <PageHeader
        title={`Cấu hình Cấp bậc: ${tierName}`}
        description="Quản lý chi tiết tỉ lệ nâng giá cho cấp bậc này."
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân phối' }, { label: 'Cấp bậc', href: '/3m/downstream/tiers' }, { label: tierName }]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button variant='tonal' color='secondary'>Hủy</Button>
            <Button variant='contained' startIcon={<i className='tabler-device-floppy' />}>Lưu thay đổi</Button>
          </Stack>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Stack spacing={6}>
            {/* Essential Configuration */}
            <Card className='border-none shadow-sm'>
              <CardContent className='p-6'>
                <Typography variant='h6' className='font-black mbe-6'>Cấu hình Nâng giá</Typography>
                <Grid2 container spacing={6}>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Tỉ lệ nâng giá (%)</Typography>
                    <TextField 
                      fullWidth 
                      defaultValue={tierName === 'PLATINUM' ? 5 : tierName === 'GOLD' ? 10 : 15} 
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                        className: 'font-black text-lg'
                      }}
                      helperText="Phần trăm cộng thêm vào giá gốc (Upstream Cost)."
                    />
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>

            <Card className='border-none shadow-sm'>
              <CardContent className='p-6'>
                <Typography variant='h6' className='font-black mbe-4'>Mô tả & Ghi chú</Typography>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={2} 
                  placeholder='Mô tả ngắn gọn về đặc quyền của cấp bậc này...'
                  defaultValue={`Cấp bậc ${tierName} dành cho đối tác chiến lược.`} 
                />
              </CardContent>
            </Card>
          </Stack>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack spacing={6}>
            <Card className='border-none shadow-sm bg-slate-50 border-is-[5px]' sx={{ borderLeftColor: `${color}.main` }}>
              <CardContent className='flex flex-col items-center text-center p-8'>
                <Avatar 
                  variant='rounded' 
                  sx={{ width: 64, height: 64, bgcolor: `${color}.main`, color: 'white', mbe: 4 }}
                >
                  <i className='tabler-trophy text-3xl' />
                </Avatar>
                <Typography variant='h4' className='font-black mbe-2'>{tierName}</Typography>
                <Typography variant='body2' className='text-slate-500 mbe-6 font-bold'>45 Đại lý đang áp dụng</Typography>
                <Button 
                  fullWidth 
                  variant='outlined' 
                  startIcon={<i className='tabler-users' />}
                  onClick={() => setIsDialogOpen(true)}
                >
                  Xem danh sách
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid2>
      </Grid2>

      {/* Agents List Dialog */}
      {/* Agents List Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        fullWidth 
        maxWidth='sm'
        PaperProps={{ className: 'rounded-2xl shadow-xl border-none overflow-hidden' }}
      >
        <DialogTitle className='p-6 bg-slate-50/50 flex justify-between items-center border-b'>
          <Box className='flex items-center gap-3'>
            <Avatar variant='rounded' sx={{ bgcolor: `${color}.main`, color: 'white', width: 40, height: 40 }}>
              <i className='tabler-users text-xl' />
            </Avatar>
            <Box>
              <Typography variant='h6' className='font-black leading-tight'>Danh sách Đại lý</Typography>
              <Typography variant='caption' className='font-bold text-slate-500 lowercase'>Phân loại: {tierName}</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setIsDialogOpen(false)} size='small' className='bg-white shadow-sm border border-slate-200'>
            <i className='tabler-x text-lg' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-0'>
          <Box className='p-4 bg-white sticky top-0 z-10 border-b'>
            <TextField 
              fullWidth 
              placeholder='Tìm kiếm đại lý trong nhóm...' 
              size='small'
              InputProps={{
                startAdornment: <InputAdornment position='start'><i className='tabler-search text-slate-400' /></InputAdornment>,
                className: 'bg-slate-50 border-none'
              }}
            />
          </Box>
          <List className='py-0'>
            {mockAgents.map((agent, index) => {
              const agentColors = ['#7367F0', '#00BAD1', '#FF9F43', '#28C76F'];
              const agentColor = agentColors[index % agentColors.length];

              return (
              <ListItem key={agent.id} disablePadding className='border-b last:border-0 hover:bg-slate-50/50 transition-colors'>
                <ListItemButton className='p-4' onClick={() => router.push(`/3m/downstream/agents/${agent.id}`)}>
                  <ListItemAvatar>
                    <Avatar 
                      variant='rounded'
                      sx={{ 
                        bgcolor: `${agentColor}15`, 
                        color: agentColor,
                        fontWeight: 900,
                        fontSize: '14px' 
                      }}
                    >
                      {agent.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                    primary={
                      <Box className='flex items-center gap-2'>
                        <Typography className='font-black text-slate-800'>{agent.name}</Typography>
                        <Chip label='Active' size='small' color='success' variant='tonal' sx={{ height: 16, fontSize: '9px', fontWeight: 'bold' }} />
                      </Box>
                    } 
                    secondary={
                      <Stack direction='row' spacing={2} className='mbs-0.5'>
                        <Typography variant='caption' className='flex items-center gap-1 font-bold'>
                          <i className='tabler-mail text-xs text-slate-400' /> {agent.email}
                        </Typography>
                        <Typography variant='caption' className='flex items-center gap-1 font-bold'>
                          <i className='tabler-hash text-xs text-slate-400' /> ID: {agent.id}
                        </Typography>
                      </Stack>
                    } 
                  />
                  <Box className='flex flex-col items-end'>
                    <Typography variant='caption' className='font-black text-primary'>$12,450</Typography>
                    <Typography variant='caption' className='text-[9px] font-bold text-slate-400 uppercase'>Doanh số</Typography>
                  </Box>
                  <i className='tabler-chevron-right text-slate-300 ms-4' />
                </ListItemButton>
              </ListItem>
            )})}
          </List>
        </DialogContent>
        <Box className='p-4 bg-slate-50 text-center border-t'>
          <Typography variant='caption' className='font-bold text-slate-500'>Hiển thị 4 trên tổng số 45 đại lý</Typography>
        </Box>
      </Dialog>
    </>
  )
}

export default TierDetail
