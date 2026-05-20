'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid2 from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'

import PageHeader from '@/components/layout/shared/PageHeader'

const PhysicalSimAllocationView = () => {
  const searchParams = useSearchParams()
  const iccidFromQuery = searchParams ? searchParams.get('iccid') : null

  // Active Tab/Order to Fulfill
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isFulfillOpen, setIsFulfillOpen] = useState(false)

  // Fulfillment form states
  const [iccidStart, setIccidStart] = useState('')
  const [iccidEnd, setIccidEnd] = useState('')
  const [allocationType, setAllocationType] = useState('auto') // 'auto' or 'manual'
  const [carrierShipping, setCarrierShipping] = useState('DHL Express')
  const [trackingCode, setTrackingCode] = useState('')

  // Mock B2B Purchase Orders (from Agents buying SIMs)
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ORD-SIM-9921',
      agent: 'Đại lý Hoàng Mai',
      supplier: 'Hồng Kông',
      quantity: 50,
      totalAmount: 1000000,
      status: 'Chờ bàn giao', // 'Chờ bàn giao', 'Đang giao hàng', 'Đã hoàn thành'
      date: '19/05/2026 11:30',
      shippingMethod: 'delivery',
      address: 'Số 12 Ngõ 45 Cầu Giấy, Hà Nội'
    },
    {
      id: 'ORD-SIM-9920',
      agent: 'Đại lý Cầu Giấy',
      supplier: 'Mỹ',
      quantity: 100,
      totalAmount: 2000000,
      status: 'Chờ bàn giao',
      date: '19/05/2026 09:10',
      shippingMethod: 'pickup',
      address: 'Nhận trực tiếp tại văn phòng 3M'
    },
    {
      id: 'ORD-SIM-9915',
      agent: 'Đại lý Hoàng Mai',
      supplier: 'Hồng Kông',
      quantity: 100,
      totalAmount: 2000000,
      status: 'Đang giao hàng',
      date: '17/05/2026 09:15',
      shippingMethod: 'delivery',
      address: 'Số 12 Ngõ 45 Cầu Giấy, Hà Nội',
      trackingCode: 'DHL-HKG-9928122',
      iccidRange: '8985209000000000010 - 8985209000000000109'
    },
    {
      id: 'ORD-SIM-9872',
      agent: 'Đại lý Tân Bình',
      supplier: 'Mỹ',
      quantity: 200,
      totalAmount: 4000000,
      status: 'Đã hoàn thành',
      date: '10/05/2026 14:00',
      shippingMethod: 'pickup',
      address: 'Nhận trực tiếp tại văn phòng 3M',
      iccidRange: '8981209000000000400 - 8981209000000000599'
    }
  ])

  // Mock Available stock of blank SIMs inside 3M
  const stockSummary = {
    'Hồng Kông': 1250,
    'Mỹ': 800
  }

  // Pre-fill fields when Admin starts fulfillment
  const handleOpenFulfillment = (order: any) => {
    setSelectedOrder(order)
    setIsFulfillOpen(true)
    
    // Default mock dải ICCID based on carrier
    if (order.supplier === 'Hồng Kông') {
      setIccidStart('8985209000000000200')
      setIccidEnd('8985209000000000249')
    } else {
      setIccidStart('8981209000000000300')
      setIccidEnd('8981209000000000399')
    }

    setTrackingCode(`DHL-SHIP-${Math.floor(100000 + Math.random() * 900000)}`)
  }

  const handleConfirmFulfillment = () => {
    // Update order status in UI
    const updatedOrders = orders.map(o => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          status: selectedOrder.shippingMethod === 'pickup' ? 'Đã hoàn thành' : 'Đang giao hàng',
          trackingCode: selectedOrder.shippingMethod === 'pickup' ? null : trackingCode,
          iccidRange: `${iccidStart} - ${iccidEnd}`
        }
      }
      return o
    })

    setOrders(updatedOrders)
    setIsFulfillOpen(false)
    
    alert(`Bàn giao thành công dải SIM (${iccidStart} - ${iccidEnd}) cho đại lý ${selectedOrder.agent}. Đơn hàng đã được chuyển sang trạng thái ${selectedOrder.shippingMethod === 'pickup' ? 'Hoàn thành' : 'Đang giao hàng'}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ bàn giao': return 'warning'
      case 'Đang giao hàng': return 'info'
      case 'Đã hoàn thành': return 'success'
      default: return 'secondary'
    }
  }

  const getSupplierColor = (supplier: string) => {
    switch (supplier) {
      case 'Hồng Kông': return '#FF4D4D'
      case 'Mỹ': return '#0090FF'
      default: return '#7367F0'
    }
  }

  return (
    <>
      <PageHeader
        title="Duyệt đơn & Bàn giao phôi SIM"
        description="Xử lý các đơn đặt hàng phôi SIM vật lý từ Đại lý. Chọn dải phôi SIM trong kho 3M để bàn giao quyền sở hữu cho Đại lý."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/3m/dashboard' },
          { label: 'Kho SIM Vật lý', href: '/3m/physical-sim/inventory' },
          { label: 'Bàn giao Phôi SIM' }
        ]}
        actions={
          <Button 
            component={Link} 
            href='/3m/physical-sim/inventory'
            variant='tonal' 
            color='secondary' 
            startIcon={<i className='tabler-arrow-left' />}
            size='small'
          >
            Quay lại Kho phôi
          </Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Left Side: Orders list */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='p-6'>
              <Typography variant='h6' className='font-black mbe-4 flex items-center gap-2'>
                <i className='tabler-list text-xl text-primary' /> Danh sách Đơn mua SIM từ Đại lý
              </Typography>

              <TableContainer className='border rounded-lg'>
                <Table size='small'>
                  <TableHead className='bg-slate-50'>
                    <TableRow>
                      <TableCell className='font-bold text-xs uppercase'>Mã đơn</TableCell>
                      <TableCell className='font-bold text-xs uppercase'>Đại lý</TableCell>
                      <TableCell className='font-bold text-xs uppercase'>Nhà mạng</TableCell>
                      <TableCell className='font-bold text-xs uppercase text-center'>Số lượng</TableCell>
                      <TableCell className='font-bold text-xs uppercase text-center'>Ngày đặt</TableCell>
                      <TableCell className='font-bold text-xs uppercase text-center'>Trạng thái</TableCell>
                      <TableCell className='font-bold text-xs uppercase text-center'>Bàn giao</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow key={order.id || idx} hover>
                        <TableCell className='font-mono text-xs font-bold text-slate-600'>{order.id}</TableCell>
                        <TableCell className='font-bold text-slate-800'>{order.agent}</TableCell>
                        <TableCell>
                          <Typography variant='body2' className='font-bold' sx={{ color: getSupplierColor(order.supplier) }}>
                            {order.supplier}
                          </Typography>
                        </TableCell>
                        <TableCell className='text-center font-bold text-slate-700'>{order.quantity} phôi</TableCell>
                        <TableCell className='text-center text-xs text-slate-500'>{order.date}</TableCell>
                        <TableCell className='text-center'>
                          <Chip 
                            label={order.status} 
                            size='small' 
                            color={getStatusColor(order.status) as any} 
                            variant='tonal'
                            className='font-bold text-xs'
                          />
                        </TableCell>
                        <TableCell className='text-center'>
                          {order.status === 'Chờ bàn giao' ? (
                            <Button 
                              variant='contained' 
                              color='warning' 
                              size='small'
                              onClick={() => handleOpenFulfillment(order)}
                              startIcon={<i className='tabler-share' />}
                              sx={{ py: 1, fontSize: '11px', fontWeight: 'bold' }}
                            >
                              Xử lý
                            </Button>
                          ) : (
                            <IconButton 
                              size='small'
                              color='primary'
                              onClick={() => {
                                setSelectedOrder(order)
                                handleOpenFulfillment(order)
                              }}
                            >
                              <i className='tabler-eye text-[18px]' />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid2>

        {/* Right Side: Available Stock Summary */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack spacing={6}>
            {/* Stock Count */}
            <Card className='border-none shadow-sm'>
              <CardContent className='p-5'>
                <Typography variant='h6' className='font-black mbe-4 flex items-center gap-2'>
                  <i className='tabler-building-warehouse text-xl text-success' /> Tồn kho phôi SIM (3M)
                </Typography>
                <Typography variant='caption' color='textSecondary' className='block mbe-4'>
                  Tổng số SIM vật lý trắng khả dụng trong kho 3M để bàn giao cho các Đại lý.
                </Typography>
                <Stack spacing={4}>
                  <Box className='flex justify-between items-center py-2 border-b'>
                    <Box className='flex items-center gap-2'>
                      <Avatar sx={{ bgcolor: 'rgba(255, 77, 77, 0.1)', color: '#FF4D4D', width: 28, height: 28, fontSize: '12px', fontWeight: 'bold' }}>H</Avatar>
                      <Typography variant='body2' className='font-bold text-slate-700'>Hồng Kông Wholesale</Typography>
                    </Box>
                    <Typography variant='h6' className='font-black text-slate-800'>{stockSummary['Hồng Kông'].toLocaleString('vi-VN')} phôi</Typography>
                  </Box>
                  <Box className='flex justify-between items-center py-2 border-b'>
                    <Box className='flex items-center gap-2'>
                      <Avatar sx={{ bgcolor: 'rgba(0, 144, 255, 0.1)', color: '#0090FF', width: 28, height: 28, fontSize: '12px', fontWeight: 'bold' }}>U</Avatar>
                      <Typography variant='body2' className='font-bold text-slate-700'>Mỹ Partner</Typography>
                    </Box>
                    <Typography variant='h6' className='font-black text-slate-800'>{stockSummary['Mỹ'].toLocaleString('vi-VN')} phôi</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Quick Helper */}
            <Card className='border-none shadow-sm bg-warning/5 border border-warning/10'>
              <CardContent className='p-5'>
                <Typography variant='h6' className='font-black text-warning mbe-3 flex items-center gap-2'>
                  <i className='tabler-info-circle text-xl' /> Quy trình Bàn giao SIM
                </Typography>
                <Typography variant='body2' color='textSecondary' className='space-y-2 leading-relaxed'>
                  1. Đại lý thanh toán mua phôi SIM bằng tài khoản ví đại lý.<br />
                  2. Admin kiểm tra số lượng phôi yêu cầu, sau đó <b>chọn dải ICCID khả dụng tương ứng</b> trong kho.<br />
                  3. Khi bàn giao thành công, các SIM trong dải ICCID này sẽ <b>tự động chuyển quyền sở hữu</b> sang Đại lý mua và nằm trong kho phôi đại lý.<br />
                  4. Đại lý có thể thực hiện bán lẻ và gán gói cước ngay cho khách hàng của mình.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid2>
      </Grid2>

      {/* Fulfillment Dialog */}
      <Dialog
        open={isFulfillOpen}
        onClose={() => setIsFulfillOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between border-b p-5'>
          <Box>
            <Typography variant='h5' className='font-black'>
              {selectedOrder?.status === 'Chờ bàn giao' ? 'Xử lý Bàn giao Phôi SIM' : 'Chi tiết Bàn giao SIM'}
            </Typography>
            <Typography variant='caption' color='textSecondary'>Đơn hàng: {selectedOrder?.id} - Đại lý: {selectedOrder?.agent}</Typography>
          </Box>
          <IconButton onClick={() => setIsFulfillOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedOrder && (
            <Grid2 container spacing={6} className='mbs-1'>
              {/* Order Info & Address */}
              <Grid2 size={{ xs: 12, md: 5 }} className='space-y-4'>
                <Typography variant='subtitle2' className='font-black uppercase text-slate-500'>Chi tiết đơn hàng</Typography>
                <Stack spacing={2} className='border rounded-xl p-4 bg-slate-50/50'>
                  <Box className='flex justify-between py-1 border-b border-dashed'>
                    <Typography variant='body2' className='text-slate-500'>Nhà mạng phôi</Typography>
                    <Typography variant='body2' className='font-bold text-slate-800'>{selectedOrder.supplier}</Typography>
                  </Box>
                  <Box className='flex justify-between py-1 border-b border-dashed'>
                    <Typography variant='body2' className='text-slate-500'>Số lượng yêu cầu</Typography>
                    <Typography variant='body2' className='font-black text-primary'>{selectedOrder.quantity} phôi SIM</Typography>
                  </Box>
                  <Box className='flex justify-between py-1 border-b border-dashed'>
                    <Typography variant='body2' className='text-slate-500'>Phương thức nhận</Typography>
                    <Typography variant='body2' className='font-bold text-slate-800'>
                      {selectedOrder.shippingMethod === 'pickup' ? 'Nhận trực tiếp' : 'Giao hàng tận nơi'}
                    </Typography>
                  </Box>
                  <Box className='flex flex-col py-1'>
                    <Typography variant='body2' className='text-slate-500 mbe-1'>Địa chỉ giao/nhận</Typography>
                    <Typography variant='body2' className='font-medium text-slate-700 bg-white p-2 rounded border text-xs'>{selectedOrder.address}</Typography>
                  </Box>
                </Stack>
              </Grid2>

              {/* SIM Allocation Controls */}
              <Grid2 size={{ xs: 12, md: 7 }} className='space-y-6'>
                <Typography variant='subtitle2' className='font-black uppercase text-slate-500'>Cấu hình Bàn giao Phôi</Typography>
                
                {selectedOrder.status === 'Chờ bàn giao' ? (
                  <Stack spacing={4}>
                    <Box>
                      <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Phương thức chọn phôi SIM</Typography>
                      <Select fullWidth size='small' value={allocationType} onChange={e => setAllocationType(e.target.value)}>
                        <MenuItem value='auto'>Tự động phân bổ dải phôi khả dụng (Khuyên dùng)</MenuItem>
                        <MenuItem value='manual'>Nhập dải ICCID thủ công</MenuItem>
                      </Select>
                    </Box>

                    <Grid2 container spacing={4}>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Từ ICCID (Bắt đầu dải)</Typography>
                        <TextField 
                          fullWidth 
                          size='small' 
                          value={iccidStart} 
                          onChange={e => setIccidStart(e.target.value)} 
                          disabled={allocationType === 'auto'}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Đến ICCID (Kết thúc dải)</Typography>
                        <TextField 
                          fullWidth 
                          size='small' 
                          value={iccidEnd} 
                          onChange={e => setIccidEnd(e.target.value)} 
                          disabled={allocationType === 'auto'}
                        />
                      </Grid2>
                    </Grid2>

                    {selectedOrder.shippingMethod === 'delivery' && (
                      <Grid2 container spacing={4}>
                        <Grid2 size={{ xs: 6 }}>
                          <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Đơn vị vận chuyển</Typography>
                          <Select fullWidth size='small' value={carrierShipping} onChange={e => setCarrierShipping(e.target.value)}>
                            <MenuItem value='DHL Express'>DHL Express</MenuItem>
                            <MenuItem value='FedEx'>FedEx International</MenuItem>
                            <MenuItem value='UPS'>UPS Worldwide</MenuItem>
                          </Select>
                        </Grid2>
                        <Grid2 size={{ xs: 6 }}>
                          <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Mã vận đơn bưu cục</Typography>
                          <TextField 
                            fullWidth 
                            size='small' 
                            value={trackingCode} 
                            onChange={e => setTrackingCode(e.target.value)} 
                          />
                        </Grid2>
                      </Grid2>
                    )}

                    <Alert severity='info' className='border-none text-xs p-2' icon={<i className='tabler-info-circle text-xs mt-0.5' />}>
                      Khi xác nhận, dải ICCID trên sẽ tự động được đánh dấu là "Đã bàn giao" sang đại lý {selectedOrder.agent} và trừ tương ứng trong kho phôi SIM của 3M.
                    </Alert>
                  </Stack>
                ) : (
                  // Readonly details for processed orders
                  <Stack spacing={4} className='border rounded-xl p-4 bg-primary/5 border-primary/10'>
                    <Box className='flex justify-between py-1 border-b border-dashed border-primary/10'>
                      <Typography variant='body2' className='text-slate-500'>Dải số ICCID đã bàn giao</Typography>
                      <Typography variant='body2' className='font-mono font-bold text-slate-800'>{selectedOrder.iccidRange}</Typography>
                    </Box>
                    {selectedOrder.trackingCode && (
                      <Box className='flex justify-between py-1 border-b border-dashed border-primary/10'>
                        <Typography variant='body2' className='text-slate-500'>Mã vận đơn vận chuyển</Typography>
                        <Typography variant='body2' className='font-mono font-bold text-primary'>{selectedOrder.trackingCode}</Typography>
                      </Box>
                    )}
                    <Alert severity='success' className='border-none text-xs' icon={<i className='tabler-circle-check text-xs mt-0.5' />}>
                      Đơn hàng đã được xử lý thành công. Trạng thái hiện tại: <b>{selectedOrder.status}</b>
                    </Alert>
                  </Stack>
                )}
              </Grid2>
            </Grid2>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='tonal' color='secondary' onClick={() => setIsFulfillOpen(false)}>Hủy</Button>
          {selectedOrder?.status === 'Chờ bàn giao' && (
            <Button variant='contained' color='success' onClick={handleConfirmFulfillment}>
              Xác nhận Bàn giao & Vận chuyển
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PhysicalSimAllocationView
