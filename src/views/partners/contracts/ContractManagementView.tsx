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
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'
import UploadContractDialog from './UploadContractDialog'

const contracts = [
  { id: 'CT-2026-01', vendor: 'Tech Solutions Inc', type: 'SLA - IT Support', value: '$25,000', expiry: '2026-12-31', progress: 85, status: 'Active' },
  { id: 'CT-2026-02', vendor: 'Global Office', type: 'Annual Supply Agreement', value: '$12,000', expiry: '2026-05-15', progress: 92, status: 'Expiring' },
  { id: 'CT-2026-03', vendor: 'Furniture Co', type: 'Fixed Asset Procurement', value: '$45,000', expiry: '2026-08-20', progress: 45, status: 'Active' },
  { id: 'CT-2025-09', vendor: 'BuildCorp', type: 'Maintenance Services', value: '$8,500', expiry: '2026-03-01', progress: 100, status: 'Expired' }
]

const ContractManagementView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <PageHeader
        title='Legal & Contractual Lifecycle'
        description='Enterprise repository for Master Service Agreements (MSA), NDA and procurement-specific contracts'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Strategic Sourcing' }, { label: 'Contract Management' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-file-upload' />} onClick={() => setIsDialogOpen(true)}>Secure Sign Upload</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
         {/* Alert Banner for Expiring Contracts */}
         <Grid2 size={{ xs: 12 }}>
            <Card className='bg-amber-50 border border-amber-200 shadow-none'>
               <CardContent className='flex items-center gap-4 py-3'>
                  <Box className='bg-amber-500 text-white p-2 rounded'>
                     <i className='tabler-alert-triangle text-xl' />
                  </Box>
                  <Box className='flex-grow'>
                     <Typography variant='body2' className='font-bold text-amber-900'>Critical Action Required: 1 Strategic Contract Expiring in less than 30 days</Typography>
                     <Typography variant='caption' className='text-amber-700'>Global Office Supply Agreement (CT-2026-02) requires renewal negotiation.</Typography>
                  </Box>
                  <Button variant='contained' color='warning' size='small' className='font-bold' onClick={() => setIsDialogOpen(true)}>Initiate Renewal</Button>
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12 }}>
            <Card>
               <CardContent className='flex flex-wrap gap-6 items-end p-6 border-be'>
                  <Box className='flex flex-col gap-1.5'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-500'>Legal Status</Typography>
                    <TextField select size='small' defaultValue='all' sx={{ width: 180 }}>
                       <MenuItem value='all'>All Records</MenuItem>
                       <MenuItem value='active'>Active MSA</MenuItem>
                       <MenuItem value='expired'>Expired</MenuItem>
                    </TextField>
                  </Box>
                  <Box className='flex flex-col gap-1.5'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-500'>Contractor Search</Typography>
                    <TextField size='small' placeholder='Company name or Ref...' sx={{ width: 280 }} />
                  </Box>
               </CardContent>

               <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='text-left bg-slate-50 border-be'>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Contract Ref</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Counterparty Entity</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Agreement Scope</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Est. Value</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Lifecycle</th>
                        <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Status</th>
                        <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((row, i) => (
                        <tr key={i} className='border-be last:border-0 hover:bg-slate-50 transition-colors'>
                          <td className='p-4 text-sm font-black text-primary underline cursor-pointer'>
                             <Link href={`/3m/partners/contracts/${row.id}`}>
                                {row.id}
                             </Link>
                          </td>
                          <td className='p-4 text-sm font-bold text-slate-800'>{row.vendor}</td>
                          <td className='p-4 text-xs font-medium text-slate-500'>{row.type}</td>
                          <td className='p-4 text-sm font-black text-slate-900'>{row.value}</td>
                          <td className='p-4' style={{ width: 140 }}>
                             <Box className='flex flex-col gap-1'>
                                <Box className='flex justify-between items-center'>
                                   <Typography variant='caption' className='font-bold'>{row.progress}%</Typography>
                                   <Typography variant='caption' className='text-[10px] text-slate-400 font-mono'>{row.expiry}</Typography>
                                </Box>
                                <LinearProgress 
                                   variant='determinate' 
                                   value={row.progress} 
                                   color={row.status === 'Expiring' ? 'warning' : row.status === 'Expired' ? 'error' : 'success'} 
                                   sx={{ height: 4, borderRadius: 2 }}
                                />
                             </Box>
                          </td>
                          <td className='p-4 text-center'>
                             <Chip 
                                label={row.status} 
                                size='small' 
                                variant='tonal' 
                                color={row.status === 'Active' ? 'success' : row.status === 'Expiring' ? 'warning' : 'error'} 
                                className='font-black'
                             />
                          </td>
                          <td className='p-4 text-center'>
                             <IconButton size='small'><i className='tabler-edit text-slate-400' /></IconButton>
                             <IconButton size='small' color='secondary'><i className='tabler-paperclip text-slate-400' /></IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </Card>
         </Grid2>
      </Grid2>

      <UploadContractDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default ContractManagementView
