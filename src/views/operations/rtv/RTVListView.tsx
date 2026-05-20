'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import { useState } from 'react'
import PageHeader from '@/components/layout/shared/PageHeader'
import Link from 'next/link'
import AddRTVDialog from './AddRTVDialog'

const PurchaseReturnsView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const rmas = [
    { id: 'RMA-V-2026-001', type: 'Defective Material', vendor: 'Tech Solutions', item: 'Power Supply 500W', reason: 'DOA (Dead on Arrival)', status: 'Pending Credit' },
    { id: 'RMA-V-2026-002', type: 'Wrong Shipment', vendor: 'Office Depot', item: 'Monitor Arm', reason: 'Incorrect size sent', status: 'In Transit' },
    { id: 'RMA-V-2026-003', type: 'Quality Issue', vendor: 'Global Office', item: 'Executive Chair', reason: 'Broken base plate', status: 'Inspected' }
  ]

  return (
    <>
      <PageHeader
        title='Purchase Returns (RTV)'
        description='Manage Return-to-Vendor cases and track supplier credit note settlements'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Returns' }]}
        actions={<Button variant='contained' color='error' startIcon={<i className='tabler-truck-return' />} sx={{ height: 40 }} onClick={() => setIsDialogOpen(true)}>Initiate RTV Case</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
        <Grid2 size={{ xs: 12 }}>
          <Card>
            <Box className='p-6 border-be'>
              <Typography variant='h6' className='font-semibold'>Active Vendor Return Authorizations</Typography>
            </Box>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='border-be'>
                    <tr className='text-left bg-slate-50'>
                      <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>RMA ID</th>
                      <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Vendor / Category</th>
                      <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Material / Deviation</th>
                      <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Sourcing Status</th>
                      <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rmas.map((rma) => (
                      <tr key={rma.id} className='border-be hover:bg-slate-50 transition-colors'>
                        <td className='p-4 text-sm font-bold'>
                          <Typography 
                            color='error' 
                            className='font-bold' 
                            component={Link} 
                            href={`/3m/operations/returns/${rma.id}`}
                            
                          >
                            {rma.id}
                          </Typography>
                        </td>
                        <td className='p-4'>
                           <Typography variant='body2' className='font-bold text-slate-800'>{rma.vendor}</Typography>
                           <Chip label={rma.type} size='small' variant='tonal' color='warning' className='font-medium mt-1.5' />
                        </td>
                        <td className='p-4'>
                          <Typography variant='body2' className='font-bold text-slate-800'>{rma.item}</Typography>
                          <Typography variant='caption' color='error' className='font-medium block mt-1'>{rma.reason}</Typography>
                        </td>
                        <td className='p-4'>
                          <Chip label={rma.status} size='small' variant='tonal' className='font-medium' color={rma.status.includes('Credit') ? 'success' : 'secondary'} />
                        </td>
                        <td className='p-4'>
                          <Button 
                            component={Link}
                            href={`/3m/operations/returns/${rma.id}`}
                            size='small' 
                            variant='tonal' 
                            color='secondary' 
                            startIcon={<i className='tabler-file-analytics' />} 
                            className='font-medium'
                          >
                            Case File
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <AddRTVDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default PurchaseReturnsView
