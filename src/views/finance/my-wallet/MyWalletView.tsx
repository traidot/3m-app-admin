'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

import PageHeader from '@/components/layout/shared/PageHeader'

const MyWalletView = () => {
  return (
    <>
      <PageHeader
        title="Ví của tôi"
        description="Quản lý số dư đại lý, nạp tiền và theo dõi chi tiêu cá nhân"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài chính' }, { label: 'Ví của tôi' }]}
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm bg-primary text-white'>
            <CardContent>
              <Box className='flex justify-between items-center mbe-4'>
                <Typography variant='body2' className='text-white/80 font-bold uppercase'>Số dư hiện tại</Typography>
                <i className='tabler-wallet text-2xl text-white/50' />
              </Box>
              <Typography variant='h3' className='font-black text-white'>$1,240.50</Typography>
              <Box className='flex gap-2 mt-8'>
                <Button fullWidth variant='contained' color='inherit' className='bg-white text-primary font-black' startIcon={<i className='tabler-plus' />}>Nạp tiền</Button>
                <Button fullWidth variant='outlined' color='inherit' className='border-white text-white font-black' startIcon={<i className='tabler-file-download' />}>Sao kê</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4'>Lịch sử Biến động Gần đây</Typography>
              <Stack spacing={4}>
                {[
                  { desc: 'Mua gói eSIM Nhật Bản 10GB', amount: '-$12.50', date: 'Hôm nay, 14:20', type: 'Purchase' },
                  { desc: 'Nạp tiền qua Chuyển khoản', amount: '+$500.00', date: '24/04/2026, 10:15', type: 'Top-up' },
                  { desc: 'Mua gói eSIM Châu Âu 5GB', amount: '-$9.00', date: '23/04/2026, 09:30', type: 'Purchase' }
                ].map((row, i) => (
                  <Box key={i} className='flex items-center justify-between'>
                    <Box className='flex items-center gap-3'>
                      <Box className={`w-10 h-10 rounded-lg flex items-center justify-center ${row.type === 'Top-up' ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-500'}`}>
                        <i className={row.type === 'Top-up' ? 'tabler-arrow-up-right' : 'tabler-shopping-cart'} />
                      </Box>
                      <Box>
                        <Typography variant='body2' className='font-bold'>{row.desc}</Typography>
                        <Typography variant='caption' className='text-slate-400'>{row.date}</Typography>
                      </Box>
                    </Box>
                    <Typography variant='body2' className={`font-black ${row.amount.startsWith('+') ? 'text-success' : 'text-slate-700'}`}>
                      {row.amount}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default MyWalletView
