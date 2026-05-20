'use client'

import { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'
import dynamic from 'next/dynamic'
import type { ApexOptions } from 'apexcharts'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

import PageHeader from '@/components/layout/shared/PageHeader'

const AppReactApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const PriceTrendsView = () => {
  const chartOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    stroke: { curve: 'stepline', width: 2 },
    colors: ['#7367f0', '#28c76f', '#ff9f43'],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    markers: { size: 5 },
    grid: { borderColor: '#f1f5f9' },
    yaxis: { title: { text: 'Price per Unit (USD)' } }
  }), [])

  const series = [
    { name: 'Tech Solutions Inc', data: [8200, 8200, 8500, 8500, 8400, 8400] },
    { name: 'Global Tech Distro', data: [8400, 8300, 8300, 8600, 8600, 8550] }
  ]

  return (
    <>
      <PageHeader
        title='Strategic Market Price Trends'
        description='Benchmark vendor pricing fluctuations and analyze market procurement cost indices'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI & Market Intelligence' }, { label: 'Market Price Trends' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-trending-up' />}>Compare Market Indices</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12 }}>
            <Card>
               <CardContent className='flex flex-wrap gap-6 items-end p-6 border-be bg-slate-50/50'>
                  <Box className='flex flex-col gap-1.5'>
                     <Typography variant='caption' className='uppercase font-bold text-slate-500'>Material Selection</Typography>
                     <TextField select size='small' defaultValue='dell' sx={{ width: 280 }}>
                        <MenuItem value='dell'>Dell PowerEdge R750 (Server)</MenuItem>
                        <MenuItem value='cisco'>Cisco 9300 Switch</MenuItem>
                        <MenuItem value='steel'>Steel Construction Grade A</MenuItem>
                     </TextField>
                  </Box>
                  <Box className='flex flex-col gap-1.5'>
                     <Typography variant='caption' className='uppercase font-bold text-slate-500'>Timeframe</Typography>
                     <TextField select size='small' defaultValue='6m' sx={{ width: 150 }}>
                        <MenuItem value='3m'>Last 3 Months</MenuItem>
                        <MenuItem value='6m'>Last 6 Months</MenuItem>
                        <MenuItem value='12m'>Last Year</MenuItem>
                     </TextField>
                  </Box>
                  <Box className='flex-grow' />
                  <Box className='flex gap-4 pb-2'>
                     <Box className='text-right'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-400'>Current Avg. Price</Typography>
                        <Typography variant='h6' className='font-black'>$8,475.00</Typography>
                     </Box>
                     <Box className='text-right'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-400'>Volatility Index</Typography>
                        <Typography variant='h6' className='font-black text-warning'>High (4.2%)</Typography>
                     </Box>
                  </Box>
               </CardContent>
               <CardContent>
                  <AppReactApexCharts type='line' height={400} options={chartOptions} series={series} />
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12, md: 4 }}>
           <Card className='border-l-4 border-l-success'>
              <CardContent className='flex items-center gap-4'>
                 <Box className='bg-success/10 text-success p-3 rounded'>
                    <i className='tabler-trending-down text-2xl' />
                 </Box>
                 <Box>
                    <Typography variant='body2' className='font-bold text-slate-800'>Price Savings Opportunity</Typography>
                    <Typography variant='caption' className='text-slate-500'>Market trend indicates a potential 5% drop next month. Consider delayed procurement for non-critical units.</Typography>
                 </Box>
              </CardContent>
           </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default PriceTrendsView
