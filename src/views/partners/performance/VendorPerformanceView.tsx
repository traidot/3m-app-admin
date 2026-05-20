'use client'

import { useState, useMemo } from 'react'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import dynamic from 'next/dynamic'
import type { ApexOptions } from 'apexcharts'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import PageHeader from '@/components/layout/shared/PageHeader'

const AppReactApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const VendorPerformanceView = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')

  const handleAction = (msg: string) => {
    setSnackbarMsg(msg)
    setSnackbarOpen(true)
  }

  const radarOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    colors: ['#7367f0'],
    labels: ['Quality Rate', 'Lead Time', 'Price Competitiveness', 'Compliance', 'Response Speed', 'Service Support'],
    markers: { size: 4 },
    fill: { opacity: 0.2 },
    stroke: { width: 2 },
    yaxis: { show: false }
  }), [])

  const radarSeries = [{ name: 'Current Performance', data: [95, 82, 75, 90, 88, 80] }]

  const vendors = [
    { name: 'Tech Solutions Inc', score: 88, delivery: '98%', quality: '99.5%', status: 'Platinum' },
    { name: 'Global Office Supply', score: 72, delivery: '85%', quality: '92%', status: 'Gold' },
    { name: 'Steel Core Ltd', score: 94, delivery: '100%', quality: '98%', status: 'Platinum' }
  ]

  return (
    <>
      <PageHeader
        title='Vendor Performance Scorecards'
        description='Quantifiable analysis of supplier reliability based on historical fulfillment data'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Supplier Hub' }, { label: 'Vendor Performance' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-file-download' />} onClick={() => handleAction('Annual auditing report generation started...')}>Export Annual Audit</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12, md: 4 }}>
            <Card className='h-full'>
               <CardHeader title='Performance Metrics' subheader='Selection: Tech Solutions Inc' />
               <CardContent>
                  <AppReactApexCharts type='radar' height={350} options={radarOptions} series={radarSeries} />
                  <Box className='mt-6 p-4 bg-slate-50 rounded-lg'>
                     <Typography variant='body2' className='font-black text-slate-800 mb-2'>Strategic Insight</Typography>
                     <Typography variant='caption' className='text-slate-500 italic'>
                        Exhibits exceptional quality control but lead times have increased by 12% in the last quarter. 
                        Negotiation recommended for expedited shipping lanes.
                     </Typography>
                  </Box>
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12, md: 8 }}>
            <Grid2 container spacing={6}>
               {vendors.map((v, i) => (
                  <Grid2 size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                     <Card className='border-t-4 border-t-primary border-t-opacity-50'>
                        <CardContent className='pt-6'>
                           <Box className='flex justify-between items-start mb-4'>
                              <Avatar variant='rounded' sx={{ bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 'bold' }}>{v.name[0]}</Avatar>
                              <Chip label={v.status} size='small' variant='tonal' color='primary' className='font-black' />
                           </Box>
                           <Typography variant='h6' className='font-bold text-slate-800 mbe-4'>{v.name}</Typography>
                           
                           <Box className='flex flex-col gap-3'>
                              <Box className='flex justify-between items-center'>
                                 <Typography variant='caption' className='font-bold text-slate-400'>Overall Reliability</Typography>
                                 <Typography variant='body2' className='font-black text-success'>{v.score}%</Typography>
                              </Box>
                              <Box className='flex justify-between items-center'>
                                 <Typography variant='caption' className='font-bold text-slate-400'>On-Time delivery</Typography>
                                 <Typography variant='body2' className='font-bold'>{v.delivery}</Typography>
                              </Box>
                              <Box className='flex justify-between items-center'>
                                 <Typography variant='caption' className='font-bold text-slate-400'>Quality Avg.</Typography>
                                 <Typography variant='body2' className='font-bold'>{v.quality}</Typography>
                              </Box>
                           </Box>
                           <Button fullWidth variant='outlined' size='small' className='mt-6 font-bold' onClick={() => handleAction(`Deep dive analytics for ${v.name} is fetching...`)}>View Deep Dive</Button>
                        </CardContent>
                     </Card>
                  </Grid2>
               ))}

               <Grid2 size={{ xs: 12 }}>
                  <Card>
                     <CardHeader title='Inbound Discrepancy Trends' subheader='Quantity vs Quality shortfalls over time' />
                     <CardContent>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'slate.50', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                           <Typography variant='body2' color='textSecondary' className='italic'>
                              Secondary analytics chart (Heatmap / Area) implementation pending integration
                           </Typography>
                        </Box>
                     </CardContent>
                  </Card>
               </Grid2>
            </Grid2>
         </Grid2>
      </Grid2>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" variant="filled" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default VendorPerformanceView
