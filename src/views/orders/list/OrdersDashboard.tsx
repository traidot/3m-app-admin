'use client'

import React, { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Grid2 from '@mui/material/Grid2'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'

import PageHeader from '@/components/layout/shared/PageHeader'

const OrdersDashboard = () => {
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order)
    setOpenDetails(true)
  }

  const handleCloseDetails = () => {
    setOpenDetails(false)
    setTimeout(() => setSelectedOrder(null), 300)
  }

  // Mock Data focused on the "Digital Item" / eSIM Operations aspect
  const orders = [
    {
      id: 'ORD-8241',
      iccid: '898412345678901234',
      agent: 'TravelConnect',
      product: 'Japan 10GB / 7 Days',
      supplier: 'Airalo (KDDI)',
      status: 'Active',
      date: '28/04/2026',
      dataUsed: 4.5,
      dataTotal: 10,
      expiry: '05/05/2026'
    },
    {
      id: 'ORD-8240',
      iccid: '893200987654321098',
      agent: 'Global eSIM Hub',
      product: 'Thailand 5GB / 5 Days',
      supplier: 'Nomad (AIS)',
      status: 'Not Installed',
      date: '28/04/2026',
      dataUsed: 0,
      dataTotal: 5,
      expiry: 'Bắt đầu từ lúc quét mã'
    },
    {
      id: 'ORD-8239',
      iccid: '898400001111222233',
      agent: 'TravelConnect',
      product: 'Global 1GB / 30 Days',
      supplier: 'KeepGo',
      status: 'Expired',
      date: '25/03/2026',
      dataUsed: 1,
      dataTotal: 1,
      expiry: '24/04/2026'
    },
    {
      id: 'ORD-8238',
      iccid: '898433334444555566',
      agent: 'Nomad Partner',
      product: 'Vietnam 20GB / 15 Days',
      supplier: 'Airalo (Viettel)',
      status: 'Revoked',
      date: '27/04/2026',
      dataUsed: 0,
      dataTotal: 20,
      expiry: 'Đã bị thu hồi'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success'
      case 'Not Installed': return 'warning'
      case 'Expired': return 'secondary'
      case 'Revoked': return 'error'
      default: return 'primary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return 'tabler-wifi'
      case 'Not Installed': return 'tabler-qrcode'
      case 'Expired': return 'tabler-clock-x'
      case 'Revoked': return 'tabler-ban'
      default: return 'tabler-sim-card'
    }
  }

  return (
    <>
      <PageHeader
        title="Quản lý Vận hành eSIM (Đơn mua của nhà cung câp)"
        description="Quản lý vòng đời eSIM: Mã ICCID, trạng thái kết nối mạng và gia hạn đơn hàng."
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng' }, { label: 'Quản lý eSIM' }]}
        className='mbe-6'
      />

      {/* Operations Quick Stats */}
      <Grid2 container spacing={6} className='mbe-6'>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='p-6 flex items-center gap-4'>
              <Avatar variant='rounded' className='bg-primary/10 text-primary bs-[48px] is-[48px]'>
                <i className='tabler-sim-card text-[28px]' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Tổng Số eSIM Đã Cấp</Typography>
                <Typography variant='h4' className='font-black'>24,592</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-success/5 border-success/20'>
            <CardContent className='p-6 flex items-center gap-4'>
              <Avatar variant='rounded' className='bg-success/20 text-success bs-[48px] is-[48px]'>
                <i className='tabler-wifi text-[28px]' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-bold text-success uppercase'>Đang Hoạt Động (Active)</Typography>
                <Typography variant='h4' className='font-black text-success'>8,210</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-warning/5 border-warning/20'>
            <CardContent className='p-6 flex items-center gap-4'>
              <Avatar variant='rounded' className='bg-warning/20 text-warning bs-[48px] is-[48px]'>
                <i className='tabler-qrcode text-[28px]' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-bold text-warning uppercase'>Chưa Quét Mã</Typography>
                <Typography variant='h4' className='font-black text-warning'>1,452</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-error/5 border-error/20'>
            <CardContent className='p-6 flex items-center gap-4'>
              <Avatar variant='rounded' className='bg-error/20 text-error bs-[48px] is-[48px]'>
                <i className='tabler-alert-triangle text-[28px]' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-bold text-error uppercase'>Cảnh Báo Lỗi / Thu Hồi</Typography>
                <Typography variant='h4' className='font-black text-error'>48</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Card className='border-none shadow-sm'>
        <Box className='p-6 border-be flex flex-wrap justify-between items-center gap-4'>
          <Grid2 container spacing={4} className='w-full lg:w-3/4'>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                placeholder='Tìm Mã Đơn hoặc ICCID...'
                size='small'
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Trạng thái Network'>
                <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                <MenuItem value='active'>Active (Đang có sóng)</MenuItem>
                <MenuItem value='not_installed'>Not Installed (Chưa quét QR)</MenuItem>
                <MenuItem value='expired'>Expired (Đã hết hạn/hết dung lượng)</MenuItem>
                <MenuItem value='revoked'>Revoked (Bị thu hồi)</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Nguồn cung (Supplier)'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='airalo'>Airalo</MenuItem>
                <MenuItem value='nomad'>Nomad</MenuItem>
                <MenuItem value='keepgo'>KeepGo</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className='bg-slate-50'>
                <TableCell className='font-black uppercase text-[11px] whitespace-nowrap'>Mã Đơn / ICCID</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Sản Phẩm & Nguồn Cung</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Đại lý</TableCell>
                <TableCell className='font-black uppercase text-[11px] w-48'>Trạng thái Network</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Hạn sử dụng</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Hỗ trợ (CSKH)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => {
                const isDataUsed = o.dataTotal > 0;
                const usagePercent = isDataUsed ? (o.dataUsed / o.dataTotal) * 100 : 0;
                const progressColor = usagePercent > 90 ? 'error' : usagePercent > 70 ? 'warning' : 'primary';

                return (
                  <TableRow key={o.id} hover className='transition-colors'>
                    <TableCell>
                      <Box className='flex flex-col'>
                        <Typography variant='body2' className='font-mono font-bold text-slate-800'>{o.id}</Typography>
                        <Stack direction='row' alignItems='center' spacing={0.5}>
                          <i className='tabler-sim-card text-[14px] text-slate-400' />
                          <Typography variant='caption' className='font-mono text-slate-500'>{o.iccid}</Typography>
                        </Stack>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box className='flex flex-col'>
                        <Typography variant='body2' className='font-bold'>{o.product}</Typography>
                        <Typography variant='caption' className='text-slate-500'>Nguồn: {o.supplier}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box className='flex items-center gap-2'>
                        <Avatar variant='rounded' className='bg-slate-100 text-slate-700 font-black is-6 bs-6 text-[10px]'>
                          {o.agent[0]}
                        </Avatar>
                        <Typography variant='body2' className='font-bold text-slate-700'>{o.agent}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Chip
                          icon={<i className={getStatusIcon(o.status)} />}
                          label={o.status}
                          size='small'
                          color={getStatusColor(o.status) as any}
                          variant='tonal'
                          className='font-bold h-6 text-[11px]'
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box className='flex flex-col'>
                        <Typography variant='body2' className='font-bold text-slate-700'>{o.expiry}</Typography>
                        <Typography variant='caption' className='text-slate-400'>Ngày mua: {o.date}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell className='text-right'>
                      <Stack direction='row' spacing={1} justifyContent='flex-end'>
                        <Tooltip title="Chi tiết giao dịch & Flow">
                          <IconButton size='small' color='info' className='bg-info/10' onClick={() => handleOpenDetails(o)}>
                            <i className='tabler-eye' />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openDetails} onClose={handleCloseDetails} fullWidth maxWidth='sm'>
        <DialogTitle className='flex justify-between items-center pb-2'>
          <Typography variant='h5' component='span' className='font-black'>Chi tiết Giao dịch</Typography>
          <IconButton onClick={handleCloseDetails} size='small'><i className='tabler-x' /></IconButton>
        </DialogTitle>
        <DialogContent dividers className='p-6'>
          {selectedOrder && (
            <Box>
              <Box className='flex justify-between items-start mb-6'>
                <Box>
                  <Typography variant='caption' className='text-slate-500 uppercase font-bold'>Mã đơn hàng</Typography>
                  <Typography variant='h6' className='font-black font-mono'>{selectedOrder.id}</Typography>
                </Box>
                <Chip
                  icon={<i className={getStatusIcon(selectedOrder.status)} />}
                  label={selectedOrder.status}
                  color={getStatusColor(selectedOrder.status) as any}
                  size='small'
                  variant='tonal'
                  className='font-bold'
                />
              </Box>

              <Grid2 container spacing={4} className='mb-6'>
                <Grid2 size={{ xs: 6 }}>
                  <Typography variant='caption' className='text-slate-500'>Sản phẩm</Typography>
                  <Typography variant='body2' className='font-bold'>{selectedOrder.product}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Typography variant='caption' className='text-slate-500'>ICCID</Typography>
                  <Typography variant='body2' className='font-mono'>{selectedOrder.iccid}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Typography variant='caption' className='text-slate-500'>Đại lý</Typography>
                  <Typography variant='body2' className='font-medium'>{selectedOrder.agent}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Typography variant='caption' className='text-slate-500'>Nguồn cung</Typography>
                  <Typography variant='body2' className='font-medium'>{selectedOrder.supplier}</Typography>
                </Grid2>
              </Grid2>

              <Divider className='mb-6' />

              <Typography variant='h6' className='font-bold mb-4'>Tiến trình hệ thống (Flow)</Typography>
              <Box className='ml-2 border-l-2 border-slate-200 pl-4 py-1 flex flex-col gap-6 relative'>
                <Box className='relative'>
                  <Box className='absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-success/20 border-2 border-success z-10' />
                  <Typography variant='body2' className='font-bold'>Tạo đơn hàng thành công</Typography>
                  <Typography variant='caption' className='text-slate-500'>{selectedOrder.date} - 08:00:00</Typography>
                  <Typography variant='caption' className='block mt-1 bg-slate-50 p-2 rounded'>Request từ Đại lý: {selectedOrder.agent}</Typography>
                </Box>
                <Box className='relative'>
                  <Box className='absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-success/20 border-2 border-success z-10' />
                  <Typography variant='body2' className='font-bold'>Cấp phát ICCID (Provisioning)</Typography>
                  <Typography variant='caption' className='text-slate-500'>{selectedOrder.date} - 08:00:15</Typography>
                  <Typography variant='caption' className='block mt-1 bg-slate-50 p-2 rounded'>API call tới: {selectedOrder.supplier}</Typography>
                </Box>
                <Box className='relative'>
                  <Box className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 z-10 ${selectedOrder.status === 'Active' ? 'bg-success/20 border-success' : 'bg-slate-100 border-slate-300'}`} />
                  <Typography variant='body2' className={`font-bold ${selectedOrder.status !== 'Active' && 'text-slate-500'}`}>Kích hoạt mạng (Network Active)</Typography>
                  {selectedOrder.status === 'Active' ? (
                    <Typography variant='caption' className='text-slate-500'>{selectedOrder.date} - 08:05:22</Typography>
                  ) : (
                    <Typography variant='caption' className='text-slate-400'>Chưa ghi nhận từ mạng lưới</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className='p-4'>
          <Button variant='tonal' color='secondary' onClick={handleCloseDetails}>Đóng</Button>
          <Button variant='contained' color='primary' startIcon={<i className='tabler-download' />}>Tải PDF</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OrdersDashboard
