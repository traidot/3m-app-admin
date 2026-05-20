'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'

import PageHeader from '@/components/layout/shared/PageHeader'

const AgentDebtsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock Data - Removed creditLimit
  const agents = [
    { id: 'a001', name: 'TravelConnect Solutions', code: 'TR', tier: 'PLATINUM', tierColor: 'primary', balance: 5240.00, status: 'Active', type: 'postpaid' },
    { id: 'a002', name: 'Global eSIM Hub', code: 'GL', tier: 'GOLD', tierColor: 'warning', balance: 1120.50, status: 'Active', type: 'prepaid' },
    { id: 'a003', name: 'CheapData Agency', code: 'CH', tier: 'SILVER', tierColor: 'secondary', balance: 15.00, status: 'Active', type: 'prepaid' },
    { id: 'a004', name: 'Nomad Partner', code: 'NO', tier: 'GOLD', tierColor: 'warning', balance: 0.00, status: 'Active', type: 'postpaid' },
    { id: 'a005', name: 'Asia Roaming', code: 'AS', tier: 'PLATINUM', tierColor: 'primary', balance: 45000.00, status: 'Critical', type: 'postpaid' },
  ]

  const stats = [
    { title: 'Tổng phải thu', value: '$50,240', color: 'error', icon: 'tabler-trending-up', desc: 'Từ đại lý Công nợ' },
    { title: 'Tổng nạp ví', value: '$1,135', color: 'success', icon: 'tabler-wallet', desc: 'Từ đại lý Ví' },
    { title: 'Đại lý quá hạn', value: '2', color: 'warning', icon: 'tabler-alert-triangle', desc: 'Cần nhắc nợ' },
    { title: 'Kỳ đối soát', value: 'Tháng 04/2026', color: 'info', icon: 'tabler-calendar', desc: 'Đang mở' },
  ]

  return (
    <>
      <PageHeader
        title="Công nợ & Ví Đại lý"
        description="Quản lý biến động số dư, công nợ phải thu và lịch sử thanh toán của toàn bộ hệ thống đại lý."
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài chính' }, { label: 'Công nợ Đại lý' }]}
        className='mbe-6'
      />

      <Grid2 container spacing={6} className='mbe-6'>
        {stats.map((stat, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className='border-none shadow-sm'>
              <CardContent className='flex items-center gap-4'>
                <Avatar variant='rounded' sx={{ bgcolor: `${stat.color}.main`, width: 44, height: 44 }}>
                  <i className={`${stat.icon} text-xl`} />
                </Avatar>
                <Box>
                  <Typography variant='h4' className='font-black'>{stat.value}</Typography>
                  <Typography variant='caption' className='text-slate-500 font-bold uppercase text-[10px]'>{stat.title}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Card className='border-none shadow-sm'>
        <Box className='p-6 border-be'>
          <Grid2 container spacing={4} alignItems='center'>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <TextField 
                fullWidth 
                size='small' 
                placeholder='Tìm kiếm đại lý (Tên, Mã, Email...)' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-search text-slate-400' />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField 
                select 
                fullWidth 
                size='small' 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                <MenuItem value='active'>Hoạt động</MenuItem>
                <MenuItem value='critical'>Cần chú ý</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Đại lý</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Mô hình</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Số Dư / Nợ</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Trạng thái</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id} hover>
                  <TableCell>
                    <Box className='flex items-center gap-3'>
                      <Avatar variant='rounded' className={`bg-${agent.tierColor}/10 text-${agent.tierColor} font-black`}>
                        {agent.code}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' className='font-black'>{agent.name}</Typography>
                        <Typography variant='caption' className='text-slate-400'>ID: {agent.id.toUpperCase()}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={agent.type === 'prepaid' ? 'Ví' : 'Công nợ'} 
                      color={agent.type === 'prepaid' ? 'success' : 'primary'} 
                      size='small' 
                      variant='tonal' 
                      className='font-bold' 
                    />
                    <Typography variant='caption' className='block mt-1 text-slate-400'>{agent.tier}</Typography>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='subtitle2' className={`font-black ${agent.type === 'postpaid' && agent.balance > 10000 ? 'text-error' : agent.type === 'prepaid' ? 'text-success' : ''}`}>
                      {agent.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </Typography>
                    <Typography variant='caption' className='text-slate-400'>
                      {agent.type === 'prepaid' ? 'Tiền sẵn có' : 'Khoản phải thu'}
                    </Typography>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Chip 
                      label={agent.status} 
                      color={agent.status === 'Critical' ? 'error' : agent.status === 'Warning' ? 'warning' : 'success'} 
                      size='small' 
                      variant='tonal' 
                    />
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button 
                      size='small' 
                      variant='tonal' 
                      color='primary' 
                      component={Link} 
                      href={`/3m/finance/agent-debts/${agent.id}`}
                      startIcon={<i className='tabler-eye' />}
                      className='font-black'
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className='p-4 border-ts flex justify-center'>
          <Button variant='text' size='small' className='font-black'>Tải thêm dữ liệu</Button>
        </Box>
      </Card>
    </>
  )
}

export default AgentDebtsList
