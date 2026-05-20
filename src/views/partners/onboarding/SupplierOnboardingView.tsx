'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'
import AddOnboardingDialog from './AddOnboardingDialog'

const onboardingVendors = [
  { id: 'ONB-7721', name: 'Alibaba Cloud Services', category: 'IT Infrastructure', docs: 'Verified', score: 92, status: 'Under Review', appliedDate: '2026-04-10' },
  { id: 'ONB-7722', name: 'Logistics Pro Vietnam', category: 'Transportation', docs: 'Pending', score: 85, status: 'Pending', appliedDate: '2026-04-15' },
  { id: 'ONB-7723', name: 'Steel Core Ltd', category: 'Raw Materials', docs: 'Verified', score: 78, status: 'Approved', appliedDate: '2026-04-01' },
  { id: 'ONB-7724', name: 'Global Stationery', category: 'Office Supplies', docs: 'Rejected', score: 45, status: 'Rejected', appliedDate: '2026-04-18' }
]

const SupplierOnboardingView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <PageHeader
        title='Global Supplier Onboarding'
        description='Streamlined verification workflow for new supplier entities with automated KYC and trust scoring'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Strategic Sourcing' }, { label: 'Supplier Onboarding' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-user-plus' />} onClick={() => setIsDialogOpen(true)}>Initiate Onboarding</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
        {/* Onboarding Stats */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-t-4 border-t-primary shadow-sm'>
            <CardContent className='flex justify-around items-center py-6'>
               <Box className='text-center'>
                  <Typography variant='h4' className='font-bold text-primary'>12</Typography>
                  <Typography variant='body2' className='text-slate-500 uppercase font-bold tracking-wider mt-1'>Pending Reviews</Typography>
               </Box>
               <Box sx={{ width: 1, height: 40, borderRight: '1px solid', borderColor: 'divider' }} />
               <Box className='text-center'>
                  <Typography variant='h4' className='font-bold text-info'>8</Typography>
                  <Typography variant='body2' className='text-slate-500 uppercase font-bold tracking-wider mt-1'>Verified This Month</Typography>
               </Box>
               <Box sx={{ width: 1, height: 40, borderRight: '1px solid', borderColor: 'divider' }} />
               <Box className='text-center'>
                  <Typography variant='h4' className='font-bold text-warning'>3</Typography>
                  <Typography variant='body2' className='text-slate-500 uppercase font-bold tracking-wider mt-1'>Action Required</Typography>
               </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-wrap gap-6 items-end p-6 bg-slate-50/50'>
              <Box className='flex flex-col gap-1.5'>
                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Screening Filter</Typography>
                <TextField select size='small' defaultValue='all' sx={{ width: 200 }}>
                   <MenuItem value='all'>All Applications</MenuItem>
                   <MenuItem value='pending'>Pending KYC</MenuItem>
                   <MenuItem value='review'>In Review</MenuItem>
                </TextField>
              </Box>
              <Box className='flex flex-col gap-1.5'>
                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Search Vendor</Typography>
                <TextField size='small' placeholder='Vendor name or ID...' sx={{ width: 250 }} />
              </Box>
            </CardContent>

            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='border-be'>
                  <tr className='text-left bg-slate-50'>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Application ID</th>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Vendor Name</th>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600 border-x'>Category</th>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>KYC Docs</th>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Reliability</th>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Status</th>
                    <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {onboardingVendors.map((row, i) => (
                    <tr key={i} className='border-be hover:bg-slate-50/50'>
                      <td className='p-4 text-sm font-mono font-bold text-slate-400'>#{row.id}</td>
                      <td className='p-4'>
                        <Box className='flex items-center gap-3'>
                           <Avatar sx={{ width: 30, height: 30, fontSize: '0.8rem', bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 'bold' }}>{row.name[0]}</Avatar>
                           <Typography variant='body2' className='font-bold text-slate-800'>{row.name}</Typography>
                        </Box>
                      </td>
                      <td className='p-4 text-sm font-medium text-slate-600 border-x'>{row.category}</td>
                      <td className='p-4 text-center'>
                         <Chip 
                           label={row.docs} 
                           size='small' 
                           variant='outlined' 
                           color={row.docs === 'Verified' ? 'success' : row.docs === 'Pending' ? 'warning' : 'error'} 
                           className='font-bold'
                        />
                      </td>
                      <td className='p-4 text-center'>
                         <Typography variant='body2' className='font-black' color={row.score > 80 ? 'success.main' : 'warning.main'}>{row.score}%</Typography>
                      </td>
                      <td className='p-4 text-center'>
                         <Chip 
                           label={row.status} 
                           size='small' 
                           variant='tonal' 
                           color={row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : row.status === 'Under Review' ? 'info' : 'error'} 
                           className='font-black'
                        />
                      </td>
                      <td className='p-4 text-center'>
                         <Button 
                           variant='text' 
                           size='small' 
                           className='font-bold'
                           component={Link}
                           href={`/3m/partners/onboarding/${row.id}`}
                         >
                           Review
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

      <AddOnboardingDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default SupplierOnboardingView
