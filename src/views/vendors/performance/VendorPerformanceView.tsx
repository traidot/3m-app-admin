'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Rating from '@mui/material/Rating'
import LinearProgress from '@mui/material/LinearProgress'

import PageHeader from '@/components/layout/shared/PageHeader'

const VendorPerformanceView = () => {
  const vendors = [
    { name: 'Tech Solutions Inc', category: 'Electronics', onTime: 98, quality: 4.8, priceRating: 4.2, leadTime: '3 Days' },
    { name: 'Furniture Co', category: 'Furniture', onTime: 85, quality: 4.2, priceRating: 4.5, leadTime: '12 Days' },
    { name: 'Office Depot', category: 'Consumables', onTime: 95, quality: 4.9, priceRating: 3.8, leadTime: '2 Days' },
    { name: 'Global Logistics', category: 'Logistics', onTime: 92, quality: 4.5, priceRating: 4.0, leadTime: '5 Days' }
  ]

  return (
    <>
      <PageHeader
        title='Vendor Performance Analytics'
        description='Evaluate and compare supplier reliability, quality scores, and pricing competitiveness'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Supplier Hub' }, { label: 'Performance' }]}
      />

      <Grid2 container spacing={6} className='mt-6'>
        {vendors.map((vendor, index) => (
          <Grid2 size={{ xs: 12, lg: 6 }} key={index}>
            <Card>
              <CardContent className='flex flex-col gap-6'>
                <Box className='flex items-center justify-between'>
                  <Box className='flex items-center gap-3'>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold' }}>{vendor.name[0]}</Avatar>
                    <Box>
                        <Typography variant='h6' className='font-bold'>{vendor.name}</Typography>
                        <Typography variant='caption'>{vendor.category}</Typography>
                    </Box>
                  </Box>
                  <Chip label='Preferred' color='success' size='small' variant='tonal' />
                </Box>

                <Grid2 container spacing={4}>
                   <Grid2 size={{ xs: 12, md: 4 }}>
                      <Box className='flex flex-col gap-2'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>On-Time Delivery</Typography>
                        <Typography variant='h5' className='font-bold text-primary'>{vendor.onTime}%</Typography>
                        <LinearProgress variant="determinate" value={vendor.onTime} color={vendor.onTime > 90 ? 'success' : 'warning'} />
                      </Box>
                   </Grid2>
                   
                   <Grid2 size={{ xs: 12, md: 4 }}>
                      <Box className='flex flex-col gap-2'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Quality Rating</Typography>
                        <Box className='flex items-center gap-2'>
                           <Typography variant='h5' className='font-bold text-success'>{vendor.quality}</Typography>
                           <Rating value={vendor.quality} precision={0.1} size='small' readOnly />
                        </Box>
                      </Box>
                   </Grid2>

                   <Grid2 size={{ xs: 12, md: 4 }}>
                      <Box className='flex flex-col gap-2'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Avg. Lead Time</Typography>
                        <Typography variant='h5' className='font-bold text-secondary'>{vendor.leadTime}</Typography>
                      </Box>
                   </Grid2>
                </Grid2>

                <Box className='p-4 bg-slate-50 border rounded'>
                   <Typography variant='caption' className='uppercase font-bold text-slate-500 block mb-2'>Pricing Competitiveness</Typography>
                   <Rating value={vendor.priceRating} precision={0.5} readOnly />
                   <Typography variant='body2' className='text-slate-600 mt-2 italic'>
                     "Highly reliable for critical projects. Slight premium on pricing but offset by zero-defect track record."
                   </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </>
  )
}

export default VendorPerformanceView
