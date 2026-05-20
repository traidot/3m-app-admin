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
import AddQCDialog from './AddQCDialog'

const QCListView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const inspections = [
    { id: 'QA-5501', grn: 'GR-2026-001', material: 'Power Supply 500W', vendor: 'Tech Solutions', result: 'Pass', score: 5, date: '2026-04-18' },
    { id: 'QA-5502', grn: 'GR-2026-002', material: 'Office Chair Exec', vendor: 'Furniture Co', result: 'Fail', score: 2, date: '2026-04-19' },
    { id: 'QA-5503', grn: 'GR-2026-003', material: 'Monitor 24"', vendor: 'Tech Solutions', result: 'Quarantine', score: 3, date: '2026-04-20' },
    { id: 'QA-5504', grn: 'GR-2026-004', material: 'A4 Paper Reams', vendor: 'Office Depot', result: 'Pass', score: 5, date: '2026-04-21' }
  ]

  return (
    <>
      <PageHeader
        title='Quality Assurance (QA)'
        description='Manage material inspections and compliance audits for incoming shipments'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Logistics & Inbound' }, { label: 'Quality Inspection', href: '/warehouse/qc' }]}
        actions={
          <Button variant='contained' color='warning' startIcon={<i className='tabler-shield-check' />} onClick={() => setIsDialogOpen(true)} sx={{ height: 40 }}>
            New Inspection
          </Button>
        }
      />

      <Card className='mt-6'>
        <CardContent className='flex flex-wrap gap-6 items-end justify-between p-6'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Audit Search</Typography>
            <TextField 
              size='small' 
              placeholder='QA #, GRN, Material...' 
              sx={{ width: 300 }} 
            />
          </Box>
          <Box className='flex gap-3'>
             <Chip label="1 Reject Triggered" color="error" variant="tonal" className="font-bold" />
             <Button variant='tonal' size='small' color='secondary' startIcon={<i className='tabler-adjustments-alt' />} sx={{ height: 40 }}>Batch Action</Button>
          </Box>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-be'>
              <tr className='text-left bg-slate-50 text-slate-600'>
                <th className='p-4 text-[11px] uppercase font-bold'>QA Ref</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Shipment / GRN</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Material Detail</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Compliance Result</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((qa) => (
                <tr key={qa.id} className='border-be hover:bg-slate-50 transition-colors cursor-pointer'>
                  <td className='p-4'>
                    <Typography 
                      color='primary' 
                      className='font-bold' 
                      component={Link} 
                      href={`/3m/warehouse/qc/${qa.id}`}
                      
                    >
                      {qa.id}
                    </Typography>
                    <Typography variant='caption' className='text-slate-500 font-medium'>{qa.date}</Typography>
                  </td>
                  <td className='p-4'>
                    <Typography variant='body2' className='font-bold text-slate-800'>{qa.grn}</Typography>
                    <Typography variant='caption' className='text-slate-500 font-medium'>{qa.vendor}</Typography>
                  </td>
                  <td className='p-4 text-sm font-medium text-primary'>{qa.material}</td>
                  <td className='p-4'>
                    <Chip 
                      label={qa.result} 
                      size='small' 
                      variant='tonal' 
                      className='font-bold'
                      color={
                        qa.result === 'Pass' ? 'success' : 
                        qa.result === 'Fail' ? 'error' : 
                        qa.result === 'Quarantine' ? 'warning' : 'secondary'
                      } 
                    />
                  </td>
                  <td className='p-4'>
                    <Button 
                      component={Link}
                      href={`/warehouse/qc/${qa.id}`}
                      size='small' 
                      variant='tonal' 
                      className='font-medium'
                    >
                      View Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddQCDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default QCListView
