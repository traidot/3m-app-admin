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
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Avatar from '@mui/material/Avatar'

import PageHeader from '@/components/layout/shared/PageHeader'

const reorderItems = [
  { material: 'Power Dell R750 PSU', sku: 'IT-PSU-990', current: 5, threshold: 10, reorderQty: 20, status: 'Critical', autoPR: true },
  { material: 'Cisco Cat 1M Cable', sku: 'NET-CBL-01', current: 45, threshold: 50, reorderQty: 100, status: 'Warning', autoPR: true },
  { material: 'Ergo Office Mouse', sku: 'ACC-MSE-22', current: 2, threshold: 15, reorderQty: 50, status: 'Out of Stock', autoPR: false },
  { material: 'A4 Printing Paper', sku: 'OFF-PA-A4', current: 150, threshold: 100, reorderQty: 200, status: 'Optimal', autoPR: true }
]

const ReorderManagementView = () => {
  return (
    <>
      <PageHeader
        title='Automated Replenishment Logic'
        description='Manage inventory safety stock levels and automated procurement triggers for optimized material availability'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Master Data & Assets' }, { label: 'Replenishment Rules' }]}
        actions={<Button variant='contained' color='primary' startIcon={<i className='tabler-settings-automation' />}>Global Engine Settings</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12 }}>
            <Card>
               <CardContent className='flex flex-wrap gap-6 items-end p-6 border-be'>
                  <Box className='flex flex-col gap-1.5'>
                     <Typography variant='caption' className='uppercase font-bold text-slate-500'>Rule Status</Typography>
                     <TextField select size='small' defaultValue='all' sx={{ width: 180 }}>
                        <MenuItem value='all'>All Materials</MenuItem>
                        <MenuItem value='active'>Automation Active</MenuItem>
                        <MenuItem value='manual'>Manual Reorder</MenuItem>
                     </TextField>
                  </Box>
                  <Box className='flex-grow' />
                  <TextField size='small' placeholder='Filter SKU...' sx={{ width: 250 }} />
               </CardContent>

               <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='text-left bg-slate-50 border-be'>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Material Detail</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>On Hand</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Min. threshold</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Reorder Qty</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Inventory Health</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Auto-PR</th>
                        <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reorderItems.map((row, i) => (
                        <tr key={i} className='border-be last:border-0 hover:bg-slate-50'>
                          <td className='p-4'>
                             <Box className='flex flex-col'>
                                <Typography variant='body2' className='font-bold text-slate-800'>{row.material}</Typography>
                                <Typography variant='caption' className='text-slate-400 font-mono'>{row.sku}</Typography>
                             </Box>
                          </td>
                          <td className='p-4 text-center text-sm font-black'>{row.current}</td>
                          <td className='p-4 text-center text-sm text-slate-500 font-bold'>{row.threshold}</td>
                          <td className='p-4 text-center text-sm text-primary font-black'>{row.reorderQty}</td>
                          <td className='p-4 text-center'>
                             <Chip 
                                label={row.status} 
                                size='small' 
                                variant='tonal' 
                                color={row.status === 'Optimal' ? 'success' : row.status === 'Warning' ? 'warning' : 'error'} 
                                className='font-bold'
                             />
                          </td>
                          <td className='p-4 text-center'>
                             <Switch size='small' defaultChecked={row.autoPR} color='primary' />
                          </td>
                          <td className='p-4 text-center'>
                             <Button size='small' variant='tonal' color={row.current <= row.threshold ? 'warning' : 'secondary'}>
                                {row.current <= row.threshold ? 'Execute PR' : 'Edit Rule'}
                             </Button>
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

export default ReorderManagementView
