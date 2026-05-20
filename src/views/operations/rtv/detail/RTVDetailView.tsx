'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import PageHeader from '@/components/layout/shared/PageHeader'

const RTVDetailView = ({ id }: { id: string }) => {
  const rtvData = {
    id: id || 'RTV-2026-002',
    vendor: 'Furniture Co',
    grRef: 'GR-2026-002',
    date: '2026-04-19',
    reason: 'Damaged during transit / Quality failure (Cracked frames)',
    status: 'In Transit',
    logistics: 'DHL Express',
    tracking: 'DHL-RT-998811',
    items: [
       { name: 'Executive Office Chair (Walnut)', qty: 5, unit: 'Units', reason: 'Structural Damage' }
    ]
  }

  return (
    <>
      <PageHeader
        title={`Return to Vendor: ${rtvData.id}`}
        description='Manage RMA and logistics for defective material returns'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Logistics & Inbound' }, { label: 'Purchase Returns (RTV)', href: '/operations/returns' }, { label: 'RTV Detail' }]}
        actions={
            <Box className='flex gap-2'>
              <Button variant='outlined' color='secondary' startIcon={<i className='tabler-printer' />}>Print Label</Button>
              <Button variant='contained' color='primary' startIcon={<i className='tabler-truck' />}>Track Shipment</Button>
            </Box>
          }
      />

      <Grid2 container spacing={6} className='mt-6'>
         {/* Return Reason & Logistics */}
         <Grid2 size={{ xs: 12, md: 4 }}>
            <Card className='h-full shadow-md border-t-4 border-t-error'>
                <CardHeader title='Return Case Overview' titleTypographyProps={{ className: 'font-bold' }} />
                <CardContent className='flex flex-col gap-6'>
                    <Box className='flex flex-col gap-1'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Vendor Name</Typography>
                        <Box className='flex items-center gap-2'>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>F</Avatar>
                            <Typography variant='body2' className='font-bold'>{rtvData.vendor}</Typography>
                        </Box>
                    </Box>
                    <Box className='flex flex-col gap-1'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Original Receipt</Typography>
                        <Typography variant='body2' className='font-bold text-primary'>{rtvData.grRef}</Typography>
                    </Box>
                    <Divider />
                    <Box className='flex flex-col gap-1 text-error'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-400'>Reason for Return</Typography>
                        <Typography variant='body2' className='font-bold'>{rtvData.reason}</Typography>
                    </Box>
                    <Box className='flex flex-col gap-1'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Tracking Number</Typography>
                        <Typography variant='body2' className='font-bold text-slate-800'>{rtvData.tracking}</Typography>
                        <Typography variant='caption' className='text-slate-400 font-medium'>Carrier: {rtvData.logistics}</Typography>
                    </Box>
                </CardContent>
            </Card>
         </Grid2>

         {/* Return Items */}
         <Grid2 size={{ xs: 12, md: 8 }}>
            <Card>
                <CardHeader title='Returned Material List' />
                <CardContent className='p-0'>
                    <TableContainer>
                        <Table>
                            <TableHead className='bg-slate-50'>
                                <TableRow>
                                    <TableCell className='text-[11px] uppercase font-bold text-slate-600'>Material Detail</TableCell>
                                    <TableCell align='center' className='text-[11px] uppercase font-bold text-slate-600'>Return Qty</TableCell>
                                    <TableCell className='text-[11px] uppercase font-bold text-slate-600'>Failure Reason</TableCell>
                                    <TableCell align='center' className='text-[11px] uppercase font-bold text-slate-600'>Replacement</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rtvData.items.map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Typography variant='body2' className='font-bold'>{item.name}</Typography></TableCell>
                                        <TableCell align='center' className='font-bold text-error'>{item.qty} {item.unit}</TableCell>
                                        <TableCell><Typography variant='caption' className='font-medium'>{item.reason}</Typography></TableCell>
                                        <TableCell align='center'><Chip label='Requested' size='small' variant='tonal' color='info' /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Box className='mt-6 p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center justify-between'>
                <Box className='flex items-center gap-4'>
                    <Avatar variant='rounded' sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                        <i className='tabler-camera' />
                    </Avatar>
                    <Box>
                        <Typography variant='body2' className='font-bold'>Inspection Proof Attached</Typography>
                        <Typography variant='caption'>3 high-resolution photos of damaged frames</Typography>
                    </Box>
                </Box>
                <Button variant='tonal' size='small'>View Media</Button>
            </Box>
         </Grid2>
      </Grid2>
    </>
  )
}

export default RTVDetailView
