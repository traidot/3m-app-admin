'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierDebtDetail = () => {
  const { id } = useParams()

  const suppliersMock = [
    { id: 'airalo', name: 'Airalo API', code: 'AI', balance: 15240.00, status: 'Active', dueDate: '15/05/2026', type: 'postpaid', email: 'finance@airalo.com', phone: '+1 234 567 890', joinDate: '2024-10-12' },
    { id: '1global', name: '1Global (Truphone)', code: '1G', balance: 5000.00, status: 'Active', dueDate: '-', type: 'prepaid', email: 'billing@1global.com', phone: '+44 888 999 000', joinDate: '2024-11-05' },
    { id: 'redtea', name: 'Redtea Mobile', code: 'RT', balance: 500.00, status: 'Active', dueDate: '10/05/2026', type: 'postpaid', email: 'ops@redteamobile.com', phone: '+852 1122 3344', joinDate: '2025-01-20' },
    { id: 'esimgo', name: 'eSIM Go', code: 'EG', balance: 12500.00, status: 'Warning', dueDate: '20/05/2026', type: 'postpaid', email: 'support@esimgo.com', phone: '+44 123 456 789', joinDate: '2025-02-15' },
  ]

  const supplier = suppliersMock.find(s => s.id === id) || suppliersMock[0]

  const transactions = [
    { id: 'SUP-9901', type: 'order_sync', description: 'Đơn hàng đồng bộ tự động', amount: 450.50, balance: 15240.00, date: '2026-04-28 14:15:22' },
    { id: 'SUP-9882', type: 'payment', description: 'Thanh toán nợ định kỳ T3/2026', amount: -10000.00, balance: 14789.50, date: '2026-04-25 10:30:00' },
    { id: 'SUP-9875', type: 'order_sync', description: 'Đơn hàng đồng bộ tự động', amount: 120.00, balance: 24789.50, date: '2026-04-24 16:12:05' },
    { id: 'SUP-9860', type: 'deposit', description: 'Nạp tiền vào ví NCC', amount: -5000.00, balance: 24669.50, date: '2026-04-20 09:45:00' },
  ]

  return (
    <>
      <PageHeader
        title={supplier.type === 'postpaid' ? `Quản lý Công nợ: ${supplier.name}` : `Quản lý Ví NCC: ${supplier.name}`}
        description={supplier.type === 'postpaid' ? "Theo dõi lịch sử đơn hàng nhập và thanh toán cho nhà cung cấp." : "Quản lý số dư tiền nạp và chi tiêu tại nhà cung cấp."}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài chính' },
          { label: 'Phải trả (NCC)', href: '/finance/supplier-debts' },
          { label: supplier.name }
        ]}
        actions={
          <Stack direction='row' spacing={3}>
            {supplier.type === 'postpaid' ? (
              <>
                <Button variant='tonal' color='secondary' startIcon={<i className='tabler-file-download' />}>Xuất đối soát</Button>
                <Button variant='contained' color='primary' startIcon={<i className='tabler-cash-banknote' />}>Lập lệnh thanh toán</Button>
              </>
            ) : (
              <>
                <Button variant='tonal' color='secondary' startIcon={<i className='tabler-file-download' />}>Xuất báo cáo ví</Button>
                <Button variant='contained' color='success' startIcon={<i className='tabler-plus' />}>Nạp tiền NCC</Button>
              </>
            )}
          </Stack>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Left Side: Supplier Info */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack spacing={6}>
            <Card className='border-none shadow-sm overflow-hidden'>
              <Box className={`h-24 ${supplier.type === 'postpaid' ? 'bg-primary/10' : 'bg-success/10'}`} />
              <CardContent className='relative pbs-0'>
                <Box className='flex justify-center -mbs-12 mbe-4'>
                  <Avatar 
                    variant='rounded' 
                    sx={{ width: 100, height: 100, fontSize: '40px', fontWeight: 900, bgcolor: supplier.type === 'postpaid' ? 'primary.main' : 'success.main', border: '5px solid white', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)' }}
                  >
                    {supplier.code}
                  </Avatar>
                </Box>
                <Box className='text-center mbe-6'>
                  <Typography variant='h5' className='font-black'>{supplier.name}</Typography>
                  <Typography variant='caption' className='font-bold text-slate-500 uppercase text-[10px]'>ID: {supplier.id} • {supplier.type.toUpperCase()}</Typography>
                  <Box className='flex justify-center gap-2 mbs-2'>
                    <Chip label="API Partner" size='small' color='primary' variant='tonal' className='font-bold' />
                    <Chip label={supplier.status} size='small' color={supplier.status === 'Warning' ? 'warning' : 'success'} variant='tonal' className='font-bold' />
                  </Box>
                </Box>

                <Stack spacing={4} className='border-ts pts-6'>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='body2' className='font-bold text-slate-500'>Email tài chính</Typography>
                    <Typography variant='body2' className='font-black text-right'>{supplier.email}</Typography>
                  </Box>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='body2' className='font-bold text-slate-500'>Liên hệ kỹ thuật</Typography>
                    <Typography variant='body2' className='font-black'>{supplier.phone}</Typography>
                  </Box>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='body2' className='font-bold text-slate-500'>Đối tác từ</Typography>
                    <Typography variant='body2' className='font-black'>{supplier.joinDate}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid2>

        {/* Right Side: Metrics & Transactions */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Stack spacing={6}>
            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Card className={`border-none shadow-sm ${supplier.type === 'postpaid' ? 'bg-warning/5 border-warning/10' : 'bg-success/5 border-success/10'}`}>
                  <CardContent className='p-6'>
                    <Typography variant='caption' className={`font-bold uppercase text-[10px] ${supplier.type === 'postpaid' ? 'text-warning' : 'text-success'}`}>
                      {supplier.type === 'postpaid' ? 'Số dư nợ (Phải trả)' : 'Số dư ví khả dụng'}
                    </Typography>
                    <Typography variant='h3' className={`font-black ${supplier.type === 'postpaid' ? 'text-warning' : 'text-success'}`}>
                      ${supplier.balance.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Card className='border-none shadow-sm bg-slate-50'>
                  <CardContent className='p-6'>
                    <Typography variant='caption' className='font-bold text-slate-500 uppercase text-[10px]'>Hạn thanh toán kế tiếp</Typography>
                    <Typography variant='h3' className='font-black text-slate-800'>
                      {supplier.dueDate}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>

            <Card className='border-none shadow-sm overflow-hidden'>
              <Box className='p-5 border-be bg-slate-50/50 flex justify-between items-center'>
                <Typography variant='h6' className='font-black'>Lịch sử Giao dịch NCC</Typography>
                <Button variant='text' size='small' color='primary' className='font-black uppercase text-[11px]'>Tải PDF đối soát</Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead className='bg-slate-50'>
                    <TableRow>
                      <TableCell className='font-black uppercase text-[11px]'>Mã GD</TableCell>
                      <TableCell className='font-black uppercase text-[11px]'>Nội dung</TableCell>
                      <TableCell className='font-black uppercase text-[11px] text-right'>Số tiền</TableCell>
                      <TableCell className='font-black uppercase text-[11px] text-right'>Số dư sau GD</TableCell>
                      <TableCell className='font-black uppercase text-[11px] text-right text-slate-400'>Thời gian</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell>
                          <Typography variant='body2' className='font-black text-primary'>{tx.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box className='flex items-center gap-3'>
                            <Avatar variant='rounded' sx={{ width: 32, height: 32, bgcolor: tx.type === 'order_sync' ? 'primary.light' : 'success.light' }}>
                              <i className={`tabler-${tx.type === 'order_sync' ? 'refresh' : 'cash'} text-sm text-white`} />
                            </Avatar>
                            <Box>
                              <Typography variant='body2' className='font-bold'>{tx.description}</Typography>
                              <Typography variant='caption' className='text-slate-400 uppercase text-[10px]'>{tx.type}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Typography variant='body2' className={`font-black ${tx.amount > 0 ? 'text-warning' : 'text-success'}`}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Typography variant='body2' className='font-black'>${tx.balance.toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Typography variant='caption' className='font-bold text-slate-400'>{tx.date}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box className='p-4 text-center border-ts bg-slate-50/30'>
                <Button variant='text' size='small' className='font-black'>Xem tất cả lịch sử</Button>
              </Box>
            </Card>
          </Stack>
        </Grid2>
      </Grid2>
    </>
  )
}

export default SupplierDebtDetail
