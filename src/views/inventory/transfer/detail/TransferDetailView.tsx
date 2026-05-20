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

import PageHeader from '@/components/layout/shared/PageHeader'

const TransferDetailView = ({ id }: { id: string }) => {
  return (
    <>
      <PageHeader
        title={`Transfer Order: ${id}`}
        description='Detailed log of internal inventory movement between warehouses'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Inventory', href: '/inventory/transfer' },
          { label: 'Transfer Detail' }
        ]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-printer' />}>
            Print Manifest
          </Button>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-l-4 border-l-info shadow-sm'>
            <CardContent className='p-6'>
              <Typography variant='subtitle2' className='uppercase font-bold text-slate-400 mb-6'>Logistics Route</Typography>
              <Stack spacing={4}>
                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-teal-600'>Starting Point (Source)</Typography>
                  <Box className='flex items-center gap-2'>
                    <i className='tabler-building-warehouse text-slate-400' />
                    <Typography variant='body1' className='font-bold text-slate-800'>Main Warehouse</Typography>
                  </Box>
                  <Typography variant='caption' className='font-medium text-slate-400 ml-6'>Location: Aisle 4, Zone A</Typography>
                </Box>
                
                <Box className='relative py-2'>
                    <Divider orientation="vertical" flexItem sx={{ position: 'absolute', left: 11, top: -10, bottom: -10, height: 40, borderStyle: 'dashed' }} />
                    <i className='tabler-truck-delivery text-2xl text-info bg-white z-10 relative ml-[1px]' />
                </Box>

                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-indigo-600'>Destination Endpoint</Typography>
                  <Box className='flex items-center gap-2'>
                    <i className='tabler-map-pin text-slate-400' />
                    <Typography variant='body1' className='font-bold text-slate-800'>North Branch Facility</Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Movement Status</Typography>
                  <Chip label='Shipment Arrived' color='success' variant='tonal' size='small' className='font-bold w-fit icon-sm' icon={<i className='tabler-check' />} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant='h6' className='mb-4'>Transferred Items</Typography>
              <table className='w-full'>
                <thead className='bg-slate-50 border-be'>
                  <tr className='text-left'>
                    <th className='p-3 text-xs uppercase'>Item</th>
                    <th className='p-3 text-xs uppercase'>Qty Moved</th>
                    <th className='p-3 text-xs uppercase'>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Wireless Mouse M1', qty: 10, cond: 'Good' },
                    { name: 'Mechanical Keyboard K3', qty: 5, cond: 'Good' }
                  ].map((item, i) => (
                    <tr key={i} className='border-be hover:bg-slate-50'>
                      <td className='p-3'><Typography variant='body2' className='font-medium'>{item.name}</Typography></td>
                      <td className='p-3 text-sm'>{item.qty} units</td>
                      <td className='p-3'><Chip label={item.cond} size='small' color='success' variant='outlined' /></td>
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

export default TransferDetailView
