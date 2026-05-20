'use client'

import { useState } from 'react'
import Link from 'next/link'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierDetail = ({ id }: { id: string }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  // Giả lập dữ liệu cho demo
  const supplier = {
    id,
    name: id.toUpperCase() === 'AIRALO' ? 'Airalo Global' : 'Nomad API',
    logo: id.toUpperCase() === 'AIRALO' ? 'A' : 'N',
    color: id.toUpperCase() === 'AIRALO' ? 'primary.main' : 'info.main',
    status: 'Connected',
    type: id.toUpperCase() === 'AIRALO' ? 'postpaid' : 'prepaid',
    balance: id.toUpperCase() === 'AIRALO' ? 3150.20 : 5000.00,
    limit: 10000,
    ordersThisMonth: 850,
    successRate: 99.2
  }

  const quotaPercent = (supplier.balance / supplier.limit) * 100



  const quickLinks = [
    { title: 'Cấu hình API', desc: 'Thông số kỹ thuật & Keys', icon: 'tabler-settings-automation', href: `/3m/upstream/suppliers/${id}/config`, color: 'info' },
    { title: 'Đối soát Giao dịch', desc: 'Nhật ký mua hàng & nợ', icon: 'tabler-receipt-2', href: `/3m/upstream/transactions?supplier=${id}`, color: 'success' }
  ]

  return (
    <>
      <PageHeader
        title={`Dashboard: ${supplier.name}`}
        description="Quản lý hiệu năng, công nợ và cảnh báo hệ thống Upstream"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Nguồn cung', href: '/3m/upstream/suppliers' }, { label: supplier.name }]}

        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* TOP KPI CARDS */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent className='p-6'>
              <Box className='flex justify-between items-start mbe-2'>
                <Typography variant='subtitle2' className='font-black uppercase text-slate-500'>Sản phẩm</Typography>
                <Avatar variant='rounded' className='bg-info/10 text-info w-8 h-8'>
                  <i className='tabler-packages text-lg' />
                </Avatar>
              </Box>
              <Typography variant='h4' className='font-black mbe-1'>450</Typography>
              <Typography variant='caption' className='text-success font-bold'>+12 gói mới tháng này</Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent className='p-6'>
              <Box className='flex justify-between items-start mbe-2'>
                <Typography variant='subtitle2' className='font-black uppercase text-slate-500'>Đơn hàng (Tháng)</Typography>
                <Avatar variant='rounded' className='bg-success/10 text-success w-8 h-8'>
                  <i className='tabler-shopping-cart text-lg' />
                </Avatar>
              </Box>
              <Typography variant='h4' className='font-black mbe-1'>{supplier.ordersThisMonth}</Typography>
              <Typography variant='caption' className='text-slate-500'>Avg. 28 đơn/ngày</Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent className='p-6'>
              <Box className='flex justify-between items-start mbe-2'>
                <Typography variant='subtitle2' className='font-black uppercase text-slate-500'>Tỷ lệ thành công</Typography>
                <Avatar variant='rounded' className='bg-warning/10 text-warning w-8 h-8'>
                  <i className='tabler-chart-bar text-lg' />
                </Avatar>
              </Box>
              <Typography variant='h4' className='font-black mbe-1'>{supplier.successRate}%</Typography>
              <Box className='flex items-center gap-1'>
                <Box className='w-2 h-2 rounded-full bg-success animate-pulse' />
                <Typography variant='caption' className='text-success font-bold'>API: Connected</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* QUICK NAVIGATION */}
        <Grid2 size={{ xs: 12 }}>
          <Typography variant='h5' className='font-black mbe-4'>Điều hướng nhanh</Typography>
          <Grid2 container spacing={4}>
            {quickLinks.map((link) => (
              <Grid2 key={link.title} size={{ xs: 12, md: 4 }}>
                <Card 
                  component={Link} 
                  href={link.href}
                  className='border-none shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-primary/20'
                >
                  <CardContent className='flex items-center gap-4 p-4'>
                    <Avatar variant='rounded' sx={{ bgcolor: `${link.color}.main`, width: 44, height: 44 }}>
                      <i className={`${link.icon} text-xl`} />
                    </Avatar>
                    <Box>
                      <Typography variant='body1' className='font-black'>{link.title}</Typography>
                      <Typography variant='caption' className='text-slate-500'>{link.desc}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  )
}

export default SupplierDetail
