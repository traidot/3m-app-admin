'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'

import PageHeader from '@/components/layout/shared/PageHeader'

const pendingPayments = [
  { id: 'INV-4410', vendor: 'Tech Solutions Inc', amount: '$8,500', dueDate: '2026-04-25', status: 'Approved', priority: 'High' },
  { id: 'INV-4411', vendor: 'Furniture Co', amount: '$4,200', dueDate: '2026-05-01', status: 'Approved', priority: 'Medium' },
  { id: 'INV-4412', vendor: 'Global Office', amount: '$1,250', dueDate: '2026-04-22', status: 'Pending Verification', priority: 'Low' },
  { id: 'INV-4415', vendor: 'Steel Core Ltd', amount: '$15,000', dueDate: '2026-04-20', status: 'Overdue', priority: 'Critical' }
]

const PaymentSchedulingView = () => {
  return (
    <>
      <PageHeader
        title='Accounts Payable & Payments'
        description='Coordinate invoice disbursements and consolidate multi-vendor payment batches'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Financial Bridge' }, { label: 'Payments & Batches' }]}
        actions={
          <Stack direction='row' spacing={2}>
             <Button variant='outlined' color='secondary' startIcon={<i className='tabler-file-analytics' />}>Bank Reconcile</Button>
             <Button variant='contained' startIcon={<i className='tabler-wallet' />}>Release Batch Payment</Button>
          </Stack>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12, md: 3 }}>
            <Card className='border-t-4 border-t-error'>
               <CardContent>
                  <Typography variant='caption' className='uppercase font-bold text-slate-400'>Total Overdue</Typography>
                  <Typography variant='h5' className='font-black text-error'>$15,000.00</Typography>
                  <Typography variant='caption' className='text-slate-400'>1 Invoice requiring immediate action</Typography>
               </CardContent>
            </Card>
         </Grid2>
         <Grid2 size={{ xs: 12, md: 3 }}>
            <Card className='border-t-4 border-t-primary'>
               <CardContent>
                  <Typography variant='caption' className='uppercase font-bold text-slate-400'>Scheduled (7 Days)</Typography>
                  <Typography variant='h5' className='font-black text-primary'>$9,750.00</Typography>
                  <Typography variant='caption' className='text-slate-400'>Approved for next disbursement</Typography>
               </CardContent>
            </Card>
         </Grid2>
         <Grid2 size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: 'secondary.lighter', border: '1px dashed', borderColor: 'secondary.main' }}>
               <CardContent className='flex items-center justify-between py-5'>
                  <Box>
                    <Typography variant='h6' color='secondary.main' className='font-bold'>Next Payment Cycle</Typography>
                    <Typography variant='body2' color='secondary.dark'>Batch #BATCH-2604-A: Scheduled for 2026-04-22</Typography>
                  </Box>
                  <Button variant='contained' color='secondary' size='small'>Preview Batch</Button>
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12 }}>
            <Card>
               <CardContent className='flex flex-wrap gap-6 items-end p-6 border-be'>
                  <Box className='flex flex-col gap-1.5'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-500'>Payment Priority</Typography>
                    <TextField select size='small' defaultValue='all' sx={{ width: 180 }}>
                       <MenuItem value='all'>All Open Items</MenuItem>
                       <MenuItem value='critical'>Overdue / Critical</MenuItem>
                       <MenuItem value='high'>High Priority</MenuItem>
                    </TextField>
                  </Box>
                  <Box className='flex-grow' />
                  <TextField size='small' placeholder='Search Reference...' sx={{ width: 250 }} />
               </CardContent>

               <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='text-left bg-slate-50 border-be'>
                        <th className='p-4' style={{ width: 50 }}><Checkbox size='small' /></th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Invoice Ref</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Supplier Entity</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-right'>Net Amount</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Due Date</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Workflow Status</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Urgency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayments.map((row, i) => (
                        <tr key={i} className='border-be last:border-0 hover:bg-slate-50'>
                          <td className='p-4'><Checkbox size='small' defaultChecked={row.status === 'Overdue' || row.priority === 'High'} /></td>
                          <td className='p-4 text-sm font-black text-slate-800'>{row.id}</td>
                          <td className='p-4 text-sm font-bold text-slate-600'>{row.vendor}</td>
                          <td className='p-4 text-sm font-black text-slate-900 text-right'>{row.amount}</td>
                          <td className='p-4 text-center text-sm font-mono text-slate-500'>{row.dueDate}</td>
                          <td className='p-4 text-center'>
                             <Chip 
                                label={row.status} 
                                size='small' 
                                variant='tonal' 
                                color={row.status === 'Overdue' ? 'error' : row.status === 'Approved' ? 'success' : 'secondary'} 
                                className='font-bold'
                             />
                          </td>
                          <td className='p-4 text-center'>
                             <Chip 
                                label={row.priority} 
                                size='small' 
                                variant='tonal' 
                                color={row.priority === 'Critical' ? 'error' : row.priority === 'High' ? 'warning' : 'info'} 
                                className='font-black tracking-widest uppercase'
                             />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default PaymentSchedulingView
