'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Pagination from '@mui/material/Pagination'

import PageHeader from '@/components/layout/shared/PageHeader'

const LogsList = () => {
  const logs = [
    {
      id: 'l1',
      supplier: 'Airalo',
      action: 'Fetch Inventory',
      status: 'SUCCESS',
      timestamp: '2026-04-25 13:45:12',
      duration: '1.2s',
      color: 'success'
    },
    {
      id: 'l2',
      supplier: 'Nomad',
      action: 'Update Prices',
      status: 'SUCCESS',
      timestamp: '2026-04-25 13:40:05',
      duration: '0.8s',
      color: 'success'
    },
    {
      id: 'l3',
      supplier: 'GoMoWorld',
      action: 'Fetch Inventory',
      status: 'ERROR',
      timestamp: '2026-04-25 13:30:00',
      duration: '5.0s',
      message: '401 Unauthorized - Invalid API Key',
      color: 'error'
    },
    {
      id: 'l4',
      supplier: 'Airalo',
      action: 'Order Activation',
      status: 'SUCCESS',
      timestamp: '2026-04-25 13:25:55',
      duration: '2.5s',
      color: 'success'
    }
  ]

  return (
    <>
      <PageHeader
        title="Nhật ký Đồng bộ (Sync Logs)"
        description="Theo dõi và kiểm tra lịch sử tương tác API với các nhà cung cấp nguồn"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Nguồn cung' }, { label: 'Nhật ký đồng bộ' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-trash' />} color='error'>Xóa nhật ký cũ</Button>
        }
        className='mbe-6'
      />

      <Card className='border-none shadow-sm'>
        <CardContent>
          <Box className='flex justify-between items-center mbe-6'>
            <Typography variant='h6' className='font-black'>Lịch sử Hoạt động</Typography>
            <Box className='flex gap-2'>
              <Button variant='tonal' size='small' startIcon={<i className='tabler-filter' />}>Lọc</Button>
              <Button variant='tonal' size='small' startIcon={<i className='tabler-download' />}>Xuất CSV</Button>
            </Box>
          </Box>

          <Stack spacing={4}>
            {logs.map((log) => (
              <Box 
                key={log.id} 
                className='flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors'
              >
                <Box className='flex items-start gap-4'>
                  <Box className={`mt-1 w-2 h-2 rounded-full bg-${log.color}.main shadow-[0_0_8px] shadow-${log.color}.main/40`} />
                  <Box>
                    <Box className='flex items-center gap-2 mbe-1'>
                      <Typography variant='body2' className='font-black'>{log.supplier}</Typography>
                      <Typography variant='caption' className='text-slate-400'>•</Typography>
                      <Typography variant='body2' color='primary' className='font-bold'>{log.action}</Typography>
                    </Box>
                    <Typography variant='caption' className='text-slate-500 block mbe-1'>{log.timestamp} ({log.duration})</Typography>
                    {log.message && (
                      <Typography variant='caption' color='error' className='font-mono bg-error/5 p-1 rounded'>
                        {log.message}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Box className='flex items-center gap-3 mt-4 md:mt-0'>
                  <Chip 
                    label={log.status} 
                    size='small' 
                    color={log.color as any} 
                    variant='tonal'
                    className='font-black text-[10px]'
                  />
                  <Button variant='text' size='small' startIcon={<i className='tabler-eye' />}>Chi tiết JSON</Button>
                </Box>
              </Box>
            ))}
          </Stack>

          <Box className='flex justify-center mt-8'>
            <Pagination count={5} color='primary' variant='tonal' />
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default LogsList
