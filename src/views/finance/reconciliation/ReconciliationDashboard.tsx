'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import PageHeader from '@/components/layout/shared/PageHeader'

const ReconciliationDashboard = () => {
  return (
    <>
      <PageHeader
        title="Đối soát Dữ liệu (Reconciliation)"
        description="Kiểm tra sự sai lệch giữa số liệu hệ thống và báo cáo từ các nhà cung cấp nguồn"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài chính' }, { label: 'Đối soát' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-upload' />}>Tải lên Báo cáo Supplier</Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12 }}>
          <Alert severity="warning" variant="standard" className='mbe-6'>
            <AlertTitle className='font-black'>Phát hiện sai lệch!</AlertTitle>
            Có 2 giao dịch từ **Airalo** không khớp với đơn hàng trên hệ thống. Vui lòng kiểm tra lại.
          </Alert>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card className='border-none shadow-sm'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4'>Trạng thái Đối soát Tháng 04/2026</Typography>
              <Stack spacing={4}>
                {[
                  { name: 'Airalo Global', status: 'Cần xử lý', color: 'warning', diff: '-$25.00' },
                  { name: 'Nomad API', status: 'Khớp 100%', color: 'success', diff: '$0.00' },
                  { name: 'GoMoWorld', status: 'Chưa đối soát', color: 'secondary', diff: 'N/A' }
                ].map((row, i) => (
                  <Box key={i} className='flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100'>
                    <Box className='flex items-center gap-3'>
                      <Box className={`w-2 h-2 rounded-full bg-${row.color}.main`} />
                      <Typography variant='body2' className='font-bold'>{row.name}</Typography>
                    </Box>
                    <Box className='flex items-center gap-8'>
                      <Typography variant='body2' className={`font-black ${row.color === 'warning' ? 'text-error' : 'text-slate-400'}`}>
                        {row.diff}
                      </Typography>
                      <Button variant='tonal' size='small' color={row.color as any}>{row.status}</Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4'>Thống kê nhanh</Typography>
              <Stack spacing={4}>
                <Box>
                  <Typography variant='caption' className='text-slate-400 uppercase font-bold'>Tổng giá trị đơn hàng</Typography>
                  <Typography variant='h5' className='font-black'>$124,500.00</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' className='text-slate-400 uppercase font-bold'>Tổng phí Supplier</Typography>
                  <Typography variant='h5' className='font-black'>$102,120.00</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' className='text-slate-400 uppercase font-bold'>Lợi nhuận gộp</Typography>
                  <Typography variant='h5' className='font-black text-success'>$22,380.00</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default ReconciliationDashboard
