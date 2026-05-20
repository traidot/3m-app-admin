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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Stack from '@mui/material/Stack'

import PageHeader from '@/components/layout/shared/PageHeader'

const PODetailView = ({ id }: { id: string }) => {
  const poData = {
    id: id || 'PO-2026-045',
    vendor: 'Tech Solutions Inc',
    vendorEmail: 'sales@techsolutions.com',
    date: '2026-04-10',
    deliveryDate: '2026-04-25',
    status: 'Approved',
    paymentTerms: 'Net 30',
    shippingMethod: 'Expedited Air',
    items: [
      { sku: 'IT-SRV-001', name: 'Dell PowerEdge R750', qty: 2, price: '$8,500', total: '$17,000' },
      { sku: 'IT-SW-002', name: 'Cisco 9300 Switch', qty: 4, price: '$3,200', total: '$12,800' },
      { sku: 'IT-MNT-003', name: 'UPS Admin 3000VA', qty: 1, price: '$1,200', total: '$1,200' }
    ],
    subtotal: '$31,000',
    tax: '$3,100',
    grandTotal: '$34,100'
  }

  return (
    <>
      <PageHeader
        title={`Purchase Order: ${poData.id}`}
        description={`Supply contract authorized for ${poData.vendor}`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Purchase Orders (PO)', href: '/commercial/po' }, { label: 'Detail' }]}
        actions={
          <Box className='flex gap-2'>
            <Button variant='outlined' color='secondary' startIcon={<i className='tabler-printer' />}>Print PO</Button>
            <Button variant='contained' color='primary' startIcon={<i className='tabler-send' />}>Email to Vendor</Button>
          </Box>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
         {/* Vendor & Terms Info */}
         <Grid2 size={{ xs: 12, md: 4 }}>
            <Card className='h-full'>
                <CardHeader title='Supplier & Billing' />
                <CardContent className='flex flex-col gap-6'>
                    <Box className='flex items-center gap-3'>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold' }}>T</Avatar>
                        <Box>
                            <Typography variant='body1' className='font-bold text-slate-800'>{poData.vendor}</Typography>
                            <Typography variant='caption'>{poData.vendorEmail}</Typography>
                        </Box>
                    </Box>
                    <Divider />
                    <Stack spacing={4}>
                        <Box className='flex flex-col gap-1'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Payment Terms</Typography>
                            <Typography variant='body2' className='font-bold text-slate-800'>{poData.paymentTerms}</Typography>
                        </Box>
                        <Box className='flex flex-col gap-1'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Order Status</Typography>
                            <Chip label={poData.status} size='small' variant='tonal' color='success' className='font-bold' sx={{ alignSelf: 'flex-start' }} />
                        </Box>
                        <Box className='flex flex-col gap-1'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Fulfillment Date</Typography>
                            <Typography variant='body2' className='font-bold text-slate-800'>{poData.deliveryDate}</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
         </Grid2>

         {/* PO Line Items */}
         <Grid2 size={{ xs: 12, md: 8 }}>
            <Card>
                <CardHeader title='Ordered Line Items' />
                <CardContent className='p-0'>
                    <TableContainer>
                        <Table>
                            <TableHead className='bg-slate-50'>
                                <TableRow>
                                    <TableCell className='text-[11px] uppercase font-bold text-slate-600'>Material / SKU</TableCell>
                                    <TableCell align='center' className='text-[11px] uppercase font-bold text-slate-600'>Qty</TableCell>
                                    <TableCell align='right' className='text-[11px] uppercase font-bold text-slate-600'>Unit Price</TableCell>
                                    <TableCell align='right' className='text-[11px] uppercase font-bold text-slate-600'>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {poData.items.map((item, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell>
                                            <Typography variant='body2' className='font-bold text-slate-800'>{item.name}</Typography>
                                            <Typography variant='caption' className='font-medium'>{item.sku}</Typography>
                                        </TableCell>
                                        <TableCell align='center' className='font-bold'>{item.qty}</TableCell>
                                        <TableCell align='right' className='font-medium'>{item.price}</TableCell>
                                        <TableCell align='right' className='font-bold text-primary'>{item.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                <Divider />
                <CardContent className='flex flex-col items-end gap-2 p-6'>
                    <Box className='flex justify-between w-full max-w-[200px]'>
                        <Typography variant='body2' className='font-medium text-slate-500'>Subtotal:</Typography>
                        <Typography variant='body2' className='font-bold text-slate-800'>{poData.subtotal}</Typography>
                    </Box>
                    <Box className='flex justify-between w-full max-w-[200px]'>
                        <Typography variant='body2' className='font-medium text-slate-500'>Tax (10%):</Typography>
                        <Typography variant='body2' className='font-bold text-slate-800'>{poData.tax}</Typography>
                    </Box>
                    <Box className='flex justify-between w-full max-w-[200px] mt-2'>
                        <Typography variant='h6' className='font-bold'>Grand Total:</Typography>
                        <Typography variant='h6' className='font-bold text-primary'>{poData.grandTotal}</Typography>
                    </Box>
                </CardContent>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default PODetailView
