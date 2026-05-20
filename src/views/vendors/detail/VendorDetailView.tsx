'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'

import PageHeader from '@/components/layout/shared/PageHeader'

const VendorDetailView = ({ id }: { id: string }) => {
  return (
    <>
      <PageHeader
        title='Vendor Profile'
        description='Manage procurement contracts, lead times, and bidding history with this supplier'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Supplier Hub' },
          { label: 'Vendor Directory', href: '/partners' },
          { label: 'Profile' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button variant='outlined' color='secondary' startIcon={<i className='tabler-file-invoice' />}>
              Send PO
            </Button>
            <Button variant='contained' startIcon={<i className='tabler-edit' />}>
              Edit Vendor
            </Button>
          </Stack>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
        {/* Contact info */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-t-4 border-t-secondary shadow-sm'>
            <CardContent className='flex flex-col items-center p-8'>
              <Avatar variant='rounded' sx={{ width: 100, height: 100, mb: 4, bgcolor: 'secondary.light', color: 'secondary.main', fontSize: '2rem', fontStyle: 'italic', fontWeight: 'black', border: '1px solid', borderColor: 'secondary.main' }}>
                T
              </Avatar>
              <Typography variant='h5' className='mb-1 text-center font-black text-slate-800 tracking-tight'>Tech Solutions Inc</Typography>
              <Chip label='CONTRACTED PARTNER' color='secondary' variant='tonal' size='small' className='mb-6 font-black tracking-wide' />
              
              <Divider className='w-full mb-6' />

              <Box className='w-full'>
                <Stack spacing={5}>
                  <Box className='flex flex-col gap-1.5'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-500'>Strategic Account Lead</Typography>
                    <Box className='flex items-center gap-2'>
                        <Avatar sx={{ width: 20, height: 20, fontSize: '0.6rem' }}>JS</Avatar>
                        <Typography variant='body1' className='font-bold text-slate-900'>John Smith</Typography>
                    </Box>
                  </Box>
                  <Box className='flex flex-col gap-1.5'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-500'>Direct Communication</Typography>
                    <Box className='flex items-center gap-2 text-slate-600'>
                        <i className='tabler-mail-filled text-secondary' />
                        <Typography variant='body1' className='font-bold underline'>john@techsolutions.com</Typography>
                    </Box>
                  </Box>
                  <Box className='flex flex-col gap-1.5'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-500'>Global Registered Office</Typography>
                    <Box className='flex gap-2 items-start'>
                        <i className='tabler-map-pin-filled text-slate-300 mt-1' />
                        <Typography variant='body2' className='text-slate-600 leading-relaxed font-medium'>
                          123 Tech Park, Innovation St, <br/>Silicon Valley, CA 94025
                        </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Transaction history */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <Box className='p-6 border-be flex justify-between items-center'>
              <Typography variant='h6' className='font-semibold'>Recent Procurement Activity</Typography>
              <Button size='small' variant='tonal'>Export Activity</Button>
            </Box>
            <CardContent className='p-0'>
              <table className='w-full'>
                <thead className='bg-slate-50 border-be'>
                  <tr className='text-left'>
                    <th className='p-4 text-xs uppercase font-bold text-slate-500'>Date</th>
                    <th className='p-4 text-xs uppercase font-bold text-slate-500'>Record Type</th>
                    <th className='p-4 text-xs uppercase font-bold text-slate-500'>Reference No.</th>
                    <th className='p-4 text-xs uppercase font-bold text-slate-500'>Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2026-04-10', type: 'Goods Receipt', ref: 'GR-2026-001', status: 'Received' },
                    { date: '2026-03-25', type: 'Purchase Order', ref: 'PO-2026-992', status: 'Completed' },
                    { date: '2026-03-01', type: 'Goods Receipt', ref: 'GR-2026-000', status: 'Cancelled' }
                  ].map((row, i) => (
                    <tr key={i} className='border-be hover:bg-slate-50'>
                      <td className='p-4 text-sm text-slate-600'>{row.date}</td>
                      <td className='p-4 text-sm font-medium text-slate-800'>{row.type}</td>
                      <td className='p-4 text-sm font-bold text-primary'>{row.ref}</td>
                      <td className='p-4'>
                        <Chip label={row.status} size='small' variant='tonal' color={row.status === 'Cancelled' ? 'error' : row.status === 'Completed' ? 'success' : 'primary'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default VendorDetailView
