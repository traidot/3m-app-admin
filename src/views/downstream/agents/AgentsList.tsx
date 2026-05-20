'use client'

import { useState } from 'react'
import Link from 'next/link'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'

import PageHeader from '@/components/layout/shared/PageHeader'

const AgentsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openAddDialog, setOpenAddDialog] = useState(false)
  
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    tier: 'SILVER',
    type: 'prepaid',
    initialAmount: ''
  })

  const agents = [
    { id: 'A001', name: 'TravelConnect Solutions', email: 'contact@travelconnect.vn', tier: 'PLATINUM', balance: '$5,240.00', status: 'Active', orders: 1240, color: 'primary', type: 'postpaid' },
    { id: 'A002', name: 'Global eSIM Hub', email: 'hub@globale.sim', tier: 'GOLD', balance: '$1,120.50', status: 'Active', orders: 850, color: 'warning', type: 'prepaid' },
    { id: 'A003', name: 'CheapData Agency', email: 'sales@cheapdata.com', tier: 'SILVER', balance: '$15.00', status: 'Low Balance', orders: 45, color: 'secondary', type: 'prepaid' },
    { id: 'A004', name: 'Nomad Partner', email: 'partner@nomad.com', tier: 'GOLD', balance: '$0.00', status: 'Inactive', orders: 0, color: 'error', type: 'prepaid' }
  ]

  const handleCloseDialog = () => {
    setOpenAddDialog(false)
    setNewAgent({
      name: '',
      email: '',
      tier: 'SILVER',
      type: 'prepaid',
      initialAmount: ''
    })
  }

  return (
    <>
      <PageHeader
        title="Quản lý Đại lý (Agents)"
        description="Quản lý mạng lưới phân phối, số dư ví và cấu hình chiết khấu cho từng đối tác"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân phối' }, { label: 'Đại lý' }]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button variant='contained' onClick={() => setOpenAddDialog(true)} startIcon={<i className='tabler-plus' />}>Thêm Đại lý</Button>
          </Stack>
        }
        className='mbe-6'
      />

      {/* Advanced Filters */}
      <Card className='border-none shadow-sm mbe-6'>
        <CardContent className='p-4'>
          <Grid2 container spacing={4} className='items-end'>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Tìm kiếm đại lý</Typography>
              <TextField 
                fullWidth 
                size='small' 
                placeholder='Tên, email, mã đại lý...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Cấp bậc (Tier)</Typography>
              <Select fullWidth size='small' value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả cấp bậc</MenuItem>
                <MenuItem value='PLATINUM'>Platinum</MenuItem>
                <MenuItem value='GOLD'>Gold</MenuItem>
                <MenuItem value='SILVER'>Silver</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 6, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Trạng thái</Typography>
              <Select fullWidth size='small' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                <MenuItem value='Active'>Hoạt động</MenuItem>
                <MenuItem value='Low Balance'>Sắp hết tiền</MenuItem>
                <MenuItem value='Inactive'>Tạm dừng</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 2 }}>
              <Button fullWidth variant='tonal' color='secondary' startIcon={<i className='tabler-filter-off' />}>Xóa lọc</Button>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Grid2 container spacing={6}>
        {agents.map((agent) => (
          <Grid2 key={agent.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card className='h-full border-none shadow-sm hover:shadow-md transition-all group border-2 border-transparent hover:border-primary/20'>
              <CardContent className='p-6'>
                <Box className='flex justify-between items-start mbe-4'>
                  <Box className='flex items-center gap-3'>
                    <Avatar 
                      variant='rounded' 
                      className={`bg-${agent.color}/10 text-${agent.color} w-[56px] h-[56px] font-black`}
                    >
                      {agent.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant='h5' className='font-black line-clamp-1'>{agent.name}</Typography>
                      <Typography variant='body2' className='text-slate-400'>{agent.id} • {agent.email}</Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={agent.status} 
                    size='small' 
                    color={agent.status === 'Active' ? 'success' : agent.status === 'Low Balance' ? 'error' : 'default'}
                    variant='tonal'
                    className='font-black uppercase text-[10px]'
                  />
                </Box>

                <Divider className='mbe-4 border-dashed' />

                <Grid2 container spacing={4} className='mbe-6'>
                  <Grid2 size={{ xs: 4 }}>
                    <Typography variant='caption' className='font-black uppercase text-slate-400 block mbe-1 text-[10px]'>Cấp bậc</Typography>
                    <Typography variant='body2' className={`font-black text-${agent.color}`}>{agent.tier}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 4 }}>
                    <Typography variant='caption' className='font-black uppercase text-slate-400 block mbe-1 text-[10px]'>Đơn (Tổng)</Typography>
                    <Typography variant='body2' className='font-black'>{agent.orders.toLocaleString()}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 4 }}>
                    <Typography variant='caption' className='font-black uppercase text-slate-400 block mbe-1 text-[10px]'>
                      {agent.type === 'postpaid' ? 'Công nợ' : 'Ví'}
                    </Typography>
                    <Typography variant='body2' className={`font-black ${agent.type === 'postpaid' ? 'text-error' : 'text-success'}`}>
                      {agent.balance}
                    </Typography>
                  </Grid2>
                </Grid2>

                <Button 
                  fullWidth 
                  variant='contained' 
                  className='shadow-none group-hover:shadow-lg transition-all py-2.5'
                  startIcon={<i className='tabler-user-cog' />}
                  component={Link}
                  href={`/3m/downstream/agents/${agent.id.toLowerCase()}`}
                >
                  Chi tiết Đại lý
                </Button>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Add Agent Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle component='div' className='flex justify-between items-center border-be'>
          <Box>
            <Typography variant='h5' className='font-black'>Thêm Đại lý mới</Typography>
            <Typography variant='caption' className='text-slate-500 uppercase font-bold tracking-widest'>Đăng ký đối tác phân phối</Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} size='small' className='bg-slate-100'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          <Grid2 container spacing={5} className='mbs-2'>
            <Grid2 size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label='Tên Đại lý / Công ty' 
                placeholder='VD: TravelConnect Solutions'
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label='Email liên hệ' 
                placeholder='VD: contact@travel.vn'
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <Typography variant='caption' className='mbe-1 font-black text-slate-500 uppercase'>Cấp bậc Đại lý</Typography>
                <Select 
                  value={newAgent.tier}
                  onChange={(e) => setNewAgent({ ...newAgent, tier: e.target.value })}
                >
                  <MenuItem value='PLATINUM'>Platinum (+5%)</MenuItem>
                  <MenuItem value='GOLD'>Gold (+10%)</MenuItem>
                  <MenuItem value='SILVER'>Silver (+15%)</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset">
                <Typography variant='caption' className='mbe-1 font-black text-slate-500 uppercase'>Hình thức Thanh toán</Typography>
                <RadioGroup 
                  row 
                  value={newAgent.type}
                  onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value })}
                >
                  <FormControlLabel value="prepaid" control={<Radio size='small' />} label={<Typography variant='body2'>Ví</Typography>} />
                  <FormControlLabel value="postpaid" control={<Radio size='small' />} label={<Typography variant='body2'>Công nợ</Typography>} />
                </RadioGroup>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label={newAgent.type === 'prepaid' ? 'Số dư ví ban đầu' : 'Công nợ ban đầu'} 
                placeholder='0.00'
                type='number'
                value={newAgent.initialAmount}
                onChange={(e) => setNewAgent({ ...newAgent, initialAmount: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>
                }}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions className='p-6 pt-0 flex gap-3'>
          <Button fullWidth variant='tonal' color='secondary' onClick={handleCloseDialog} className='font-black'>Hủy bỏ</Button>
          <Button fullWidth variant='contained' onClick={handleCloseDialog} className='font-black'>Tạo Đại lý</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AgentsList
