'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import PageHeader from '@/components/layout/shared/PageHeader'

const QCView = () => {
  const qcTasks = [
    { id: 'QC-101', item: 'Ergonomic Chair', qty: 20, supplier: 'Furniture Co', status: 'Pending', priority: 'High' },
    { id: 'QC-102', item: 'LED Monitor', qty: 50, supplier: 'Tech Solutions', status: 'In Progress', priority: 'Medium' },
    { id: 'QC-103', item: 'Wireless Mouse', qty: 100, supplier: 'LogiTech', status: 'Passed', priority: 'Low' }
  ]

  return (
    <>
      <PageHeader
        title='Quality Control Inspection'
        description='Manage product inspection flows and quality assurance logs'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Warehouse' }, { label: 'QC' }]}
      />

      <Card className='mt-6'>
        <CardContent>
          <Typography variant='h6' className='mb-4'>Active Inspection Tasks</Typography>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-slate-50'>
                <tr className='text-left border-be'>
                  <th className='p-3 text-xs uppercase font-bold'>Task ID</th>
                  <th className='p-3 text-xs uppercase font-bold'>Product</th>
                  <th className='p-3 text-xs uppercase font-bold'>Qty</th>
                  <th className='p-3 text-xs uppercase font-bold'>Priority</th>
                  <th className='p-3 text-xs uppercase font-bold'>Status</th>
                  <th className='p-3 text-xs uppercase font-bold'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {qcTasks.map((task) => (
                  <tr key={task.id} className='border-be hover:bg-slate-50'>
                    <td className='p-3 text-sm font-bold'>{task.id}</td>
                    <td className='p-3'>
                      <Typography variant='body2' className='font-medium'>{task.item}</Typography>
                      <Typography variant='caption' color='text.secondary'>{task.supplier}</Typography>
                    </td>
                    <td className='p-3 text-sm'>{task.qty}</td>
                    <td className='p-3'>
                      <Chip 
                        label={task.priority} 
                        size='small' 
                        color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'primary'} 
                        variant='tonal'
                      />
                    </td>
                    <td className='p-3'>
                      <Chip 
                        label={task.status} 
                        size='small' 
                        color={task.status === 'Passed' ? 'success' : task.status === 'Pending' ? 'secondary' : 'info'} 
                      />
                    </td>
                    <td className='p-3'>
                      <Button variant='contained' size='small' disabled={task.status === 'Passed'}>
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default QCView
