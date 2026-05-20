'use client'

import { useState } from 'react'
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
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'

import PageHeader from '@/components/layout/shared/PageHeader'

const PhysicalSimOrderView = () => {
  const [supplier, setSupplier] = useState('Hồng Kông')
  const [quantity, setQuantity] = useState(100)
  const [shippingMethod, setShippingMethod] = useState('delivery')
  const [shippingAddress, setShippingAddress] = useState('Số 12 Ngõ 45 Cầu Giấy, Hà Nội')
  
  // Wallet state mockup
  const walletBalance = 5240000 // VND
  const pricePerSim = 20000 // VND per phôi SIM
  const totalCost = quantity * pricePerSim

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Mock Purchase Order History
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ORD-SIM-9921',
      supplier: 'Hồng Kông',
      quantity: 50,
      unitPrice: 20000,
      totalAmount: 1000000,
      status: 'Chờ duyệt & Bàn giao', // 'Chờ duyệt & Bàn giao', 'Đang giao hàng', 'Đã hoàn thành', 'Đã huỷ'
      date: '19/05/2026 11:30',
      shippingMethod: 'delivery',
      address: 'Số 12 Ngõ 45 Cầu Giấy, Hà Nội',
      trackingNumber: null,
      iccidRange: null
    },
    {
      id: 'ORD-SIM-9915',
      supplier: 'Hồng Kông',
      quantity: 100,
      unitPrice: 20000,
      totalAmount: 2000000,
      status: 'Đang giao hàng',
      date: '17/05/2026 09:15',
      shippingMethod: 'delivery',
      address: 'Số 12 Ngõ 45 Cầu Giấy, Hà Nội',
      trackingNumber: 'DHL-HKG-9928122',
      iccidRange: '8985209000000000010 - 8985209000000000109'
    },
    {
      id: 'ORD-SIM-9872',
      supplier: 'Mỹ',
      quantity: 200,
      unitPrice: 20000,
      totalAmount: 4000000,
      status: 'Đã hoàn thành',
      date: '10/05/2026 14:00',
      shippingMethod: 'pickup',
      address: 'Nhận trực tiếp tại văn phòng 3M',
      trackingNumber: null,
      iccidRange: '8981209000000000400 - 8981209000000000599'
    }
  ])

  const handleCreateOrder = () => {
    if (totalCost > walletBalance) {
      alert('Số dư ví của bạn không đủ để thực hiện giao dịch này. Vui lòng nạp thêm tiền!')
      return
    }

    const newOrder = {
      id: `ORD-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier,
      quantity,
      unitPrice: pricePerSim,
      totalAmount: totalCost,
      status: 'Chờ duyệt & Bàn giao',
      date: new Date().toLocaleString('vi-VN'),
      shippingMethod,
      address: shippingMethod === 'pickup' ? 'Nhận trực tiếp tại văn phòng 3M' : shippingAddress,
      trackingNumber: null,
      iccidRange: null
    }

    setOrders([newOrder, ...orders])
    alert(`Đặt mua ${quantity} phôi SIM ${supplier} thành công! Đơn hàng đang chờ Admin 3M duyệt và bàn giao phôi.`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ duyệt & Bàn giao':
        return 'warning'
      case 'Đang giao hàng':
        return 'info'
      case 'Đã hoàn thành':
        return 'success'
      case 'Đã huỷ':
        return 'error'
      default:
        return 'secondary'
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
        title="Đặt mua Phôi SIM trắng"
        description="Đại lý đặt mua lô phôi SIM trắng vật lý từ 3M. Sau khi Admin bàn giao dải số, các phôi SIM sẽ tự động được đồng bộ vào kho của bạn."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/agent/dashboard' },
          { label: 'Kênh Đại lý' },
          { label: 'Mua Phôi SIM' }
        ]}
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Purchase Form */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent className='p-6 space-y-6'>
              <Typography variant='h6' className='font-black flex justify-between items-center'>
                Tạo đơn mua phôi SIM
                <Chip 
                  label={`Ví: ${walletBalance.toLocaleString('vi-VN')} đ`} 
                  color='primary' 
                  variant='tonal' 
                  size='small' 
                  className='font-bold'
                />
              </Typography>

              <Divider />

              <Stack spacing={4}>
                <Box>
                  <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Nhà mạng phôi SIM</Typography>
                  <Select fullWidth size='small' value={supplier} onChange={e => setSupplier(e.target.value)}>
                    <MenuItem value='Hồng Kông'>Hồng Kông (HK Telecom)</MenuItem>
                    <MenuItem value='Mỹ'>Mỹ (US Carrier Partner)</MenuItem>
                  </Select>
                </Box>

                <Box>
                  <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Số lượng phôi</Typography>
                  <TextField 
                    fullWidth 
                    size='small' 
                    type='number' 
                    value={quantity} 
                    onChange={e => setQuantity(Math.max(10, Number(e.target.value)))}
                    helperText="Số lượng tối thiểu mỗi đơn mua là 10 phôi SIM"
                  />
                </Box>

                <Box>
                  <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Phương thức nhận hàng</Typography>
                  <Select fullWidth size='small' value={shippingMethod} onChange={e => setShippingMethod(e.target.value)}>
                    <MenuItem value='delivery'>Giao hàng tận nơi (Chuyển phát bưu điện)</MenuItem>
                    <MenuItem value='pickup'>Nhận trực tiếp tại văn phòng 3M</MenuItem>
                  </Select>
                </Box>

                {shippingMethod === 'delivery' && (
                  <Box>
                    <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Địa chỉ giao hàng</Typography>
                    <TextField 
                      fullWidth 
                      size='small' 
                      multiline 
                      rows={2} 
                      value={shippingAddress} 
                      onChange={e => setShippingAddress(e.target.value)} 
                    />
                  </Box>
                )}

                <Card variant='outlined' className='bg-slate-50/50 p-4 border-slate-100 rounded-xl mt-4'>
                  <Stack spacing={2}>
                    <Box className='flex justify-between items-center'>
                      <Typography variant='body2' className='text-slate-500'>Đơn giá phôi:</Typography>
                      <Typography variant='body2' className='font-bold text-slate-800'>{pricePerSim.toLocaleString('vi-VN')} đ / SIM</Typography>
                    </Box>
                    <Box className='flex justify-between items-center'>
                      <Typography variant='body2' className='text-slate-500'>Số lượng mua:</Typography>
                      <Typography variant='body2' className='font-bold text-slate-800'>{quantity} phôi</Typography>
                    </Box>
                    <Divider />
                    <Box className='flex justify-between items-center'>
                      <Typography variant='body1' className='font-black text-slate-800'>Tổng tiền thanh toán:</Typography>
                      <Typography variant='h5' className='font-black text-primary'>{totalCost.toLocaleString('vi-VN')} đ</Typography>
                    </Box>
                  </Stack>
                </Card>

                <Button 
                  variant='contained' 
                  color='primary' 
                  fullWidth 
                  size='large'
                  onClick={handleCreateOrder}
                  startIcon={<i className='tabler-wallet' />}
                >
                  Thanh toán & Đặt hàng
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* History Table */}
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Card className='border-none shadow-sm h-full flex flex-col'>
            <CardContent className='p-6 flex-1 flex flex-col'>
              <Typography variant='h6' className='font-black mbe-4 flex items-center gap-2'>
                <i className='tabler-history text-xl text-primary' /> Lịch sử Đơn mua Phôi SIM
              </Typography>

              <TableContainer className='flex-1 border rounded-lg overflow-y-auto max-h-[500px]'>
                <Table size='small'>
                  <TableHead className='bg-slate-50'>
                    <TableRow>
                      <TableCell className='font-bold text-xs uppercase'>Mã đơn</TableCell>
                      <TableCell className='font-bold text-xs uppercase'>Nhà mạng</TableCell>
                      <TableCell className='font-bold text-xs uppercase text-center'>Số lượng</TableCell>
                      <TableCell className='font-bold text-xs uppercase text-right'>Thành tiền</TableCell>
                      <TableCell className='font-bold text-xs uppercase text-center'>Trạng thái</TableCell>
                      <TableCell className='font-bold text-xs uppercase text-center'>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow key={order.id || idx} hover>
                        <TableCell className='font-mono text-xs font-bold text-slate-600'>{order.id}</TableCell>
                        <TableCell>
                          <Typography variant='body2' className='font-bold' sx={{ color: getSupplierColor(order.supplier) }}>
                            {order.supplier}
                          </Typography>
                        </TableCell>
                        <TableCell className='text-center font-bold'>{order.quantity}</TableCell>
                        <TableCell className='text-right font-black text-slate-800'>
                          {order.totalAmount.toLocaleString('vi-VN')} đ
                        </TableCell>
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
                          <IconButton 
                            size='small' 
                            color='primary'
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsDetailOpen(true)
                            }}
                          >
                            <i className='tabler-eye text-[18px]' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Order Details Dialog */}
      <Dialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between border-b p-5'>
          <Box>
            <Typography variant='h5' className='font-black'>Chi tiết Đơn mua Phôi SIM</Typography>
            <Typography variant='caption' color='textSecondary'>Mã đơn: {selectedOrder?.id}</Typography>
          </Box>
          <IconButton onClick={() => setIsDetailOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedOrder && (
            <Stack spacing={4}>
              <Box className='flex justify-between items-center p-4 bg-slate-50 rounded-xl'>
                <Box>
                  <Typography variant='caption' color='textSecondary' className='block uppercase font-bold text-[10px]'>Số tiền đã thanh toán</Typography>
                  <Typography variant='h5' className='font-black text-primary'>{selectedOrder.totalAmount.toLocaleString('vi-VN')} đ</Typography>
                </Box>
                <Chip 
                  label={selectedOrder.status} 
                  color={getStatusColor(selectedOrder.status) as any} 
                  variant='tonal'
                  className='font-black'
                />
              </Box>

              <Stack spacing={2} className='border rounded-xl p-4'>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Nhà mạng phôi</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>{selectedOrder.supplier}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Số lượng mua</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>{selectedOrder.quantity} phôi SIM</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Đơn giá phôi</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>{selectedOrder.unitPrice.toLocaleString('vi-VN')} đ</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Ngày tạo đơn</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700'>{selectedOrder.date}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Nhận hàng bằng</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>
                    {selectedOrder.shippingMethod === 'pickup' ? 'Nhận trực tiếp' : 'Giao hàng tận nơi'}
                  </Typography>
                </Box>
                <Box className='flex flex-col py-1'>
                  <Typography variant='body2' className='text-slate-500 mbe-1'>Địa chỉ nhận phôi SIM</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700 bg-slate-50 p-2 rounded border'>{selectedOrder.address}</Typography>
                </Box>
              </Stack>

              {/* Delivery Details */}
              {selectedOrder.status !== 'Chờ duyệt & Bàn giao' && (
                <Box className='p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3'>
                  <Typography variant='subtitle2' className='font-black text-primary uppercase text-xs'>Thông tin bàn giao & Vận chuyển</Typography>
                  
                  {selectedOrder.trackingNumber && (
                    <Box className='flex justify-between items-center py-1 border-b border-dashed border-primary/10'>
                      <Typography variant='body2' className='text-slate-500'>Mã vận đơn Bưu điện</Typography>
                      <Typography variant='body2' className='font-mono font-bold text-primary'>{selectedOrder.trackingNumber}</Typography>
                    </Box>
                  )}

                  {selectedOrder.iccidRange && (
                    <Box className='flex flex-col py-1'>
                      <Typography variant='body2' className='text-slate-500 mbe-1'>Dải số ICCID đã bàn giao</Typography>
                      <Typography variant='body2' className='font-mono font-bold text-slate-800 bg-white p-2 rounded border border-primary/10 text-xs text-center'>
                        {selectedOrder.iccidRange}
                      </Typography>
                      <Alert severity='success' className='border-none mt-2 p-1 text-xs' icon={<i className='tabler-circle-check text-xs mt-0.5' />}>
                        Dải phôi SIM trên đã được nạp tự động vào <b>"Kho Phôi SIM"</b> của bạn.
                      </Alert>
                    </Box>
                  )}
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='contained' color='primary' onClick={() => setIsDetailOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PhysicalSimOrderView
