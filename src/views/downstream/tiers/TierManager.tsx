'use client'

import Link from 'next/link'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

import PageHeader from '@/components/layout/shared/PageHeader'

const TierManager = () => {
  const tiers = [
    { 
      name: 'PLATINUM', 
      markup: '+5%', 
      creditLimit: '$50,000',
      minDeposit: '$5,000', 
      color: 'primary',
      description: 'Dành cho các đối tác chiến lược có sản lượng cực lớn.'
    },
    { 
      name: 'GOLD', 
      markup: '+10%', 
      creditLimit: '$10,000',
      minDeposit: '$1,000', 
      color: 'warning',
      description: 'Dành cho các đại lý hoạt động ổn định.'
    },
    { 
      name: 'SILVER', 
      markup: '+15%', 
      creditLimit: '$0',
      minDeposit: '$100', 
      color: 'secondary',
      description: 'Cấp bậc mặc định cho đại lý mới.'
    }
  ]

  return (
    <>
      <PageHeader
        title="Cấp bậc Đại lý (Agent Tiers)"
        description="Định nghĩa tỉ lệ nâng giá (markup) và các điều kiện tài chính theo cấp bậc đối tác"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân phối' }, { label: 'Cấp bậc' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-plus' />}>Tạo Cấp bậc</Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {tiers.map((t, i) => (
          <Grid2 key={i} size={{ xs: 12, md: 4 }}>
            <Card className='border-none shadow-sm relative overflow-hidden h-full'>
              <Box className={`absolute top-0 right-0 p-8 opacity-10 rotate-12 bg-${t.color}.main rounded-bl-full`} />
              <CardContent>
                <Box className='flex flex-col items-center text-center'>
                  <Box className={`w-12 h-12 rounded-xl bg-${t.color}/10 flex items-center justify-center mbe-4`}>
                    <i className={`tabler-trophy text-2xl text-${t.color}.main`} />
                  </Box>
                  <Typography variant='h5' className='font-black mbe-2'>{t.name}</Typography>
                  <Typography variant='body2' className='text-slate-500 mbe-6 h-[40px]'>{t.description}</Typography>
                  
                  <Divider className='w-full mbe-6 border-dashed' />
                  
                  <Stack spacing={4} className='w-full'>
                    <Box className='flex justify-between items-center'>
                      <Typography variant='body2' className='text-slate-500 font-bold'>Tỉ lệ nâng giá:</Typography>
                      <Typography variant='h6' className='font-black text-primary'>{t.markup}</Typography>
                    </Box>
                    <Box className='flex justify-between'>
                      <Typography variant='body2' className='text-slate-500'>Hạn mức nợ:</Typography>
                      <Typography variant='body2' className='font-black'>{t.creditLimit}</Typography>
                    </Box>
                    <Box className='flex justify-between'>
                      <Typography variant='body2' className='text-slate-500'>Ký quỹ tối thiểu:</Typography>
                      <Typography variant='body2' className='font-black'>{t.minDeposit}</Typography>
                    </Box>
                  </Stack>
                  <Button fullWidth variant='tonal' color={t.color as any} className='mt-8 font-black' component={Link} href={`/3m/downstream/tiers/${t.name.toLowerCase()}`}>Cấu hình chi tiết</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </>
  )
}

export default TierManager
