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
import AddPODialog from './AddPODialog'

const POListView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const purchaseOrders = [
    { id: 'PO-2026-001', supplier: 'Tech Solutions Inc', date: '2026-04-01', amount: '$12,450', status: 'Approved' },
    { id: 'PO-2026-002', supplier: 'Furniture Co', date: '2026-04-12', amount: '$4,200', status: 'Pending Approval' },
    { id: 'PO-2026-003', supplier: 'Office Depot', date: '2026-04-15', amount: '$850', status: 'Draft' },
    { id: 'PO-2026-004', supplier: 'Global Logistics', date: '2026-04-16', amount: '$3,100', status: 'Partially Received' }
  ]

  return (
    <>
      <PageHeader
        title='Purchase Orders (PO)'
        description='Centralized management of procurement requests, order approvals, and buying history'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Purchasing' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setIsDialogOpen(true)} sx={{ height: 40 }}>Create PO</Button>}
      />

      <Card className='mt-6'>
        <CardContent className='flex flex-wrap gap-6 items-end justify-between p-6'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Order Search</Typography>
            <TextField 
              size='small' 
              placeholder='PO reference, supplier...' 
              sx={{ width: 280 }} 
            />
          </Box>
          <Box className='flex gap-3'>
            <Button variant='tonal' size='small' className='font-medium' sx={{ height: 40 }}>Bulk Approve</Button>
            <Button variant='tonal' size='small' color='secondary' className='font-medium' sx={{ height: 40 }}>Export CSV</Button>
          </Box>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-be'>
              <tr className='text-left bg-slate-50'>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>PO Reference</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Primary Supplier</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Issue Date</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Grand Total</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po.id} className='border-be hover:bg-slate-50 transition-colors cursor-pointer'>
                  <td className='p-4 text-sm font-bold'>
                    <Typography 
                      color='primary' 
                      className='font-bold' 
                      component={Link} 
                      href={`/3m/commercial/po/${po.id}`}
                      
                    >
                      {po.id}
                    </Typography>
                  </td>
                  <td className='p-4 text-sm font-medium text-slate-800'>{po.supplier}</td>
                  <td className='p-4 text-sm text-slate-600'>{po.date}</td>
                  <td className='p-4 text-sm font-bold text-slate-900'>{po.amount}</td>
                  <td className='p-4'>
                    <Chip 
                      label={po.status} 
                      size='small' 
                      variant='tonal' 
                      className='font-medium'
                      color={
                        po.status === 'Approved' ? 'success' : 
                        po.status === 'Draft' ? 'secondary' : 
                        po.status === 'Partially Received' ? 'info' : 'warning'
                      } 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddPODialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default POListView
