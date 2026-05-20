'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { useRole } from '@/contexts/RoleContext'

const DashboardSelectionPage = () => {
  const router = useRouter()
  const { setRole } = useRole()

  const handleSelectRole = (role: 'admin' | 'agent') => {
    setRole(role)
    if (role === 'admin') {
      router.push('/3m/dashboard')
    } else {
      router.push('/agent/dashboard')
    }
  }

  return (
    <Box 
      className='flex items-center justify-center min-bs-[100dvh] p-6'
      sx={{ backgroundColor: 'var(--mui-palette-background-default)' }}
    >
      <Box className='max-is-[900px] w-full'>
        <Box className='text-center mbe-12'>
          <Typography variant='h3' className='font-black mbe-2' sx={{ color: 'text.primary' }}>
            Hệ thống Quản lý eSIM
          </Typography>
          <Typography variant='h6' sx={{ color: 'text.secondary' }}>
            Vui lòng chọn môi trường làm việc của bạn
          </Typography>
        </Box>

        <Grid2 container spacing={8}>
          {/* Admin Card */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card 
              className='cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl border-none shadow-xl group overflow-hidden'
              onClick={() => handleSelectRole('admin')}
              sx={{ borderRadius: '20px' }}
            >
              <Box className='h-3 bg-primary transition-all group-hover:h-4' />
              <CardContent className='p-10 flex flex-col items-center text-center'>
                <Avatar 
                  variant='rounded' 
                  className='bg-primary/10 text-primary bs-[100px] is-[100px] mbe-6'
                  sx={{ borderRadius: '16px' }}
                >
                  <i className='tabler-user-shield text-[50px]' />
                </Avatar>
                <Typography variant='h4' className='font-black mbe-3'>Quản trị (3M Admin)</Typography>
                <Typography variant='body1' sx={{ color: 'text.secondary' }} className='mbe-8 min-bs-[60px]'>
                  Dành cho quản trị viên hệ thống. Quản lý danh mục eSIM, nhà cung cấp, đại lý và tài chính tổng hợp.
                </Typography>
                <Box className='flex items-center gap-2 text-primary font-bold text-lg'>
                  <span>Truy cập Quản trị</span>
                  <i className='tabler-arrow-right' />
                </Box>
              </CardContent>
            </Card>
          </Grid2>

          {/* Agent Card */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card 
              className='cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl border-none shadow-xl group overflow-hidden'
              onClick={() => handleSelectRole('agent')}
              sx={{ borderRadius: '20px' }}
            >
              <Box className='h-3 bg-info transition-all group-hover:h-4' />
              <CardContent className='p-10 flex flex-col items-center text-center'>
                <Avatar 
                  variant='rounded' 
                  className='bg-info/10 text-info bs-[100px] is-[100px] mbe-6'
                  sx={{ borderRadius: '16px' }}
                >
                  <i className='tabler-users text-[50px]' />
                </Avatar>
                <Typography variant='h4' className='font-black mbe-3'>Kênh Đại lý (Agent)</Typography>
                <Typography variant='body1' sx={{ color: 'text.secondary' }} className='mbe-8 min-bs-[60px]'>
                  Dành cho đối tác phân phối. Tìm mua eSIM, quản lý đơn hàng và theo dõi công nợ cá nhân.
                </Typography>
                <Box className='flex items-center gap-2 text-info font-bold text-lg'>
                  <span>Truy cập Đại lý</span>
                  <i className='tabler-arrow-right' />
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        <Box className='text-center mts-16'>
          <Typography variant='body2' sx={{ color: 'text.disabled' }} className='font-medium'>
            © 2024 eSIM Market Ecosystem. Powered by DeepSync Technology.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardSelectionPage
