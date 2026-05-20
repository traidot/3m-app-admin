'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'

import PageHeader from '@/components/layout/shared/PageHeader'

const budgets = [
  { dept: 'IT Infrastructure', allocation: '$150,000', used: '$120,450', progress: 80, color: 'primary', icon: 'tabler-cpu' },
  { dept: 'Marketing Ops', allocation: '$80,000', used: '$75,200', progress: 94, color: 'error', icon: 'tabler-megaphone' },
  { dept: 'Warehouse & Logistics', allocation: '$200,000', used: '$85,000', progress: 42, color: 'success', icon: 'tabler-truck' },
  { dept: 'HR & Administration', allocation: '$50,000', used: '$12,000', progress: 24, color: 'info', icon: 'tabler-users' }
]

const BudgetControlView = () => {
  return (
    <>
      <PageHeader
        title='Strategic Budget Control'
        description='Financial governance and oversight of departmental spending limits'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Financial Bridge' }, { label: 'Departmental Budgets' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-chart-arrows' />}>Reallocate Funds</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
         {budgets.map((budget, i) => (
           <Grid2 size={{ xs: 12, md: 6 }} key={i}>
              <Card className={`border-t-4 border-t-${budget.color}`}>
                 <CardContent className='p-6'>
                    <Box className='flex justify-between items-start mb-6'>
                       <Box className='flex gap-4 items-center'>
                          <Avatar variant='rounded' sx={{ bgcolor: `${budget.color}.lighter`, color: `${budget.color}.main`, width: 48, height: 48 }}>
                             <i className={`${budget.icon} text-2xl`} />
                          </Avatar>
                          <Box>
                             <Typography variant='h6' className='font-black leading-tight'>{budget.dept}</Typography>
                             <Typography variant='caption' className='text-slate-400 uppercase font-bold tracking-widest'>Q2 FY2026</Typography>
                          </Box>
                       </Box>
                       <Chip label={budget.progress > 90 ? 'OVER_SPEND_RISK' : 'HEALTHY'} color={budget.progress > 90 ? 'error' : 'success'} size='small' variant='tonal' className='font-black tracking-tighter' />
                    </Box>

                    <Grid2 container spacing={4} className='mb-6'>
                       <Grid2 size={{ xs: 6 }}>
                          <Typography variant='caption' className='uppercase font-bold text-slate-400'>Total Allocation</Typography>
                          <Typography variant='h5' className='font-black'>{budget.allocation}</Typography>
                       </Grid2>
                       <Grid2 size={{ xs: 6 }} className='text-right'>
                          <Typography variant='caption' className='uppercase font-bold text-slate-400'>Actual Consumption</Typography>
                          <Typography variant='h5' className='font-black text-slate-700'>{budget.used}</Typography>
                       </Grid2>
                    </Grid2>

                    <Box className='flex flex-col gap-2'>
                       <Box className='flex justify-between items-center'>
                          <Typography variant='body2' className='font-bold text-slate-500'>Utilization Index</Typography>
                          <Typography variant='body2' className='font-black text-slate-900'>{budget.progress}%</Typography>
                       </Box>
                       <LinearProgress 
                          variant='determinate' 
                          value={budget.progress} 
                          sx={{ height: 8, borderRadius: 4 }} 
                          color={budget.color as any}
                       />
                    </Box>
                 </CardContent>
              </Card>
           </Grid2>
         ))}

         <Grid2 size={{ xs: 12 }}>
            <Card sx={{ border: '1px dashed grey.400', bgcolor: 'slate.50', py: 6 }}>
               <CardContent className='flex flex-col items-center gap-4 text-center'>
                  <Box className='bg-slate-200 p-4 rounded-full'>
                     <i className='tabler-trending-down text-3xl text-slate-500' />
                  </Box>
                  <Box>
                     <Typography variant='h6' className='font-bold text-slate-800'>Global Budget Optimization Study</Typography>
                     <Typography variant='body2' className='text-slate-500 max-w-[500px]'>Analyze spending patterns to identify consolidate buying opportunities and reduce overall departmental costs.</Typography>
                  </Box>
                  <Button variant='outlined' color='secondary'>Generate Savings Report</Button>
               </CardContent>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default BudgetControlView
