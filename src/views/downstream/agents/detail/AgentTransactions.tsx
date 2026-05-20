'use client'

import { useState } from 'react'
import Link from 'next/link'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'

import PageHeader from '@/components/layout/shared/PageHeader'

const AgentTransactions = ({ id }: { id: string }) => {
  const agentName = id.toUpperCase() === 'A001' ? 'TravelConnect Solutions' : 'Global eSIM Hub'

  const transactions = [
    { id: 'ORD-99812', date: '2026-04-28 09:15', type: 'Mua hàng', method: 'API', product: '10GB 7 Ngày', sku: 'JP-10GB-7D', qty: 1, amount: 45.50, debtAfter: 6240.00, status: 'Success' },
    { id: 'ORD-99810', date: '2026-04-27 18:20', type: 'Mua hàng', method: 'Portal', product: 'Không Giới Hạn 15 Ngày', sku: 'JP-UNL-15D', qty: 2, amount: 15.00, debtAfter: 6194.50, status: 'Success' },
    { id: 'CNL-00012', date: '2026-04-24 11:30', type: 'Hủy đơn', method: 'System', product: '5GB 10 Ngày', sku: 'US-5GB-10D', qty: 1, amount: -15.00, debtAfter: 6179.50, status: 'Success' },
    { id: 'ORD-99700', date: '2026-04-24 08:45', type: 'Mua hàng', method: 'API', product: '50GB 10 Ngày', sku: 'TH-50GB-10D', qty: 5, amount: 120.00, debtAfter: 6194.50, status: 'Success' },
    { id: 'ORD-99699', date: '2026-04-23 14:00', type: 'Mua hàng', method: 'API', product: '10GB 30 Ngày', sku: 'EU-10GB-30D', qty: 1, amount: 10.00, debtAfter: 6074.50, status: 'Success' },
  ]

  return (
    <>
      <PageHeader
        title={`Nhật ký Giao dịch: ${agentName}`}
        description="Lịch sử chi tiết các giao dịch mua hàng và hủy đơn của đại lý."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' }, 
          { label: 'Đại lý', href: '/3m/downstream/agents' }, 
          { label: agentName, href: `/3m/downstream/agents/${id}` },
          { label: 'Nhật ký' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button variant='tonal' color='secondary' component={Link} href={`/3m/downstream/agents/${id}`}>Quay lại</Button>
            <Button variant='contained' color='primary' startIcon={<i className='tabler-download' />}>Xuất Excel</Button>
          </Stack>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6} className='mbe-6'>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='p-6'>
              <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Tổng đơn hàng (Tháng)</Typography>
              <Typography variant='h4' className='font-black text-primary'>1,240</Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='p-6'>
              <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Tổng tiền mua (Tháng)</Typography>
              <Typography variant='h4' className='font-black text-error'>$4,250.50</Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='p-6'>
              <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Đã hủy / Hoàn tiền (Tháng)</Typography>
              <Typography variant='h4' className='font-black text-success'>-$120.00</Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Card className='border-none shadow-sm'>
        <Box className='p-6 border-be'>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField 
                fullWidth 
                placeholder='Tìm mã giao dịch/đơn hàng...' 
                size='small'
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Loại giao dịch'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='purchase'>Mua hàng</MenuItem>
                <MenuItem value='cancel'>Hủy đơn</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField fullWidth type='date' size='small' label='Từ ngày' InputLabelProps={{ shrink: true }} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField fullWidth type='date' size='small' label='Đến ngày' InputLabelProps={{ shrink: true }} />
            </Grid2>
          </Grid2>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Mã GD / Thời gian</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Sản phẩm (eSIM)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>SL</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Loại GD</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Phát sinh</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Công nợ cuối</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>
                    <Typography variant='body2' className='font-bold text-primary'>{tx.id}</Typography>
                    <Typography variant='caption' className='text-slate-400'>{tx.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' className='font-black'>{tx.product}</Typography>
                    <Typography variant='caption' className='text-slate-500'>{tx.sku}</Typography>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Typography variant='body2' className='font-black'>{tx.qty}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box className='flex flex-col'>
                      <Typography variant='body2' className='font-bold'>{tx.type}</Typography>
                      <Typography variant='caption' className='text-slate-500'>{tx.method}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='body2' className={`font-black ${tx.amount > 0 ? 'text-error' : 'text-success'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </Typography>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='body2' className='font-bold'>{tx.debtAfter.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Typography>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Chip label={tx.status} color='success' size='small' variant='tonal' className='font-bold' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
}

export default AgentTransactions
