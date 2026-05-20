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

const ReceiptDetailView = ({ id }: { id: string }) => {
  return (
    <>
      <PageHeader
        title={`Goods Receipt: ${id}`}
        description='Manage shipment receiving, quality control and stock injection into master records'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Logistics & Inbound', href: '/operations/inbound' },
          { label: 'Receipt Detail' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button variant='outlined' color='secondary' startIcon={<i className='tabler-printer' />}>
              Print Labels
            </Button>
            <Button variant='contained' color='success' startIcon={<i className='tabler-check' />}>
              Accept All Items
            </Button>
          </Stack>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
        {/* Info Card */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-t-4 border-t-success box-shadow-md'>
            <CardContent className='flex flex-col gap-6'>
              <Typography variant='h6' className='font-bold text-slate-800 flex items-center gap-2'>
                <i className='tabler-truck text-success' /> Shipment Logistics
              </Typography>
              
              <Box className='flex flex-col gap-1'>
                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Primary Supplier</Typography>
                <Typography variant='body1' className='font-bold text-slate-900'>Tech Solutions Inc</Typography>
              </Box>

              <Box className='flex flex-col gap-1'>
                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Estimated Arrival</Typography>
                <Typography variant='body1' className='font-bold text-slate-800'>2026-04-20</Typography>
              </Box>

              <Box className='flex flex-col gap-1'>
                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Destination Warehouse</Typography>
                <Box className='flex items-center gap-2'>
                   <i className='tabler-building-warehouse text-slate-400' />
                   <Typography variant='body1' className='font-bold text-slate-800'>Main Warehouse (Zone A)</Typography>
                </Box>
              </Box>

              <Divider />

              <Box className='flex flex-col gap-2'>
                <Typography variant='caption' className='uppercase font-bold text-slate-500 tracking-wider'>Status</Typography>
                <Box>
                  <Chip label='Scheduled for Receiving' color='info' variant='tonal' size='small' className='font-bold' />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Items List */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <Box className='p-6 border-be flex items-center justify-between'>
               <Typography variant='h6' className='font-bold text-slate-800'>Expected Line Items</Typography>
               <Typography variant='caption' className='font-medium text-slate-500'>2 ITEMS PENDING INSPECTION</Typography>
            </Box>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-slate-50/80 border-be'>
                  <tr className='text-left'>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Material / Item</th>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Ordered</th>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Received</th>
                    <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Wireless Mouse M1', expected: '50 PCS', received: '0', status: 'Pending' },
                    { name: 'Mechanical Keyboard K3', expected: '20 PCS', received: '0', status: 'Pending' }
                  ].map((item, i) => (
                    <tr key={i} className='border-be hover:bg-slate-50 transition-colors'>
                      <td className='p-4'>
                        <Typography variant='body2' className='font-bold text-primary'>{item.name}</Typography>
                        <Typography variant='caption' className='text-slate-500 font-medium'>ELC-WM1-BLK</Typography>
                      </td>
                      <td className='p-4'>
                         <Typography variant='body2' className='font-mono font-bold text-slate-700'>{item.expected}</Typography>
                      </td>
                      <td className='p-4'>
                         <Typography variant='body2' className='font-mono font-bold text-slate-400'>{item.received}</Typography>
                      </td>
                      <td className='p-4'>
                        <Chip label={item.status} size='small' variant='tonal' color='secondary' className='font-bold' />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CardContent className='bg-slate-50/30 p-4'>
               <Typography variant='caption' className='text-slate-500 italic'>* All discrepancies must be logged via standard QC flow before final stock injection.</Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default ReceiptDetailView
