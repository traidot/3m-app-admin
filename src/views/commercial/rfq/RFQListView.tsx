'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'
import AddRFQDialog from './AddRFQDialog'

const RFQListView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const rfqRequests = [
    { id: 'RFQ-2026-001', vendor: 'Multiple (3)', date: '2026-04-16', items: 5, budget: '$5,000', status: 'Bidding' },
    { id: 'RFQ-2026-002', vendor: 'Tech Solutions', date: '2026-04-15', items: 12, budget: '$12,000', status: 'Closed' },
    { id: 'RFQ-2026-003', vendor: 'Global Office', date: '2026-04-14', items: 2, budget: '$500', status: 'Awarded' },
    { id: 'RFQ-2026-004', vendor: 'Logistics Pro', date: '2026-04-13', items: 1, budget: '$1,200', status: 'Draft' }
  ]

  return (
    <>
      <PageHeader
        title='Requests for Quotation (RFQ)'
        description='Manage supplier bidding processes and price solicitation campaigns'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Requests for Quotation', href: '/3m/commercial/rfq' }]}
        actions={<Button variant='contained' color='primary' startIcon={<i className='tabler-file-plus' />} onClick={() => setIsDialogOpen(true)} sx={{ height: 40 }}>New RFQ</Button>}
      />

      <Card className='mt-6'>
        <CardContent className='flex flex-wrap gap-6 items-end justify-between p-6'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Sourcing Search</Typography>
            <TextField 
                size='small' 
                placeholder='Search RFQ ID, vendors...' 
                sx={{ width: 280 }} 
            />
          </Box>
          <Box className='flex gap-2 items-center'>
            <Chip label='2 Open Bids' color='info' variant='tonal' className='font-bold' />
          </Box>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-be'>
              <tr className='text-left bg-slate-50'>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>RFQ #</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Candidate Vendors</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Items Requested</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Estimated Budget</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Sourcing Status</th>
              </tr>
            </thead>
            <tbody>
              {rfqRequests.map((rfq) => (
                <tr key={rfq.id} className='border-be hover:bg-slate-50 transition-colors cursor-pointer'>
                  <td className='p-4 text-sm font-bold'>
                    <Typography 
                      color='primary' 
                      className='font-bold' 
                      component={Link} 
                      href={`/3m/commercial/rfq/${rfq.id}`}
                      
                    >
                      {rfq.id}
                    </Typography>
                  </td>
                  <td className='p-4 text-sm font-medium text-slate-800'>{rfq.vendor}</td>
                  <td className='p-4 text-sm text-slate-600'>{rfq.items} items</td>
                  <td className='p-4 text-sm font-bold text-slate-900'>{rfq.budget}</td>
                  <td className='p-4'>
                    <Chip 
                      label={rfq.status} 
                      size='small' 
                      variant='tonal' 
                      className='font-medium'
                      color={
                        rfq.status === 'Awarded' ? 'success' : 
                        rfq.status === 'Closed' ? 'error' : 
                        rfq.status === 'Bidding' ? 'info' : 'secondary'
                      } 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddRFQDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default RFQListView
