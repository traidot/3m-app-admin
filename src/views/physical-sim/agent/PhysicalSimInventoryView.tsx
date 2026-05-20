'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'
import Grid2 from '@mui/material/Grid2'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'

const PhysicalSimInventoryView = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')

  const [selectedSim, setSelectedSim] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Mock data for physical SIMs belonging to this Agent
  const myPhysicalSims = [
    {
      iccid: '8985209000000000010',
      supplier: 'Hồng Kông',
      status: 'Sẵn sàng bán', // 'Sẵn sàng bán', 'Đã kích hoạt'
      serialNumber: 'SN-HKG-00201',
      importDate: '17/05/2026 09:15',
      activationDate: null,
      assignedPackage: null,
      pin: '1234',
      puk: '87654321'
    },
    {
      iccid: '8985209000000000011',
      supplier: 'Hồng Kông',
      status: 'Sẵn sàng bán',
      serialNumber: 'SN-HKG-00202',
      importDate: '17/05/2026 09:15',
      activationDate: null,
      assignedPackage: null,
      pin: '1234',
      puk: '87654322'
    },
    {
      iccid: '8985209000000000012',
      supplier: 'Hồng Kông',
      status: 'Đã kích hoạt',
      serialNumber: 'SN-HKG-00203',
      importDate: '17/05/2026 09:15',
      activationDate: '19/05/2026 08:30',
      assignedPackage: 'HK-PRO10 (10GB - 30 Ngày)',
      pin: '1234',
      puk: '87654323'
    },
    {
      iccid: '8981209000000000400',
      supplier: 'Mỹ',
      status: 'Đã kích hoạt',
      serialNumber: 'SN-USA-00400',
      importDate: '10/05/2026 14:00',
      activationDate: '15/05/2026 10:15',
      assignedPackage: 'US-TRAVEL5 (5GB - 5 Ngày)',
      pin: '1111',
      puk: '55443322'
    },
    {
      iccid: '8981209000000000401',
      supplier: 'Mỹ',
      status: 'Sẵn sàng bán',
      serialNumber: 'SN-USA-00401',
      importDate: '10/05/2026 14:00',
      activationDate: null,
      assignedPackage: null,
      pin: '1111',
      puk: '55443323'
    },
    {
      iccid: '8981209000000000402',
      supplier: 'Mỹ',
      status: 'Sẵn sàng bán',
      serialNumber: 'SN-USA-00402',
      importDate: '10/05/2026 14:00',
      activationDate: null,
      assignedPackage: null,
      pin: '1111',
      puk: '55443324'
    }
  ]

  // Filter Logic
  const filteredSims = myPhysicalSims.filter(sim => {
    const matchesSearch = sim.iccid.includes(searchQuery) || 
      sim.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sim.status === statusFilter
    const matchesSupplier = supplierFilter === 'all' || sim.supplier === supplierFilter

    return matchesSearch && matchesStatus && matchesSupplier
  })

  // Calculations
  const totalSims = myPhysicalSims.length
  const readyToSell = myPhysicalSims.filter(s => s.status === 'Sẵn sàng bán').length
  const activatedCount = myPhysicalSims.filter(s => s.status === 'Đã kích hoạt').length

  const getSupplierAvatar = (supplier: string) => {
    switch (supplier) {
      case 'Hồng Kông': return { bg: '#FF4D4D', char: 'H' }
      case 'Mỹ': return { bg: '#0090FF', char: 'U' }
      default: return { bg: '#7367F0', char: 'S' }
    }
  }

  return (
    <>
      <PageHeader
        title="Kho Phôi SIM của tôi"
        description="Quản lý phôi SIM vật lý trắng đã mua từ 3M. Tiến hành bán và kích hoạt nạp gói trực tiếp cho khách hàng."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/agent/dashboard' },
          { label: 'Kênh Đại lý' },
          { label: 'Kho Phôi SIM' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button 
              component={Link} 
              href='/agent/physical-sim/order'
              variant='contained' 
              color='primary' 
              startIcon={<i className='tabler-shopping-cart' />}
              size='small'
            >
              Đặt mua Phôi SIM
            </Button>
            <Button 
              component={Link} 
              href='/agent/physical-sim/activation'
              variant='contained' 
              color='success' 
              startIcon={<i className='tabler-bolt' />}
              size='small'
            >
              Kích hoạt phôi SIM
            </Button>
          </Stack>
        }
        className='mbe-6'
      />

      {/* Summary Cards */}
      <Grid2 container spacing={4} className='mbe-6'>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4'>
              <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: 'rgba(115, 103, 240, 0.1)', color: '#7367F0' }}>
                <i className='tabler-sim-cards text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='h5' className='font-black'>{totalSims}</Typography>
                <Typography variant='caption' className='text-slate-400 font-medium uppercase'>Tổng phôi sở hữu</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4'>
              <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: 'rgba(0, 144, 255, 0.1)', color: '#0090FF' }}>
                <i className='tabler-circle-check text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='h5' className='font-black'>{readyToSell}</Typography>
                <Typography variant='caption' className='text-slate-400 font-medium uppercase'>Sẵn sàng bán (SIM trắng)</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4'>
              <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: 'rgba(40, 199, 111, 0.1)', color: '#28C76F' }}>
                <i className='tabler-antenna-bars-5 text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='h5' className='font-black'>{activatedCount}</Typography>
                <Typography variant='caption' className='text-slate-400 font-medium uppercase'>Đã kích hoạt gói</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Filters */}
      <Card className='border-none shadow-sm mbe-6'>
        <CardContent>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Tìm kiếm</Typography>
              <TextField
                fullWidth
                size='small'
                placeholder='Nhập ICCID, Số Seri...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Trạng thái phôi</Typography>
              <Select fullWidth size='small' value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                <MenuItem value='Sẵn sàng bán'>Sẵn sàng bán (Chưa gán gói)</MenuItem>
                <MenuItem value='Đã kích hoạt'>Đã kích hoạt (Có gói cước)</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Nhà mạng phôi</Typography>
              <Select fullWidth size='small' value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả nhà mạng</MenuItem>
                <MenuItem value='Hồng Kông'>Hồng Kông</MenuItem>
                <MenuItem value='Mỹ'>Mỹ</MenuItem>
              </Select>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className='border-none shadow-sm overflow-hidden'>
        <TableContainer>
          <Table>
            <TableHead className='bg-slate-50'>
              <TableRow>
                <TableCell className='font-bold text-xs uppercase'>Mã ICCID</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Số Seri</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Nhà mạng phôi</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Trạng thái</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Gói cước đang nạp</TableCell>
                <TableCell className='font-bold text-xs uppercase text-right'>Ngày nhận phôi</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSims.length > 0 ? (
                filteredSims.map((sim, idx) => {
                  const avatar = getSupplierAvatar(sim.supplier)
                  return (
                    <TableRow key={sim.iccid || idx} hover>
                      <TableCell className='font-mono text-sm font-bold text-slate-700'>{sim.iccid}</TableCell>
                      <TableCell className='font-mono text-xs text-slate-500'>{sim.serialNumber}</TableCell>
                      <TableCell>
                        <Box className='flex items-center gap-2'>
                          <Avatar 
                            variant='rounded' 
                            sx={{ 
                              backgroundColor: `${avatar.bg}15`, 
                              color: avatar.bg,
                              width: 26, 
                              height: 26,
                              fontSize: '11px',
                              fontWeight: '900'
                            }}
                          >
                            {avatar.char}
                          </Avatar>
                          <Typography variant='body2' className='font-bold' sx={{ color: avatar.bg }}>
                            {sim.supplier}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={sim.status} 
                          size='small' 
                          color={sim.status === 'Sẵn sàng bán' ? 'primary' : 'success'} 
                          variant='tonal'
                          className='font-bold text-xs'
                        />
                      </TableCell>
                      <TableCell>
                        {sim.assignedPackage ? (
                          <Typography variant='body2' className='font-semibold text-slate-800'>
                            {sim.assignedPackage}
                          </Typography>
                        ) : (
                          <Typography variant='caption' color='textSecondary' className='italic'>
                            Chưa gán gói (SIM trắng)
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Typography variant='caption' className='font-medium text-slate-500'>
                          {sim.importDate}
                        </Typography>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Stack direction='row' spacing={1} justifyContent='center'>
                          <IconButton 
                            size='small' 
                            color='primary'
                            onClick={() => {
                              setSelectedSim(sim)
                              setIsDetailOpen(true)
                            }}
                          >
                            <i className='tabler-eye text-[18px]' />
                          </IconButton>

                          {sim.status === 'Sẵn sàng bán' && (
                            <Button 
                              variant='contained' 
                              color='success' 
                              size='small'
                              component={Link}
                              href={`/agent/physical-sim/activation?iccid=${sim.iccid}`}
                              startIcon={<i className='tabler-bolt' />}
                              sx={{ py: 1, fontSize: '10px', fontWeight: 'bold' }}
                            >
                              Kích hoạt SIM
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                    <Typography color='textSecondary' variant='body2'>
                      Không tìm thấy phôi SIM vật lý nào của bạn phù hợp.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* SIM Detail Dialog */}
      <Dialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between border-b p-5'>
          <Box>
            <Typography variant='h5' className='font-black'>Chi tiết Phôi SIM của Đại lý</Typography>
            <Typography variant='caption' color='textSecondary'>Mã ICCID: {selectedSim?.iccid}</Typography>
          </Box>
          <IconButton onClick={() => setIsDetailOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedSim && (
            <Stack spacing={4}>
              <Card variant='outlined' className='bg-slate-50/50 p-4 border-slate-100 rounded-xl'>
                <Grid2 container spacing={4}>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' className='text-slate-400 font-bold uppercase block'>Nhà mạng phôi</Typography>
                    <Typography variant='body2' className='font-black text-slate-800'>{selectedSim.supplier}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' className='text-slate-400 font-bold uppercase block'>Số Serial</Typography>
                    <Typography variant='body2' className='font-mono font-bold text-slate-800'>{selectedSim.serialNumber}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }} className='mt-2'>
                    <Typography variant='caption' className='text-slate-400 font-bold uppercase block'>Mã PIN</Typography>
                    <Typography variant='body2' className='font-mono font-bold text-slate-800'>{selectedSim.pin}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }} className='mt-2'>
                    <Typography variant='caption' className='text-slate-400 font-bold uppercase block'>Mã PUK</Typography>
                    <Typography variant='body2' className='font-mono font-bold text-slate-800'>{selectedSim.puk}</Typography>
                  </Grid2>
                </Grid2>
              </Card>

              <Stack spacing={2} className='border rounded-xl p-4'>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Trạng thái hiện tại</Typography>
                  <Chip 
                    label={selectedSim.status} 
                    color={selectedSim.status === 'Sẵn sàng bán' ? 'primary' : 'success'} 
                    size='small' 
                    variant='tonal'
                    className='font-bold'
                  />
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Ngày nhận từ 3M</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700'>{selectedSim.importDate}</Typography>
                </Box>
                {selectedSim.activationDate && (
                  <>
                    <Box className='flex justify-between py-1 border-b border-dashed'>
                      <Typography variant='body2' className='text-slate-500'>Ngày kích hoạt</Typography>
                      <Typography variant='body2' className='font-bold text-success'>{selectedSim.activationDate}</Typography>
                    </Box>
                    <Box className='p-3 bg-success/5 rounded-lg border border-success/10 mt-2'>
                      <Typography variant='caption' className='text-success font-black uppercase block mbe-1'>Gói cước đã nạp</Typography>
                      <Typography variant='body2' className='font-bold text-success-dark'>{selectedSim.assignedPackage}</Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='contained' color='primary' onClick={() => setIsDetailOpen(false)}>Đóng</Button>
          {selectedSim?.status === 'Sẵn sàng bán' && (
            <Button 
              variant='contained' 
              color='success'
              component={Link}
              href={`/agent/physical-sim/activation?iccid=${selectedSim.iccid}`}
            >
              Kích hoạt SIM
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PhysicalSimInventoryView
