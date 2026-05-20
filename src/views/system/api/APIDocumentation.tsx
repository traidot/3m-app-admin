'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

import PageHeader from '@/components/layout/shared/PageHeader'

const APIDocumentation = () => {
  return (
    <>
      <PageHeader
        title="Tài liệu API cho Đại lý"
        description="Hướng dẫn tích hợp hệ thống eSIM Market vào website hoặc ứng dụng của bạn"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Hệ thống' }, { label: 'Tài liệu API' }]}
        className='mbe-6'
      />

      <Stack spacing={6}>
        <Card className='border-none shadow-sm'>
          <CardContent>
            <Typography variant='h6' className='font-black mbe-2'>Xác thực (Authentication)</Typography>
            <Typography variant='body2' className='text-slate-500 mbe-4'>Tất cả các yêu cầu API phải bao gồm Header `Authorization: Bearer YOUR_API_KEY`</Typography>
            <Box className='p-4 bg-slate-900 rounded-lg'>
              <Typography variant='caption' className='text-emerald-400 font-mono'>
                curl -X GET "https://api.esim.market/v1/products" \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer sk_live_xxxxxxxx"
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card className='border-none shadow-sm'>
          <CardContent>
            <Typography variant='h6' className='font-black mbe-4'>Các Endpoint chính</Typography>
            <Stack spacing={4} divider={<Divider />}>
              {[
                { method: 'GET', path: '/v1/products', desc: 'Lấy danh sách sản phẩm và giá đại lý' },
                { method: 'POST', path: '/v1/orders', desc: 'Tạo đơn hàng mới' },
                { method: 'GET', path: '/v1/orders/{id}', desc: 'Kiểm tra trạng thái đơn hàng' }
              ].map((api, i) => (
                <Box key={i} className='flex items-center justify-between'>
                  <Box className='flex items-center gap-4'>
                    <Chip label={api.method} size='small' color={api.method === 'GET' ? 'success' : 'primary'} className='font-black' />
                    <Typography variant='body2' className='font-mono font-bold'>{api.path}</Typography>
                  </Box>
                  <Typography variant='body2' className='text-slate-500'>{api.desc}</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  )
}

export default APIDocumentation
