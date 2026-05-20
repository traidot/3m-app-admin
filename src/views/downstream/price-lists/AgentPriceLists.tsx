'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

import PageHeader from '@/components/layout/shared/PageHeader'

const AgentPriceLists = () => {
  const priceLists = [
    { name: 'Bảng giá Mùa hè 2026', agents: 12, products: 450, status: 'Đang áp dụng', color: 'primary' },
    { name: 'Ưu đãi TravelConnect', agents: 1, products: 120, status: 'Đang áp dụng', color: 'success' },
    { name: 'Bảng giá Đại lý Cấp 2', agents: 85, products: 450, status: 'Draft', color: 'secondary' }
  ]

  return (
    <>
      <PageHeader
        title="Quản lý Bảng giá (Rate Cards)"
        description="Tạo các bộ bảng giá tùy chỉnh và gán cho từng đại lý hoặc nhóm đại lý cụ thể"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân phối' }, { label: 'Bảng giá' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-plus' />}>Tạo Bảng giá mới</Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {priceLists.map((list, i) => (
          <Grid2 key={i} size={{ xs: 12, md: 4 }}>
            <Card className='border-none shadow-sm'>
              <CardContent>
                <Box className='flex justify-between items-start mbe-4'>
                  <Box className={`p-2 bg-${list.color}/10 rounded-lg`}>
                    <i className={`tabler-file-invoice text-2xl text-${list.color}.main`} />
                  </Box>
                  <Chip label={list.status} size='small' color={list.status === 'Draft' ? 'secondary' : 'success'} variant='tonal' />
                </Box>
                <Typography variant='h6' className='font-black mbe-2'>{list.name}</Typography>
                
                <Stack spacing={2} className='mbe-6'>
                  <Box className='flex justify-between'>
                    <Typography variant='body2' className='text-slate-500'>Đại lý áp dụng:</Typography>
                    <Typography variant='body2' className='font-bold'>{list.agents}</Typography>
                  </Box>
                  <Box className='flex justify-between'>
                    <Typography variant='body2' className='text-slate-500'>Số lượng sản phẩm:</Typography>
                    <Typography variant='body2' className='font-bold'>{list.products}</Typography>
                  </Box>
                </Stack>
                
                <Divider className='mbe-4' />
                
                <Box className='flex gap-2'>
                  <Button fullWidth variant='tonal' size='small'>Chỉnh sửa giá</Button>
                  <Button variant='tonal' size='small' className='min-is-0 px-2'><i className='tabler-users' /></Button>
                  <IconButton size='small' color='error'><i className='tabler-trash' /></IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </>
  )
}

export default AgentPriceLists
