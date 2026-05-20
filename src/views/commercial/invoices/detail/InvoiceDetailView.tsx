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
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import PageHeader from '@/components/layout/shared/PageHeader'

const InvoiceDetailView = ({ id }: { id: string }) => {
  const invData = {
    id: id || 'INV-2026-882',
    vendor: 'Furniture Co',
    poRef: 'PO-2026-002',
    grRef: 'GR-2026-002',
    date: '2026-04-14',
    dueDate: '2026-05-14',
    status: 'Discrepancy',
    amount: '$4,200',
    items: [
      { name: 'Executive Office Chair', qty: 10, unitPrice: '$420', poPrice: '$400', status: 'Variance' }
    ]
  }

  return (
    <>
      <PageHeader
        title={`Supplier Invoice: ${invData.id}`}
        description='Detailed 3-way match analysis and payment scheduling'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Supplier Invoices', href: '/commercial/invoices' }, { label: 'Detail' }]}
        actions={
            <Box className='flex gap-2'>
              <Button variant='tonal' color='error'>Flag Dispute</Button>
              <Button variant='contained' color='primary'>Authorize Payment</Button>
            </Box>
          }
      />

      <Grid2 container spacing={6} className='mt-6'>
         {/* Discrepancy Alert */}
         <Grid2 size={{ xs: 12 }}>
            <Alert 
               severity="error" 
               variant='filled'
               icon={<i className='tabler-alert-triangle' />}
               action={<Button color="inherit" size="small">Resolution Guide</Button>}
            >
               <Typography variant='body2' color='inherit' className='font-bold'>3-Way Match Failed: Price Discrepancy Found</Typography>
               <Typography variant='caption' color='inherit'>The unit price on this invoice ($420) does not match the authorized PO price ($400). Please verify with procurement manager.</Typography>
            </Alert>
         </Grid2>

         {/* Matching Logic Overview */}
         <Grid2 size={{ xs: 12, md: 4 }}>
            <Card className='h-full shadow-md border-t-4 border-t-error'>
                <CardHeader title='3-Way Match Status' />
                <CardContent className='flex flex-col gap-6'>
                    <Box className='flex items-center justify-between'>
                        <Typography variant='body2' className='font-bold'>Purchase Order (PO)</Typography>
                        <Chip label='Verified' color='success' size='small' variant='tonal' />
                    </Box>
                    <Box className='flex items-center justify-between'>
                        <Typography variant='body2' className='font-bold'>Goods Receipt (GRN)</Typography>
                        <Chip label='Verified' color='success' size='small' variant='tonal' />
                    </Box>
                    <Box className='flex items-center justify-between'>
                        <Typography variant='body2' className='font-bold'>Supplier Invoice</Typography>
                        <Chip label='Price Conflict' color='error' size='small' variant='tonal' />
                    </Box>
                    <Divider />
                    <Stack spacing={4}>
                        <Box className='flex flex-col gap-1'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Vendor</Typography>
                            <Typography variant='body2' className='font-bold'>{invData.vendor}</Typography>
                        </Box>
                        <Box className='flex flex-col gap-1'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Payment Due</Typography>
                            <Typography variant='body2' className='font-bold text-error'>{invData.dueDate}</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
         </Grid2>

         {/* Item Comparison */}
         <Grid2 size={{ xs: 12, md: 8 }}>
            <Card>
                <CardHeader title='Line Item Reconciliation' />
                <CardContent className='p-0'>
                    <TableContainer>
                        <Table>
                            <TableHead className='bg-slate-50'>
                                <TableRow>
                                    <TableCell className='text-[11px] uppercase font-bold'>Description</TableCell>
                                    <TableCell align='center' className='text-[11px] uppercase font-bold'>Qty</TableCell>
                                    <TableCell align='right' className='text-[11px] uppercase font-bold'>PO Price</TableCell>
                                    <TableCell align='right' className='text-[11px] uppercase font-bold'>INV Price</TableCell>
                                    <TableCell align='center' className='text-[11px] uppercase font-bold'>Match</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invData.items.map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Typography variant='body2' className='font-bold'>{item.name}</Typography></TableCell>
                                        <TableCell align='center' className='font-medium'>{item.qty}</TableCell>
                                        <TableCell align='right' className='font-medium'>{item.poPrice}</TableCell>
                                        <TableCell align='right' className='font-bold text-error'>{item.unitPrice}</TableCell>
                                        <TableCell align='center'>
                                            <i className='tabler-x text-error text-xl' />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                <Divider />
                <CardContent className='flex justify-end p-6'>
                    <Box className='flex flex-col gap-2 w-full max-w-[240px]'>
                        <Box className='flex justify-between'>
                            <Typography variant='body2' className='font-medium text-slate-500'>Gross Total:</Typography>
                            <Typography variant='body2' className='font-bold'>{invData.amount}</Typography>
                        </Box>
                        <Box className='flex justify-between'>
                            <Typography variant='body2' className='font-medium text-slate-500'>Taxes:</Typography>
                            <Typography variant='body2' className='font-bold'>$420</Typography>
                        </Box>
                        <Box className='flex justify-between border-t pt-2'>
                            <Typography variant='h6' className='font-bold'>Payable:</Typography>
                            <Typography variant='h6' className='font-bold text-primary'>$4,620</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default InvoiceDetailView
