'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

import PageHeader from '@/components/layout/shared/PageHeader'

const WalletsOverview = () => {
  return (
    <>
      <PageHeader
        title="Quản lý Ví & Số dư"
        description="Theo dõi tổng dòng tiền, nợ đại lý và thực hiện các lệnh nạp tiền thủ công"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài chính' }, { label: 'Quản lý Ví' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-plus' />}>Tạo lệnh Nạp tiền</Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Financial Stats */}
        {[
          { title: 'Tổng Số dư Đại lý', value: '$245,600.00', trend: '+12%', icon: 'tabler-wallet', color: 'primary' },
          { title: 'Doanh thu hôm nay', value: '$12,450.25', trend: '+5%', icon: 'tabler-chart-bar', color: 'success' },
          { title: 'Yêu cầu nạp chờ duyệt', value: '15', trend: 'Cần xử lý', icon: 'tabler-clock', color: 'warning' },
          { title: 'Tổng công nợ Supplier', value: '$84,200.00', trend: '-2%', icon: 'tabler-building-bank', color: 'error' }
        ].map((stat, i) => (
          <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className='border-none shadow-sm'>
              <CardContent>
                <Box className='flex justify-between items-start'>
                  <Box>
                    <Typography variant='caption' className='font-bold text-slate-500 uppercase'>{stat.title}</Typography>
                    <Typography variant='h5' className='font-black mt-1'>{stat.value}</Typography>
                  </Box>
                  <Box className={`p-2 bg-${stat.color}/10 rounded-lg`}>
                    <i className={`${stat.icon} text-xl text-${stat.color}.main`} />
                  </Box>
                </Box>
                <Typography variant='caption' color={stat.color === 'error' ? 'error' : 'success'} className='font-bold mt-2 block'>
                  {stat.trend}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}

        {/* Detailed Balances Table */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='p-0'>
              <Box className='p-4 flex justify-between items-center'>
                <Typography variant='h6' className='font-black'>Số dư theo Đại lý</Typography>
                <Button variant='tonal' size='small'>Xem tất cả</Button>
              </Box>
              <Divider />
              <Box className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='bg-slate-50 border-be'>
                      <th className='p-4 text-xs font-black text-slate-500 uppercase'>Đại lý</th>
                      <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Số dư khả dụng</th>
                      <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Đang đóng băng</th>
                      <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'TravelConnect', balance: '$5,240.00', frozen: '$120.00' },
                      { name: 'Global eSIM Hub', balance: '$1,120.50', frozen: '$0.00' }
                    ].map((row, i) => (
                      <tr key={i} className='border-be last:border-0'>
                        <td className='p-4'><Typography variant='body2' className='font-bold'>{row.name}</Typography></td>
                        <td className='p-4 text-right'><Typography variant='body2' className='font-black text-success'>{row.balance}</Typography></td>
                        <td className='p-4 text-right'><Typography variant='body2' className='text-slate-400'>{row.frozen}</Typography></td>
                        <td className='p-4 text-right'>
                          <Button size='small' variant='text'>Lịch sử</Button>
                          <Button size='small' variant='text'>Điều chỉnh</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default WalletsOverview
