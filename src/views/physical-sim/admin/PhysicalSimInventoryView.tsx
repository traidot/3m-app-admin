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
  const [agentFilter, setAgentFilter] = useState('all')

  const [selectedSim, setSelectedSim] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Mock data for physical SIMs
  const physicalSims = [
    {
      iccid: '8985209000000000001',
      supplier: 'Hồng Kông', // 'Trong kho 3M', 'Đã giao Đại lý', 'Đã kích hoạt'
      status: 'Trong kho 3M',
      agent: null,
      assignedPackage: null,
      importDate: '15/05/2026 09:30',
      activationDate: null,
      serialNumber: 'SN-HKG-00192',
      pin: '1234',
      puk: '87654321'
    },
    {
      iccid: '8985209000000000002',
      supplier: 'Hồng Kông',
      status: 'Đã giao Đại lý',
      agent: 'Đại lý Hoàng Mai',
      assignedPackage: null,
      importDate: '15/05/2026 09:30',
      activationDate: null,
      serialNumber: 'SN-HKG-00193',
      pin: '1234',
      puk: '87654322'
    },
    {
      iccid: '8985209000000000003',
      supplier: 'Hồng Kông',
      status: 'Đã kích hoạt',
      agent: 'Đại lý Cầu Giấy',
      assignedPackage: 'HK-PRO10 (10GB - 30 Ngày)',
      importDate: '14/05/2026 14:15',
      activationDate: '19/05/2026 10:20',
      serialNumber: 'SN-HKG-99281',
      pin: '0000',
      puk: '11223344'
    },
    {
      iccid: '8981209000000000004',
      supplier: 'Mỹ',
      status: 'Trong kho 3M',
      agent: null,
      assignedPackage: null,
      importDate: '16/05/2026 08:00',
      activationDate: null,
      serialNumber: 'SN-USA-55412',
      pin: '1234',
      puk: '99887766'
    },
    {
      iccid: '8981209000000000005',
      supplier: 'Mỹ',
      status: 'Đã kích hoạt',
      agent: 'Đại lý Tân Bình',
      assignedPackage: 'US-TRAVEL5 (5GB - 5 Ngày)',
      importDate: '14/05/2026 14:15',
      activationDate: '18/05/2026 16:45',
      serialNumber: 'SN-USA-99282',
      pin: '0000',
      puk: '11223345'
    },
    {
      iccid: '8985209000000000006',
      supplier: 'Hồng Kông',
      status: 'Đã giao Đại lý',
      agent: 'Đại lý Hoàng Mai',
      assignedPackage: null,
      importDate: '15/05/2026 09:30',
      activationDate: null,
      serialNumber: 'SN-HKG-00194',
      pin: '1234',
      puk: '87654323'
    }
  ]

  // Filter logic
  const filteredSims = physicalSims.filter(sim => {
    const matchesSearch = sim.iccid.includes(searchQuery) || 
      (sim.agent && sim.agent.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sim.serialNumber && sim.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || sim.status === statusFilter
    const matchesSupplier = supplierFilter === 'all' || sim.supplier === supplierFilter
    const matchesAgent = agentFilter === 'all' || (agentFilter === 'none' && !sim.agent) || (sim.agent && sim.agent.includes(agentFilter))

    return matchesSearch && matchesStatus && matchesSupplier && matchesAgent
  })

  // Statistics calculation
  const totalSims = physicalSims.length
  const inStock3M = physicalSims.filter(s => s.status === 'Trong kho 3M').length
  const allocatedToAgents = physicalSims.filter(s => s.status === 'Đã giao Đại lý').length
  const activatedSims = physicalSims.filter(s => s.status === 'Đã kích hoạt').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Trong kho 3M':
        return 'primary'
      case 'Đã giao Đại lý':
        return 'warning'
      case 'Đã kích hoạt':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const getSupplierAvatar = (supplier: string) => {
    switch (supplier) {
      case 'Hồng Kông':
        return { bg: '#FF4D4D', char: 'H' }
      case 'Mỹ':
        return { bg: '#0090FF', char: 'U' }
      default:
        return { bg: '#7367F0', char: 'S' }
    }
  }

  return (
    <>
      <PageHeader
        title="Danh sách Phôi SIM"
        description="Quản lý toàn bộ kho SIM trắng vật lý, tình trạng phân phối cho Đại lý và lịch sử kích hoạt gói cước."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/3m/dashboard' },
          { label: 'Kho SIM Vật lý' },
          { label: 'Danh sách Phôi SIM' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button 
              component={Link} 
              href='/3m/physical-sim/import'
              variant='contained' 
              color='primary' 
              startIcon={<i className='tabler-file-import' />}
              size='small'
            >
              Nhập kho SIM
            </Button>
            <Button 
              component={Link} 
              href='/3m/physical-sim/allocation'
              variant='contained' 
              color='warning' 
              startIcon={<i className='tabler-share' />}
              size='small'
            >
              Phân bổ Đại lý
            </Button>
          </Stack>
        }
        className='mbe-6'
      />

      {/* Summary Cards */}
      <Grid2 container spacing={4} className='mbe-6'>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4'>
              <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: 'rgba(115, 103, 240, 0.1)', color: '#7367F0' }}>
                <i className='tabler-sim-cards text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='h5' className='font-black'>{totalSims}</Typography>
                <Typography variant='caption' className='text-slate-400 font-medium uppercase'>Tổng phôi SIM</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4'>
              <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: 'rgba(0, 144, 255, 0.1)', color: '#0090FF' }}>
                <i className='tabler-building-warehouse text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='h5' className='font-black'>{inStock3M}</Typography>
                <Typography variant='caption' className='text-slate-400 font-medium uppercase'>Trong kho 3M</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4'>
              <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: 'rgba(255, 159, 67, 0.1)', color: '#FF9F43' }}>
                <i className='tabler-users text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='h5' className='font-black'>{allocatedToAgents}</Typography>
                <Typography variant='caption' className='text-slate-400 font-medium uppercase'>Đã giao Đại lý</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4'>
              <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: 'rgba(40, 199, 111, 0.1)', color: '#28C76F' }}>
                <i className='tabler-circle-check text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='h5' className='font-black'>{activatedSims}</Typography>
                <Typography variant='caption' className='text-slate-400 font-medium uppercase'>Đã kích hoạt</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Filter Options */}
      <Card className='border-none shadow-sm mbe-6'>
        <CardContent>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Tìm kiếm</Typography>
              <TextField
                fullWidth
                size='small'
                placeholder='Nhập ICCID, Đại lý, Số Seri...'
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
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Trạng thái</Typography>
              <Select fullWidth size='small' value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                <MenuItem value='Trong kho 3M'>Trong kho 3M</MenuItem>
                <MenuItem value='Đã giao Đại lý'>Đã giao Đại lý</MenuItem>
                <MenuItem value='Đã kích hoạt'>Đã kích hoạt</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Nhà cung cấp phôi</Typography>
              <Select fullWidth size='small' value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả Nhà cung cấp</MenuItem>
                <MenuItem value='Viettel'>Viettel</MenuItem>
                <MenuItem value='Vinaphone'>Vinaphone</MenuItem>
                <MenuItem value='Mobifone'>Mobifone</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Đại lý sở hữu</Typography>
              <Select fullWidth size='small' value={agentFilter} onChange={e => setAgentFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả Đại lý</MenuItem>
                <MenuItem value='none'>Chưa bàn giao (Kho 3M)</MenuItem>
                <MenuItem value='Đại lý Hoàng Mai'>Đại lý Hoàng Mai</MenuItem>
                <MenuItem value='Đại lý Cầu Giấy'>Đại lý Cầu Giấy</MenuItem>
                <MenuItem value='Đại lý Tân Bình'>Đại lý Tân Bình</MenuItem>
              </Select>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Main Inventory Table */}
      <Card className='border-none shadow-sm overflow-hidden'>
        <TableContainer>
          <Table>
            <TableHead className='bg-slate-50'>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Mã ICCID</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Số Seri</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Nhà cung cấp</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Đại lý nắm giữ</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Trạng thái</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Gói cước</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Ngày nhập kho</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSims.length > 0 ? (
                filteredSims.map((sim, index) => {
                  const avatar = getSupplierAvatar(sim.supplier)
                  return (
                    <TableRow key={sim.iccid || index} hover>
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
                        {sim.agent ? (
                          <Typography variant='body2' className='font-semibold text-slate-800'>
                            {sim.agent}
                          </Typography>
                        ) : (
                          <Typography variant='body2' color='textSecondary' className='italic text-xs'>
                            Chưa bàn giao
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={sim.status}
                          size='small'
                          color={getStatusColor(sim.status)}
                          variant='tonal'
                          className='font-bold text-xs'
                        />
                      </TableCell>
                      <TableCell>
                        {sim.assignedPackage ? (
                          <Box>
                            <Typography variant='body2' className='font-semibold text-slate-800 truncate max-w-[200px]'>
                              {sim.assignedPackage.split(' (')[0]}
                            </Typography>
                            <Typography variant='caption' color='textSecondary' className='block text-[10px]'>
                              {sim.assignedPackage.includes('(') ? `(${sim.assignedPackage.split(' (')[1]}` : ''}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant='caption' color='textSecondary' className='italic'>
                            Chưa kích hoạt
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
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
                            title="Chi tiết SIM"
                          >
                            <i className='tabler-eye text-[18px]' />
                          </IconButton>
                          {sim.status === 'Trong kho 3M' && (
                            <IconButton 
                              size='small' 
                              color='warning'
                              component={Link}
                              href={`/3m/physical-sim/allocation?iccid=${sim.iccid}`}
                              title="Bàn giao Đại lý"
                            >
                              <i className='tabler-share text-[18px]' />
                            </IconButton>
                          )}
                          {sim.status === 'Đã giao Đại lý' && (
                            <IconButton 
                              size='small' 
                              color='error'
                              title="Thu hồi phôi SIM"
                              onClick={() => alert(`Thu hồi SIM ${sim.iccid} thành công!`)}
                            >
                              <i className='tabler-arrow-back-up text-[18px]' />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center' sx={{ py: 6 }}>
                    <Typography color='textSecondary' variant='body2'>
                      Không tìm thấy phôi SIM nào trùng khớp với bộ lọc
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
            <Typography variant='h5' className='font-black'>Chi tiết Phôi SIM Vật lý</Typography>
            <Typography variant='caption' color='textSecondary'>ICCID: {selectedSim?.iccid}</Typography>
          </Box>
          <IconButton onClick={() => setIsDetailOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedSim && (
            <Box className='space-y-4'>
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

              <Box className='space-y-3'>
                <Box className='flex justify-between items-center py-2 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500 font-medium'>Trạng thái hiện tại</Typography>
                  <Chip
                    label={selectedSim.status}
                    size='small'
                    color={getStatusColor(selectedSim.status)}
                    variant='tonal'
                    className='font-bold'
                  />
                </Box>
                <Box className='flex justify-between items-center py-2 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500 font-medium'>Đại lý nắm giữ</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>
                    {selectedSim.agent || 'Chưa bàn giao (Thuộc 3M)'}
                  </Typography>
                </Box>
                <Box className='flex justify-between items-center py-2 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500 font-medium'>Ngày nhập kho</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700'>{selectedSim.importDate}</Typography>
                </Box>
                <Box className='flex justify-between items-center py-2 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500 font-medium'>Ngày kích hoạt gói</Typography>
                  <Typography variant='body2' className='font-bold text-success'>
                    {selectedSim.activationDate || 'Chưa kích hoạt'}
                  </Typography>
                </Box>
                {selectedSim.assignedPackage && (
                  <Box className='p-3 bg-success/5 rounded-lg border border-success/10 mt-2'>
                    <Typography variant='caption' className='text-success font-black uppercase block mbe-1'>Gói cước đã nạp</Typography>
                    <Typography variant='body2' className='font-bold text-success-dark'>{selectedSim.assignedPackage}</Typography>
                  </Box>
                )}
              </Box>

              {/* API logs placeholder or history flow */}
              <Box className='mt-4'>
                <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-slate-500'>Nhật ký hành trình</Typography>
                <Stack spacing={3} className='mbs-2 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200'>
                  <Box className='flex gap-4 relative'>
                    <Box className='w-[20px] h-[20px] rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black z-10'>
                      1
                    </Box>
                    <Box>
                      <Typography variant='body2' className='font-bold text-slate-800'>Nhập kho phôi SIM</Typography>
                      <Typography variant='caption' className='text-slate-400 block'>{selectedSim.importDate} - Bởi Hệ thống 3M</Typography>
                    </Box>
                  </Box>
                  {selectedSim.agent && (
                    <Box className='flex gap-4 relative'>
                      <Box className='w-[20px] h-[20px] rounded-full bg-warning flex items-center justify-center text-white text-[10px] font-black z-10'>
                        2
                      </Box>
                      <Box>
                        <Typography variant='body2' className='font-bold text-slate-800'>Bàn giao cho {selectedSim.agent}</Typography>
                        <Typography variant='caption' className='text-slate-400 block'>{selectedSim.importDate} - Giao dịch bàn giao lô</Typography>
                      </Box>
                    </Box>
                  )}
                  {selectedSim.activationDate && (
                    <Box className='flex gap-4 relative'>
                      <Box className='w-[20px] h-[20px] rounded-full bg-success flex items-center justify-center text-white text-[10px] font-black z-10'>
                        3
                      </Box>
                      <Box>
                        <Typography variant='body2' className='font-bold text-slate-800'>Đại lý kích hoạt & Nạp gói cước</Typography>
                        <Typography variant='caption' className='text-slate-400 block'>{selectedSim.activationDate} - Mã giao dịch: ACT-{selectedSim.iccid.substring(12)}</Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='tonal' color='secondary' onClick={() => setIsDetailOpen(false)}>
            Đóng
          </Button>
          {selectedSim?.status === 'Trong kho 3M' && (
            <Button 
              variant='contained' 
              color='warning' 
              component={Link}
              href={`/3m/physical-sim/allocation?iccid=${selectedSim.iccid}`}
            >
              Bàn giao Đại lý
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PhysicalSimInventoryView
