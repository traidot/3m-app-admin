'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid2 from '@mui/material/Grid2'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'
import AddInvoiceDialog from './AddInvoiceDialog'

const InvoiceListView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const invoices = [
    { id: 'INV-2026-881', vendor: 'Tech Solutions Inc', po: 'PO-2026-001', amount: '$12,450', status: 'Matched', date: '2026-04-12' },
    { id: 'INV-2026-882', vendor: 'Furniture Co', po: 'PO-2026-002', amount: '$4,200', status: 'Discrepancy', date: '2026-04-14' },
    { id: 'INV-2026-883', vendor: 'Office Depot', po: 'PO-2026-003', amount: '$850', status: 'Matched', date: '2026-04-15' },
    { id: 'INV-2026-884', vendor: 'Global Logistics', po: 'PO-2026-004', amount: '$3,100', status: 'Verification', date: '2026-04-16' }
  ]

  return (
    <>
      <PageHeader
        title='Supplier Invoices'
        description='Register vendor invoices and verify them against received goods and purchase orders'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Supplier Invoices', href: '/3m/commercial/invoices' }]}
        actions={
          <Button variant='contained' color='primary' startIcon={<i className='tabler-receipt' />} onClick={() => setIsDialogOpen(true)} sx={{ height: 40 }}>
            Post Invoice
          </Button>
        }
      />

      <Card className='mt-6'>
        <CardContent className='flex flex-wrap gap-6 items-end justify-between p-6'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Invoice Search</Typography>
            <TextField 
              size='small' 
              placeholder='Invoice #, Vendor, PO...' 
              sx={{ width: 300 }} 
            />
          </Box>
          <Box className='flex gap-3'>
             <Chip label="1 Discrepancy Found" color="error" variant="tonal" className="font-bold" />
             <Button variant='tonal' size='small' color='secondary' startIcon={<i className='tabler-brand-shopee' />} sx={{ height: 40 }}>Export for ERP</Button>
          </Box>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-be'>
              <tr className='text-left bg-slate-50 text-slate-600'>
                <th className='p-4 text-[11px] uppercase font-bold'>Invoice No</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Vendor / PO Ref</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Matching Logic</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Total Amount</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className='border-be hover:bg-slate-50 transition-colors cursor-pointer'>
                  <td className='p-4'>
                    <Typography 
                      color='primary' 
                      className='font-bold' 
                      component={Link} 
                      href={`/3m/commercial/invoices/${inv.id}`}
                      
                    >
                      {inv.id}
                    </Typography>
                    <Typography variant='caption' className='text-slate-500 font-medium'>Issued: {inv.date}</Typography>
                  </td>
                  <td className='p-4'>
                    <Typography variant='body2' className='font-bold text-slate-800'>{inv.vendor}</Typography>
                    <Typography variant='caption' className='text-slate-500 font-medium'>PO: {inv.po}</Typography>
                  </td>
                  <td className='p-4'>
                    <Box className='flex gap-1'>
                        <Chip label="PO" size='small' variant='tonal' color='success' />
                        <Chip label="GRN" size='small' variant='tonal' color='success' />
                        <Chip label="INV" size='small' variant='tonal' color='success' />
                    </Box>
                  </td>
                  <td className='p-4 text-sm font-bold text-slate-900'>{inv.amount}</td>
                  <td className='p-4'>
                    <Chip 
                      label={inv.status} 
                      size='small' 
                      variant='tonal' 
                      className='font-medium'
                      color={
                        inv.status === 'Matched' ? 'success' : 
                        inv.status === 'Discrepancy' ? 'error' : 
                        inv.status === 'Verification' ? 'warning' : 'secondary'
                      } 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddInvoiceDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default InvoiceListView
