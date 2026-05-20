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

import PageHeader from '@/components/layout/shared/PageHeader'

const AppReactApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const ForecastingView = () => {
  const [isCalculating, setIsCalculating] = useState(false)

  const handleRecalculate = () => {
    setIsCalculating(true)
    setTimeout(() => setIsCalculating(false), 2000)
  }

  const chartOptions: ApexOptions = useMemo(() => ({
    chart: { 
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: { curve: 'smooth', width: [3, 3], dashArray: [0, 8] },
    colors: ['#7367f0', '#94a3b8'],
    xaxis: { categories: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] },
    legend: { position: 'top', horizontalAlign: 'right' },
    markers: { size: 4 },
    grid: { borderColor: '#f1f5f9' }
  }), [])

  const series = [
    { name: 'Historical Consumption (Units)', data: [450, 520, 480, 0, 0, 0] },
    { name: 'AI Predicted Demand', data: [450, 520, 480, 610, 590, 720] }
  ]

  return (
    <>
      <PageHeader
        title='Demand Forecasting Intelligence'
        description='Predictive analytics and material requirement planning using historical procurement data'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI & Market Intelligence' }, { label: 'Demand Forecasting' }]}
        actions={
          <Button 
            variant='tonal' 
            color='secondary' 
            startIcon={isCalculating ? <i className='tabler-loader animate-spin' /> : <i className='tabler-refresh' />}
            onClick={handleRecalculate}
            disabled={isCalculating}
          >
            {isCalculating ? 'Computing Models...' : 'Re-calculate Predictive Models'}
          </Button>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12, md: 8 }}>
            <Card>
               <CardContent>
                  <Box className='flex justify-between items-center mb-6'>
                     <Box>
                        <Typography variant='h6' className='font-bold'>Prediction Matrix: Q3/Q4 FY2026</Typography>
                        <Typography variant='caption' className='text-slate-500'>Based on 24 months of historical procurement cycles</Typography>
                     </Box>
                     <Chip label='Confidence: 94.2%' color='success' variant='tonal' className='font-black' />
                  </Box>
                  <AppReactApexCharts type='line' height={350} options={chartOptions} series={series} />
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12, md: 4 }}>
            <Card className='h-full border-t-4 border-t-primary'>
               <CardContent>
                  <Typography variant='h6' className='font-bold mb-6'>Sourcing Recommendations</Typography>
                  <Box className='flex flex-col gap-5'>
                     {[
                        { item: 'Dell PowerEdge R750', action: 'Pre-order +15 units', reason: 'Anticipated Q4 peak', color: 'info' },
                        { item: 'Office Furniture Set', action: 'Reduce safety stock', reason: 'Downward trend predicted', color: 'warning' },
                        { item: 'Steel Sheets (Bulk)', action: 'Lock price now', reason: 'Market fluctuation alert', color: 'error' }
                     ].map((rec, i) => (
                        <Box key={i} className='p-4 rounded bg-slate-50 border relative overflow-hidden'>
                           <Box className={`absolute left-0 top-0 bottom-0 w-1 bg-${rec.color}.main`} />
                           <Typography variant='body2' className='font-bold text-slate-800'>{rec.item}</Typography>
                           <Typography variant='body2' color='primary' className='font-black my-1'>{rec.action}</Typography>
                           <Typography variant='caption' className='text-slate-500 italic'>{rec.reason}</Typography>
                        </Box>
                     ))}
                  </Box>
               </CardContent>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default ForecastingView
