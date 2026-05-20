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
import AddPRDialog from './AddPRDialog'

const PRListView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const requisitions = [
    { id: 'PR-2026-001', title: 'IT Infrastructure Upgrade', dept: 'IT Support', date: '2026-04-18', status: 'Pending Approval', priority: 'High' },
    { id: 'PR-2026-002', title: 'Office Stationery Q2', dept: 'Operations', date: '2026-04-19', status: 'Approved', priority: 'Normal' },
    { id: 'PR-2026-003', title: 'New Marketing Workstations', dept: 'Marketing', date: '2026-04-20', status: 'Draft', priority: 'High' },
    { id: 'PR-2026-004', title: 'Safety Gear for Warehouse', dept: 'Logistics', date: '2026-04-21', status: 'Converted to PO', priority: 'Critical' }
  ]

  return (
    <>
      <PageHeader
        title='Purchase Requisitions'
        description='Centralized portal for internal procurement requests and inter-departmental material needs'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Requisitions' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setIsDialogOpen(true)} sx={{ height: 40 }}>
            Create PR
          </Button>
        }
      />

      <Card className='mt-6'>
        <CardContent className='flex flex-wrap gap-6 items-end justify-between p-6'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Quick Search</Typography>
            <TextField 
              size='small' 
              placeholder='PR ref, title, dept...' 
              sx={{ width: 300 }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <Box className='flex gap-3'>
             <Button variant='tonal' size='small' color='secondary' startIcon={<i className='tabler-filter' />} sx={{ height: 40 }}>Filters</Button>
          </Box>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-be'>
              <tr className='text-left bg-slate-50 text-slate-600'>
                <th className='p-4 text-[11px] uppercase font-bold'>PR Reference</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Title / Description</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Requesting Dept</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Priority</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Status</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.map((pr) => (
                <tr key={pr.id} className='border-be hover:bg-slate-50 transition-colors cursor-pointer'>
                  <td className='p-4 text-sm font-bold'>
                    <Typography 
                      color='primary' 
                      className='font-bold' 
                      component={Link} 
                      href={`/3m/commercial/pr/${pr.id}`}
                    >
                      {pr.id}
                    </Typography>
                  </td>
                  <td className='p-4'>
                    <Typography variant='body2' className='font-bold text-slate-800'>{pr.title}</Typography>
                    <Typography variant='caption' className='text-slate-500 font-medium'>{pr.date}</Typography>
                  </td>
                  <td className='p-4 text-sm font-medium text-slate-700'>{pr.dept}</td>
                  <td className='p-4'>
                    <Chip 
                        label={pr.priority} 
                        size='small' 
                        variant='tonal' 
                        className='font-bold'
                        color={pr.priority === 'Critical' ? 'error' : pr.priority === 'High' ? 'warning' : 'info'} 
                    />
                  </td>
                  <td className='p-4'>
                    <Chip 
                      label={pr.status} 
                      size='small' 
                      variant='tonal' 
                      className='font-medium'
                      color={
                        pr.status === 'Approved' ? 'success' : 
                        pr.status === 'Converted to PO' ? 'primary' : 
                        pr.status === 'Draft' ? 'secondary' : 'warning'
                      } 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddPRDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default PRListView
