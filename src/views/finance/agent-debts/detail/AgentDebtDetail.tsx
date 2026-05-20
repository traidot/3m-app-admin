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

const AgentDebtDetail = () => {
  const { id } = useParams()

  const agentsMock = [
    { id: 'a001', name: 'TravelConnect Solutions', code: 'TR', email: 'finance@travelconnect.com', phone: '+84 912 345 678', tier: 'PLATINUM', type: 'postpaid', balance: 5240.00, status: 'Active', joinDate: '2025-01-15' },
    { id: 'a002', name: 'Global eSIM Hub', code: 'GL', email: 'billing@global-esim.com', phone: '+84 988 777 666', tier: 'GOLD', type: 'prepaid', balance: 1120.50, status: 'Active', joinDate: '2025-02-10' },
    { id: 'a003', name: 'CheapData Agency', code: 'CH', email: 'support@cheapdata.vn', phone: '+84 909 111 222', tier: 'SILVER', type: 'prepaid', balance: 15.00, status: 'Active', joinDate: '2025-03-05' },
    { id: 'a004', name: 'Nomad Partner', code: 'NO', email: 'contact@nomadpartner.com', phone: '+84 933 444 555', tier: 'GOLD', type: 'postpaid', balance: 0.00, status: 'Active', joinDate: '2025-03-20' },
    { id: 'a005', name: 'Asia Roaming', code: 'AS', email: 'ops@asiaroaming.net', phone: '+84 977 888 999', tier: 'PLATINUM', type: 'postpaid', balance: 45000.00, status: 'Critical', joinDate: '2025-04-01' },
  ]

  const agent = agentsMock.find(a => a.id === id) || agentsMock[0]

  const transactions = [
    { id: 'TX-9901', type: 'order', description: 'Mua gói Singapore 10GB', amount: -12.50, balance: 5240.00, date: '2026-04-28 14:15:22' },
    { id: 'TX-9882', type: 'payment', description: 'Thanh toán công nợ kỳ T3/2026', amount: 15000.00, balance: 5252.50, date: '2026-04-25 10:30:00' },
    { id: 'TX-9875', type: 'order', description: 'Mua gói Thailand Unlimited', amount: -8.00, balance: 9752.50, date: '2026-04-24 16:12:05' },
    { id: 'TX-9860', type: 'charge', description: 'Nạp tiền ký quỹ (Deposit)', amount: 5000.00, balance: 9760.50, date: '2026-04-20 09:45:00' },
  ]

  return (
    <>
      <PageHeader
        title={agent.type === 'postpaid' ? `Quản lý Công nợ: ${agent.name}` : `Quản lý Ví: ${agent.name}`}
        description={agent.type === 'postpaid' ? "Theo dõi lịch sử đơn hàng và thanh toán công nợ định kỳ." : "Quản lý số dư ví, nạp tiền và chi tiêu từ ví đại lý."}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài chính' },
          { label: 'Công nợ Đại lý', href: '/finance/agent-debts' },
          { label: agent.name }
        ]}
        actions={
          <Stack direction='row' spacing={3}>
            {agent.type === 'postpaid' ? (
              <>
                <Button variant='tonal' color='secondary' startIcon={<i className='tabler-file-download' />}>Xuất sao kê</Button>
                <Button variant='contained' color='error' startIcon={<i className='tabler-receipt' />}>Thanh toán nợ</Button>
              </>
            ) : (
              <>
                <Button variant='tonal' color='secondary' startIcon={<i className='tabler-file-download' />}>Xuất báo cáo ví</Button>
                <Button variant='contained' color='success' startIcon={<i className='tabler-plus' />}>Nạp tiền vào ví</Button>
              </>
            )}
          </Stack>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Left Side: Agent Info */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack spacing={6}>
            <Card className='border-none shadow-sm overflow-hidden'>
              <Box className={`h-24 ${agent.type === 'postpaid' ? 'bg-warning/10' : 'bg-success/10'}`} />
              <CardContent className='relative pbs-0'>
                <Box className='flex justify-center -mbs-12 mbe-4'>
                  <Avatar 
                    variant='rounded' 
                    sx={{ width: 100, height: 100, fontSize: '40px', fontWeight: 900, bgcolor: agent.type === 'postpaid' ? 'warning.main' : 'success.main', border: '5px solid white', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)' }}
                  >
                    {agent.code}
                  </Avatar>
                </Box>
                <Box className='text-center mbe-6'>
                  <Typography variant='h5' className='font-black'>{agent.name}</Typography>
                  <Typography variant='caption' className='font-bold text-slate-500 uppercase text-[10px]'>ID: {agent.id} • {agent.type.toUpperCase()}</Typography>
                  <Box className='flex justify-center gap-2 mbs-2'>
                    <Chip label={agent.tier} size='small' color='primary' variant='tonal' className='font-bold' />
                    <Chip label={agent.status} size='small' color='success' variant='tonal' className='font-bold' />
                  </Box>
                </Box>

                <Stack spacing={4} className='border-ts pts-6'>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='body2' className='font-bold text-slate-500'>Email</Typography>
                    <Typography variant='body2' className='font-black text-right'>{agent.email}</Typography>
                  </Box>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='body2' className='font-bold text-slate-500'>Số điện thoại</Typography>
                    <Typography variant='body2' className='font-black'>{agent.phone}</Typography>
                  </Box>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='body2' className='font-bold text-slate-500'>Ngày gia nhập</Typography>
                    <Typography variant='body2' className='font-black'>{agent.joinDate}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid2>

        {/* Right Side: Key Metrics & Transactions */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Stack spacing={6}>
            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Card className={`border-none shadow-sm ${agent.type === 'postpaid' ? 'bg-error/5 border-error/10' : 'bg-success/5 border-success/10'}`}>
                  <CardContent className='p-6'>
                    <Typography variant='caption' className={`font-bold uppercase text-[10px] ${agent.type === 'postpaid' ? 'text-error' : 'text-success'}`}>
                      {agent.type === 'postpaid' ? 'Dư nợ hiện tại' : 'Số dư ví'}
                    </Typography>
                    <Typography variant='h3' className={`font-black ${agent.type === 'postpaid' ? 'text-error' : 'text-success'}`}>
                      ${agent.balance.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Card className='border-none shadow-sm bg-slate-50'>
                  <CardContent className='p-6'>
                    <Typography variant='caption' className='font-bold text-slate-500 uppercase text-[10px]'>Tổng chi tiêu (Tháng này)</Typography>
                    <Typography variant='h3' className='font-black text-slate-800'>
                      $12,450
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>

            <Card className='border-none shadow-sm overflow-hidden'>
              <Box className='p-5 border-be bg-slate-50/50 flex justify-between items-center'>
                <Typography variant='h6' className='font-black'>Lịch sử Biến động Tài chính</Typography>
                <Button variant='text' size='small' color='primary' className='font-black uppercase text-[11px]'>Tải Excel</Button>
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
                            <Avatar variant='rounded' sx={{ width: 32, height: 32, bgcolor: tx.type === 'order' ? 'error.light' : 'success.light' }}>
                              <i className={`tabler-${tx.type === 'order' ? 'shopping-cart' : 'plus'} text-sm text-white`} />
                            </Avatar>
                            <Box>
                              <Typography variant='body2' className='font-bold'>{tx.description}</Typography>
                              <Typography variant='caption' className='text-slate-400 uppercase text-[10px]'>{tx.type}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Typography variant='body2' className={`font-black ${tx.amount < 0 ? 'text-error' : 'text-success'}`}>
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

export default AgentDebtDetail
