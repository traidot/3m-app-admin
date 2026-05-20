'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid2 from '@mui/material/Grid2'
import Collapse from '@mui/material/Collapse'
import { useState } from 'react'
import { toast } from 'react-toastify'

import PageHeader from '@/components/layout/shared/PageHeader'

const MyOrdersView = () => {
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order)
    setOpenDetailDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDetailDialog(false)
    setTimeout(() => setSelectedOrder(null), 300)
  }

  const handleSendEmail = () => {
    toast.success('Đã gửi thông tin eSIM qua email thành công!')
    handleCloseDialog()
  }

  const baseOrders = [
    { product: 'Japan Travel eSIM', data: '10GB', validity: '30 Days', price: 12.5 },
    { product: 'Thailand Explorer', data: 'Unlimited', validity: '7 Days', price: 6.2 },
    { product: 'Europe Roaming', data: '5GB', validity: '15 Days', price: 9.0 },
    { product: 'USA Premium', data: '20GB', validity: '30 Days', price: 22.0 },
    { product: 'Vietnam Local', data: '20GB', validity: '30 Days', price: 5.5 }
  ]

  const myOrders = Array.from({ length: 15 }).map((_, i) => {
    const base = baseOrders[i % baseOrders.length]
    const qty = (i % 3) + 1
    const statuses = ['Success', 'Success', 'Success', 'Pending', 'Failed']
    const status = statuses[i % 5]

    const iccids = status === 'Success'
      ? Array.from({ length: qty }).map((__, k) => {
          const seed = (i + 1) * 1000003 + k * 7919

          return `898401${seed.toString().padStart(13, '0').slice(-13)}`
        })
      : []

    return {
      id: `TXN-${8240 - i}`,
      product: base.product,
      data: base.data,
      validity: base.validity,
      qty,
      amount: `$${(base.price * qty).toFixed(2)}`,
      iccids,
      iccid: iccids[0] ?? '-',
      status,
      date: `2026-05-${String((i % 4) + 1).padStart(2, '0')} 14:${String((i * 7) % 60).padStart(2, '0')}`,
      remarks: i % 4 === 0 ? `Client ${i}` : ''
    }
  })

  return (
    <>
      <PageHeader
        title="Lịch sử mua eSIM"
        description="Theo dõi lịch sử mua các gói eSIM, số lượng và trạng thái kích hoạt"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Đại lý' }, { label: 'Lịch sử mua eSIM' }]}
        className='mbe-6'
      />

      <Card className='border-none shadow-sm'>
        <CardContent className='p-0'>
          {/* Tabs & Filters */}
          <Box className='border-b border-slate-200 px-4 pt-2'>
            <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} indicatorColor="primary" textColor="primary">
              <Tab label="Tất cả giao dịch (42)" className='font-bold' />
              <Tab label="Thành công (35)" className='font-bold' />
              <Tab label="Đang xử lý (5)" className='font-bold' />
              <Tab label="Thất bại (2)" className='font-bold' />
            </Tabs>
          </Box>

          <Box className='p-4 bg-slate-50/50 border-b border-slate-200'>
            <Box className='flex flex-wrap gap-4 items-center'>
              <TextField
                size='small'
                placeholder='Tìm kiếm ICCID...'
                slotProps={{ input: { startAdornment: <InputAdornment position='start'><i className='tabler-search text-slate-400' /></InputAdornment> } }}
                className='min-is-[250px] bg-white'
              />
              <TextField select size='small' defaultValue="all" className='min-is-[200px] bg-white' label='Thời gian'>
                <MenuItem value="all">Tất cả thời gian</MenuItem>
                <MenuItem value="today">Hôm nay</MenuItem>
                <MenuItem value="week">Tuần này</MenuItem>
                <MenuItem value="month">Tháng này</MenuItem>
              </TextField>
              <Button 
                variant={showFilters ? 'contained' : 'tonal'} 
                color='primary' 
                startIcon={<i className='tabler-filter' />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Lọc nâng cao
              </Button>
              <Box className='flex-grow' />
              <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>Xuất Excel</Button>
            </Box>

            <Collapse in={showFilters}>
              <Box className='pt-4 mt-4 border-t border-slate-200'>
                <Grid2 container spacing={4}>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField fullWidth select size='small' label='Loại eSIM' defaultValue='all' className='bg-white'>
                      <MenuItem value='all'>Tất cả loại</MenuItem>
                      <MenuItem value='Daily'>Gói Daily (Theo ngày)</MenuItem>
                      <MenuItem value='Total'>Gói Total (Tổng dung lượng)</MenuItem>
                    </TextField>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField fullWidth select size='small' label='Dung lượng' defaultValue='all' className='bg-white'>
                      <MenuItem value='all'>Tất cả dung lượng</MenuItem>
                      <MenuItem value='5GB'>5GB</MenuItem>
                      <MenuItem value='10GB'>10GB</MenuItem>
                      <MenuItem value='20GB'>20GB</MenuItem>
                      <MenuItem value='Unlimited'>Không giới hạn</MenuItem>
                    </TextField>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField fullWidth select size='small' label='Số ngày' defaultValue='all' className='bg-white'>
                      <MenuItem value='all'>Tất cả thời hạn</MenuItem>
                      <MenuItem value='7'>7 Ngày</MenuItem>
                      <MenuItem value='15'>15 Ngày</MenuItem>
                      <MenuItem value='30'>30 Ngày</MenuItem>
                    </TextField>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField fullWidth type='date' size='small' label='Từ ngày' slotProps={{ inputLabel: { shrink: true } }} className='bg-white' />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField fullWidth type='date' size='small' label='Đến ngày' slotProps={{ inputLabel: { shrink: true } }} className='bg-white' />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6, md: 9 }} className='flex items-end justify-end gap-2'>
                    <Button variant='tonal' color='secondary' className='min-is-[120px]'>Xóa lọc</Button>
                    <Button variant='contained' color='primary' className='min-is-[120px]'>Áp dụng bộ lọc</Button>
                  </Grid2>
                </Grid2>
              </Box>
            </Collapse>
          </Box>

          <Box className='overflow-x-auto'>
            <table className='w-full text-left border-collapse min-w-[900px]'>
              <thead>
                <tr className='bg-slate-50 border-be'>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Ngày mua</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Sản phẩm & Gói</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>ICCID</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Số lượng</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Tổng tiền</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase text-center'>Trạng thái</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {myOrders
                  .filter(o => {
                    if (activeTab === 1) return o.status === 'Success'
                    if (activeTab === 2) return o.status === 'Pending'
                    if (activeTab === 3) return o.status === 'Failed'

                    return true
                  })
                  .map((o) => (
                  <tr key={o.id} className='border-be last:border-0 hover:bg-slate-50/50 transition-colors'>
                    <td className='p-4'>
                      <Typography variant='body2' className='font-medium'>{o.date}</Typography>
                    </td>
                    <td className='p-4'>
                      <Typography variant='body2' className='font-black'>{o.product}</Typography>
                      <Typography variant='caption' className='text-slate-500'>{o.data} • {o.validity}</Typography>
                    </td>
                    <td className='p-4'>
                      <Typography variant='body2' className='font-mono text-xs'>{o.iccid}</Typography>
                      {o.iccids.length > 1 && (
                        <Typography variant='caption' className='text-slate-500'>
                          +{o.iccids.length - 1} eSIM khác
                        </Typography>
                      )}
                    </td>
                    <td className='p-4 text-right'>
                      <Typography variant='body2' className='font-bold'>{o.qty}</Typography>
                    </td>
                    <td className='p-4 text-right'>
                      <Typography variant='body2' className='font-black text-primary'>{o.amount}</Typography>
                    </td>
                    <td className='p-4 text-center'>
                      <Chip
                        label={o.status === 'Success' ? 'Thành công' : o.status === 'Failed' ? 'Thất bại' : 'Đang xử lý'}
                        size='small'
                        variant='tonal'
                        color={o.status === 'Success' ? 'success' : o.status === 'Failed' ? 'error' : 'warning'}
                        className='font-bold text-[10px]'
                      />
                    </td>
                    <td className='p-4 text-right'>
                      <Box className='flex justify-end gap-1'>
                        <Tooltip title='Xem chi tiết'>
                          <IconButton size='small' color='primary' onClick={() => handleOpenDetail(o)}>
                            <i className='tabler-eye' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Box className='p-4 flex justify-between items-center border-t border-slate-200'>
            <Typography variant='body2' className='text-slate-500'>Hiển thị 1 đến 15 của 42 giao dịch</Typography>
            <Pagination count={3} color='primary' shape='rounded' />
          </Box>
        </CardContent>
      </Card>

      {/* Simplified Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        <DialogTitle className='flex items-center justify-between'>
          <Typography variant='h5' component='span' className='font-black'>Chi tiết giao dịch mua eSIM</Typography>
          <IconButton onClick={handleCloseDialog} size='small'><i className='tabler-x' /></IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedOrder && (
            <Box className='flex flex-col gap-6'>
              <Box className='p-5 bg-slate-50 rounded-xl border border-slate-100'>
                <Grid2 container spacing={4}>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' className='text-slate-500 uppercase tracking-wider'>Sản phẩm</Typography>
                    <Typography variant='body1' className='font-black'>{selectedOrder.product}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' className='text-slate-500 uppercase tracking-wider'>Gói cước</Typography>
                    <Typography variant='body1' className='font-bold'>{selectedOrder.data} / {selectedOrder.validity}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' className='text-slate-500 uppercase tracking-wider'>Thời gian</Typography>
                    <Typography variant='body1'>{selectedOrder.date}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' className='text-slate-500 uppercase tracking-wider'>Tổng thanh toán</Typography>
                    <Typography variant='h6' className='font-black text-primary'>{selectedOrder.amount}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant='caption' className='text-slate-500 uppercase tracking-wider'>Số lượng</Typography>
                    <Typography variant='body1' className='font-medium'>{selectedOrder.qty} eSIM</Typography>
                  </Grid2>
                </Grid2>
              </Box>

              {selectedOrder.status === 'Success' && selectedOrder.iccids.length > 0 && (
                <Box className='flex flex-col gap-4'>
                  <Box className='flex items-center justify-between flex-wrap gap-2'>
                    <Box>
                      <Typography variant='subtitle1' className='font-black'>
                        Danh sách mã QR ({selectedOrder.iccids.length} eSIM)
                      </Typography>
                      <Typography variant='caption' className='text-slate-500'>
                        Mỗi eSIM có một mã QR và ICCID riêng. Quét hoặc gửi cho khách hàng tương ứng.
                      </Typography>
                    </Box>
                    {selectedOrder.iccids.length > 1 && (
                      <Box className='flex gap-2'>
                        <Button size='small' variant='tonal' color='primary' startIcon={<i className='tabler-download' />}>
                          Tải tất cả QR
                        </Button>
                        <Button size='small' variant='tonal' color='primary' startIcon={<i className='tabler-mail' />} onClick={handleSendEmail}>
                          Gửi Email tất cả
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Grid2 container spacing={3}>
                    {selectedOrder.iccids.map((iccid: string, idx: number) => (
                      <Grid2 key={iccid} size={{ xs: 12, sm: selectedOrder.iccids.length === 1 ? 12 : 6 }}>
                        <Box className='p-5 bg-white rounded-xl border border-slate-200 flex flex-col items-center shadow-sm h-full'>
                          <Chip
                            label={`eSIM #${idx + 1}`}
                            size='small'
                            color='primary'
                            variant='tonal'
                            className='font-bold mbe-3 self-start'
                          />
                          <Box className='bg-slate-50 p-4 rounded-lg mbe-4'>
                            <i className='tabler-qrcode text-[120px] text-slate-800' />
                          </Box>
                          <Typography variant='caption' className='text-slate-500 mbe-1 uppercase tracking-wider'>ICCID</Typography>
                          <Typography variant='body2' className='font-mono font-bold mbe-4 break-all text-center'>{iccid}</Typography>

                          <Box className='flex gap-2 is-full mt-auto'>
                            <Button size='small' variant='contained' color='primary' startIcon={<i className='tabler-download' />} fullWidth>
                              Tải QR
                            </Button>
                            <Button size='small' variant='tonal' color='primary' startIcon={<i className='tabler-mail' />} fullWidth onClick={handleSendEmail}>
                              Gửi Email
                            </Button>
                          </Box>
                        </Box>
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              )}

              {selectedOrder.status === 'Failed' && (
                <Box className='p-4 bg-error/10 text-error rounded-lg flex items-center gap-3'>
                  <i className='tabler-alert-circle text-xl' />
                  <Typography variant='body2' color='error' className='font-medium'>
                    Giao dịch thất bại. Vui lòng liên hệ hỗ trợ hoặc kiểm tra lại số dư ví.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='tonal' color='secondary' onClick={handleCloseDialog} fullWidth>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MyOrdersView
