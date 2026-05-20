'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import PageHeader from '@/components/layout/shared/PageHeader'

const TransactionsList = () => {
  const pathname = usePathname()
  const isAdmin = pathname.includes('/3m/')
  
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [activeTab, setActiveTab] = useState(0)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')

  const handleOpenDetail = (tx: any) => {
    setSelectedTx(tx)
    setOpenDialog(true)
  }

  // Mock Transactions for view
  const transactions = [
    { id: 'TRX-10293', agent: 'TravelConnect', supplier: 'Singtel', type: 'Purchase', typeLabel: 'Mua eSIM (Japan Travel)', amount: 12.50, flow: 'out', status: 'Completed', date: '2026-04-25T14:20:00Z', reference: 'ORD-99812', description: 'Gói 10GB - 30 Ngày' },
    { id: 'TRX-10294', agent: 'Global eSIM Hub', supplier: '-', type: 'Payment', typeLabel: 'Thanh toán nợ công nợ', amount: 500.00, flow: 'in', status: 'Completed', date: '2026-04-25T14:15:00Z', reference: 'PAY-1122', description: 'Thanh toán qua Chuyển khoản' },
    { id: 'TRX-10295', agent: 'CheapData Agency', supplier: 'AIS', type: 'Purchase', typeLabel: 'Mua eSIM (Thailand Unlimited)', amount: 6.20, flow: 'out', status: 'Pending', date: '2026-04-25T14:00:00Z', reference: 'ORD-99810', description: 'Gói Unlimited - 7 Ngày' },
    { id: 'TRX-10296', agent: 'Nomad Partner', supplier: '-', type: 'Payment', typeLabel: 'Thanh toán nợ công nợ', amount: 200.00, flow: 'in', status: 'Completed', date: '2026-04-25T12:00:00Z', reference: 'PAY-1123', description: 'Thanh toán qua Ví điện tử' },
    { id: 'TRX-10297', agent: 'TravelConnect', supplier: 'Orange FR', type: 'Purchase', typeLabel: 'Mua eSIM (Europe Roaming)', amount: 9.00, flow: 'out', status: 'Completed', date: '2026-04-24T10:30:00Z', reference: 'ORD-99808', description: 'Gói 5GB - 15 Ngày' },
    { id: 'TRX-10298', agent: 'Global eSIM Hub', supplier: '-', type: 'Adjustment', typeLabel: 'Điều chỉnh số dư', amount: 50.00, flow: 'in', status: 'Completed', date: '2026-04-24T09:00:00Z', reference: 'ADJ-001', description: 'Hoàn tiền lỗi hệ thống' },
  ]

  const filteredTransactions = transactions.filter(t => {
    const isPurchase = t.type === 'Purchase' || (t.type === 'Adjustment' && t.flow === 'in' && activeTab === 0)
    const isPayment = t.type === 'Payment'
    
    if (activeTab === 0 && !isPurchase) return false
    if (activeTab === 1 && !isPayment) return false
    
    const matchSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.typeLabel.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchStatus = status === 'all' || t.status.toLowerCase() === status.toLowerCase()
    
    // Role based filtering
    if (isAdmin) {
      const matchAgent = agentFilter === 'all' || t.agent === agentFilter
      const matchSupplier = supplierFilter === 'all' || t.supplier === supplierFilter
      return matchSearch && matchStatus && matchAgent && matchSupplier
    }
    
    return matchSearch && matchStatus
  })

  const totalPurchase = transactions.filter(t => t.type === 'Purchase' && t.status === 'Completed').reduce((acc, t) => acc + t.amount, 0)
  const totalPayment = transactions.filter(t => t.type === 'Payment' && t.status === 'Completed').reduce((acc, t) => acc + t.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'Pending': return 'warning'
      case 'Failed': return 'error'
      default: return 'primary'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <>
      <PageHeader
        title="Lịch sử Giao dịch"
        description={isAdmin ? "Theo dõi chi tiết các giao dịch mua hàng và thanh toán công nợ của hệ thống." : "Theo dõi chi tiết các giao dịch mua hàng và thanh toán ví của bạn."}
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài chính' }, { label: 'Giao dịch' }]}
        actions={
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-download' />}>Xuất Sao kê</Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6} className='mbe-6'>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card className='border-none shadow-sm bg-error/5 border-error/20 h-full'>
            <CardContent className='p-6 flex items-center gap-4'>
              <Avatar variant='rounded' className='bg-error/20 text-error bs-[48px] is-[48px]'>
                <i className='tabler-shopping-cart text-[28px]' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-bold text-error uppercase'>Tổng Tiền Mua eSIM</Typography>
                <Typography variant='h3' className='font-black text-error'>{formatCurrency(totalPurchase)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card className='border-none shadow-sm bg-success/5 border-success/20 h-full'>
            <CardContent className='p-6 flex items-center gap-4'>
              <Avatar variant='rounded' className='bg-success/20 text-success bs-[48px] is-[48px]'>
                <i className='tabler-cash-banknote text-[28px]' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-bold text-success uppercase'>{isAdmin ? 'Tổng Tiền Đã Thanh Toán' : 'Tổng Tiền Đã Nạp'}</Typography>
                <Typography variant='h3' className='font-black text-success'>{formatCurrency(totalPayment)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Card className='border-none shadow-sm'>
        <Box className='border-be'>
          <Tabs 
            value={activeTab} 
            onChange={(_, val) => setActiveTab(val)}
            className='px-6 pt-2'
            indicatorColor='primary'
            textColor='primary'
          >
            <Tab label="1. Lịch sử mua eSIM" className='font-black' />
            <Tab label="2. Lịch sử thanh toán & nạp tiền" className='font-black' />
          </Tabs>
        </Box>

        <Box className='p-6 border-be bg-slate-50/30'>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: isAdmin ? 3 : 4 }}>
              <TextField 
                fullWidth 
                placeholder='Tìm mã giao dịch, reference...' 
                size='small'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='bg-white'
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 2 }}>
              <TextField select fullWidth size='small' value={status} onChange={(e) => setStatus(e.target.value)} label='Trạng thái' className='bg-white'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='completed'>Thành công</MenuItem>
                <MenuItem value='pending'>Đang xử lý</MenuItem>
                <MenuItem value='failed'>Thất bại</MenuItem>
              </TextField>
            </Grid2>
            
            {isAdmin && (
              <>
                <Grid2 size={{ xs: 6, md: 2.5 }}>
                  <TextField select fullWidth size='small' value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} label='Đại lý' className='bg-white'>
                    <MenuItem value='all'>Tất cả Đại lý</MenuItem>
                    <MenuItem value='TravelConnect'>TravelConnect</MenuItem>
                    <MenuItem value='Global eSIM Hub'>Global eSIM Hub</MenuItem>
                    <MenuItem value='CheapData Agency'>CheapData Agency</MenuItem>
                    <MenuItem value='Nomad Partner'>Nomad Partner</MenuItem>
                  </TextField>
                </Grid2>
                <Grid2 size={{ xs: 6, md: 2.5 }}>
                  <TextField select fullWidth size='small' value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)} label='Nhà cung cấp' className='bg-white'>
                    <MenuItem value='all'>Tất cả NCC</MenuItem>
                    <MenuItem value='Singtel'>Singtel</MenuItem>
                    <MenuItem value='AIS'>AIS</MenuItem>
                    <MenuItem value='Orange FR'>Orange FR</MenuItem>
                    <MenuItem value='Viettel'>Viettel</MenuItem>
                  </TextField>
                </Grid2>
              </>
            )}
            
            <Grid2 size={{ xs: 6, md: 2 }}>
              <Button fullWidth variant='tonal' color='secondary' onClick={() => { setSearchTerm(''); setStatus('all'); setAgentFilter('all'); setSupplierFilter('all'); }}>Xóa lọc</Button>
            </Grid2>
            <Grid2 size={{ xs: 12, md: isAdmin ? 6 : 4 }}>
              <Stack direction='row' spacing={2}>
                <TextField type="date" fullWidth size='small' label='Từ ngày' InputLabelProps={{ shrink: true }} className='bg-white' />
                <TextField type="date" fullWidth size='small' label='Đến ngày' InputLabelProps={{ shrink: true }} className='bg-white' />
              </Stack>
            </Grid2>
          </Grid2>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className='bg-slate-50'>
                <TableCell className='font-black uppercase text-[11px] whitespace-nowrap'>Mã GD & Thời gian</TableCell>
                {isAdmin && <TableCell className='font-black uppercase text-[11px]'>Đại lý / NCC</TableCell>}
                <TableCell className='font-black uppercase text-[11px]'>Nội dung / Diễn giải</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Reference</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Số tiền</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Trạng thái</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                <TableRow key={t.id} hover className='transition-colors'>
                  <TableCell>
                    <Box className='flex flex-col'>
                      <Typography variant='body2' className='font-mono font-bold text-primary'>{t.id}</Typography>
                      <Typography variant='caption' className='text-slate-500'>{formatDate(t.date)}</Typography>
                    </Box>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Box>
                        <Typography variant='body2' className='font-black'>{t.agent}</Typography>
                        <Typography variant='caption' className='text-primary font-bold'>{t.supplier}</Typography>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>
                    <Box>
                      <Typography variant='body2' className='font-black'>{t.typeLabel}</Typography>
                      <Typography variant='caption' className='text-slate-500'>{t.description}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' className='font-mono text-slate-600'>{t.reference}</Typography>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='body2' className={`font-black ${t.flow === 'in' ? 'text-success' : 'text-error'}`}>
                      {t.flow === 'in' ? '+' : '-'}{formatCurrency(t.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Chip 
                      label={t.status === 'Completed' ? 'Thành công' : t.status === 'Pending' ? 'Đang xử lý' : 'Thất bại'} 
                      color={getStatusColor(t.status) as any} 
                      size='small' 
                      variant='tonal' 
                      className='font-bold text-[10px]'
                    />
                  </TableCell>
                  <TableCell className='text-right'>
                    <Tooltip title="Xem chi tiết">
                      <IconButton size='small' color='primary' onClick={() => handleOpenDetail(t)}>
                        <i className='tabler-eye' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} align='center' className='p-12'>
                    <Typography variant='body2' className='text-slate-400 italic'>Không tìm thấy giao dịch nào phù hợp.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className='p-4 border-ts flex justify-between items-center bg-slate-50/30'>
          <Typography variant='body2' className='text-slate-500'>Hiển thị 1 - {filteredTransactions.length} của {filteredTransactions.length} kết quả</Typography>
          <Button variant='text' size='small' className='font-black'>Tải thêm lịch sử</Button>
        </Box>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle component='div' className='font-black flex justify-between items-center'>
          <span>Chi tiết Giao dịch</span>
          <IconButton onClick={() => setOpenDialog(false)} size='small'><i className='tabler-x' /></IconButton>
        </DialogTitle>
        <DialogContent dividers className='p-6'>
          {selectedTx && (
            <Stack spacing={4}>
              <Box className='flex justify-between items-center bg-slate-50 p-5 rounded-xl border border-slate-100'>
                <Box>
                  <Typography variant='caption' className='text-slate-500 uppercase font-black tracking-wider'>Transaction ID</Typography>
                  <Typography variant='h5' className='font-mono font-black text-primary'>{selectedTx.id}</Typography>
                </Box>
                <Chip 
                  label={selectedTx.status === 'Completed' ? 'Thành công' : 'Đang xử lý'} 
                  color={getStatusColor(selectedTx.status) as any} 
                  variant='tonal'
                  className='font-black' 
                />
              </Box>
              
              <Grid2 container spacing={6}>
                {isAdmin && (
                  <>
                    <Grid2 size={{ xs: 6 }}>
                      <Typography variant='caption' className='text-slate-500 font-bold uppercase text-[10px]'>Đại lý</Typography>
                      <Typography variant='body1' className='font-black'>{selectedTx.agent}</Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <Typography variant='caption' className='text-slate-500 font-bold uppercase text-[10px]'>Nhà cung cấp (Upstream)</Typography>
                      <Typography variant='body1' className='font-black text-primary'>{selectedTx.supplier}</Typography>
                    </Grid2>
                  </>
                )}
                <Grid2 size={{ xs: 6 }}>
                  <Typography variant='caption' className='text-slate-500 font-bold uppercase text-[10px]'>Loại giao dịch</Typography>
                  <Typography variant='body1' className='font-black'>{selectedTx.typeLabel}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Typography variant='caption' className='text-slate-500 font-bold uppercase text-[10px]'>Số Reference</Typography>
                  <Typography variant='body1' className='font-mono font-bold'>{selectedTx.reference}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Typography variant='caption' className='text-slate-500 font-bold uppercase text-[10px]'>Thời gian</Typography>
                  <Typography variant='body2' className='font-medium'>{formatDate(selectedTx.date)}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Typography variant='caption' className='text-slate-500 font-bold uppercase text-[10px]'>Diễn giải</Typography>
                  <Typography variant='body2' className='font-medium'>{selectedTx.description}</Typography>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <Divider />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <Box className='p-5 rounded-xl bg-primary/5 border border-primary/10 flex justify-between items-center'>
                    <Typography variant='subtitle1' className='font-black text-slate-700'>Số tiền giao dịch</Typography>
                    <Typography variant='h4' className={`font-black ${selectedTx.flow === 'in' ? 'text-success' : 'text-error'}`}>
                      {selectedTx.flow === 'in' ? '+' : '-'}{formatCurrency(selectedTx.amount)}
                    </Typography>
                  </Box>
                </Grid2>
              </Grid2>
            </Stack>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='tonal' color='secondary' onClick={() => setOpenDialog(false)} fullWidth>Đóng</Button>
          <Button variant='contained' startIcon={<i className='tabler-file-text' />} fullWidth>Xem Chứng từ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TransactionsList
