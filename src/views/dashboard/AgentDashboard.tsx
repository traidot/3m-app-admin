'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'
import CardStatsSquare from '@/components/card-statistics/CardStatsSquare'

const AgentDashboard = () => {
  const stats = {
    activeESims: '42',
    totalOrders: '156',
    pendingActivations: '2'
  }

  return (
    <>
      <PageHeader
        title="Bảng điều khiển Đại lý: TravelConnect SG"
        description="Quản lý eSIM khách hàng và duyệt các gói cước kết nối toàn cầu mới nhất"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Đại lý', href: '/agent/dashboard' }, { label: 'Điều khiển' }]}
        actions={
          <Box className='flex gap-2'>
            <Button variant='contained' color='primary' component={Link} href='/agent/marketplace/store'>Vào cửa hàng</Button>
          </Box>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Account Overview */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-none shadow-sm bg-primary/5'>
            <CardContent>
              <Grid2 container spacing={6}>
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                  <CardStatsSquare
                    stats={stats.activeESims}
                    statsTitle="eSIM đang Hoạt động"
                    avatarIcon='tabler-device-mobile-check'
                    avatarColor='success'
                    avatarVariant='rounded'
                    avatarSize={56}
                    avatarSkin='light'
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                  <CardStatsSquare
                    stats={stats.totalOrders}
                    statsTitle="Tổng Đơn hàng"
                    avatarIcon='tabler-shopping-bag'
                    avatarColor='info'
                    avatarVariant='rounded'
                    avatarSize={56}
                    avatarSkin='light'
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                  <CardStatsSquare
                    stats={stats.pendingActivations}
                    statsTitle="QR chờ Kích hoạt"
                    avatarIcon='tabler-qrcode'
                    avatarColor='warning'
                    avatarVariant='rounded'
                    avatarSize={56}
                    avatarSkin='light'
                  />
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        {/* Recent Orders */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='h-full'>
            <CardHeader 
              title='Danh sách đơn hàng gần đây' 
              subheader='Theo dõi các lượt kích hoạt eSIM và phân phối cho khách hàng'
              action={<Button variant='text' size='small' component={Link} href='/agent/orders/my-orders'>Xem tất cả</Button>}
            />
            <CardContent className='p-0'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-slate-50 border-be'>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase'>Sản phẩm</th>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase'>Số tiền</th>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase'>Trạng thái</th>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase'>Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { product: 'Japan 10GB (30D)', amount: '$15.00', status: 'HOÀN TẤT', color: 'success' },
                    { product: 'Europe 5GB (15D)', amount: '$12.50', status: 'ĐANG XỬ LÝ', color: 'warning' },
                    { product: 'Global 1GB (7D)', amount: '$5.00', status: 'HOÀN TẤT', color: 'success' },
                    { product: 'USA 20GB (30D)', amount: '$25.00', status: 'HOÀN TẤT', color: 'success' }
                  ].map((o, i) => (
                    <tr key={i} className='border-be last:border-0 hover:bg-slate-50/50 transition-colors'>
                      <td className='p-4'>
                        <Typography variant='body2' className='font-bold'>{o.product}</Typography>
                      </td>
                      <td className='p-4 font-mono text-sm'>{o.amount}</td>
                      <td className='p-4'>
                        <Chip label={o.status} size='small' color={o.color as any} variant='tonal' className='font-black text-[10px]' />
                      </td>
                      <td className='p-4 text-xs text-slate-400'>Hôm nay</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid2>


      </Grid2>
    </>
  )
}

export default AgentDashboard
