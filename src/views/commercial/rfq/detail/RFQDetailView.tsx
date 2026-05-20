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
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import PageHeader from '@/components/layout/shared/PageHeader'

const RFQDetailView = ({ id }: { id: string }) => {
  const rfqData = {
    id: id || 'RFQ-2026-001',
    title: 'New High-End Workstations for Design Team',
    status: 'Bidding',
    priority: 'High',
    createdDate: '2026-04-16',
    expiryDate: '2026-04-30',
    description: 'Procurement of 12 units of high-performance workstations for the Creative Department.',
    items: [
      { name: 'Workstation Z4 G5', qty: 12, unit: 'Units' },
      { name: 'Monitor 32" 4K', qty: 24, unit: 'Units' }
    ],
    bids: [
      { vendor: 'Tech Solutions Inc', price: '$48,000', leadTime: '5 Days', status: 'Best Value', color: 'success', rating: 4.8 },
      { vendor: 'Global Office Systems', price: '$52,500', leadTime: '3 Days', status: 'Fastest', color: 'info', rating: 4.2 },
      { vendor: 'Enterprise Gear', price: '$46,200', leadTime: '14 Days', status: 'Lowest Price', color: 'warning', rating: 3.5 }
    ]
  }

  return (
    <>
      <PageHeader
        title={`RFQ Detail: ${rfqData.id}`}
        description={rfqData.title}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Requests for Quotation', href: '/commercial/rfq' }, { label: 'Detail' }]}
        actions={
          <Box className='flex gap-2'>
            <Button variant='outlined' color='secondary' startIcon={<i className='tabler-edit' />}>Edit RFQ</Button>
            <Button variant='contained' color='primary' startIcon={<i className='tabler-send' />}>Nudge Vendors</Button>
          </Box>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
        {/* RFQ Info */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
            <Card className='shadow-md border-t-4 border-t-primary'>
                <CardContent className='flex flex-col gap-6'>
                    <Box className='flex justify-between items-center'>
                        <Typography variant='h6' className='font-bold'>General Specifications</Typography>
                        <Chip label={rfqData.status} color='info' variant='tonal' className='font-bold' />
                    </Box>
                    
                    <Grid2 container spacing={4}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                             <Box className='flex flex-col gap-1'>
                                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Priority Level</Typography>
                                <Typography variant='body1' className='font-bold'>{rfqData.priority}</Typography>
                             </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                             <Box className='flex flex-col gap-1'>
                                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Submission Deadline</Typography>
                                <Typography variant='body1' className='font-bold text-error'>{rfqData.expiryDate}</Typography>
                             </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                             <Box className='flex flex-col gap-1'>
                                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Internal Description</Typography>
                                <Typography variant='body2' className='text-slate-700 leading-relaxed'>{rfqData.description}</Typography>
                             </Box>
                        </Grid2>
                    </Grid2>

                    <Box>
                        <Typography variant='subtitle2' className='font-bold mb-3'>Required Items</Typography>
                        <TableContainer className='border rounded overflow-hidden'>
                            <Table size='small'>
                                <TableHead className='bg-slate-50'>
                                    <TableRow>
                                        <TableCell className='font-bold'>Item Name</TableCell>
                                        <TableCell align='right' className='font-bold'>Quantity</TableCell>
                                        <TableCell className='font-bold'>Unit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rfqData.items.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell className='font-medium'>{item.name}</TableCell>
                                            <TableCell align='right' className='font-bold'>{item.qty}</TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </CardContent>
            </Card>
        </Grid2>

        {/* Bidding Summary Card */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
           <Card className='h-full'>
              <CardContent className='flex flex-col gap-6 h-full'>
                 <Typography variant='h6' className='font-bold'>Bidding Lifecycle</Typography>
                 
                 <Box className='flex flex-col gap-2'>
                    <Box className='flex justify-between items-center'>
                        <Typography variant='body2' className='font-bold'>Vendor Responses</Typography>
                        <Typography variant='body2' className='font-bold'>3 / 10</Typography>
                    </Box>
                    <LinearProgress variant='determinate' value={30} sx={{ height: 8, borderRadius: 5 }} />
                 </Box>

                 <Box className='mt-auto flex flex-col gap-3'>
                    <Typography variant='caption' className='text-slate-500 text-center italic'>
                        Evaluation Phase: Analysis of received quotes based on price, delivery, and vendor rating.
                    </Typography>
                    <Button fullWidth variant='tonal' disabled>Analyze Market Trend</Button>
                 </Box>
              </CardContent>
           </Card>
        </Grid2>

        {/* Bidding Comparison Matrix */}
        <Grid2 size={{ xs: 12 }}>
            <Card>
                <CardHeader 
                    title='Sourcing Comparison Matrix' 
                    subheader='Side-by-side analysis of vendor submissions'
                    action={<Button size='small' variant='tonal' color='secondary' startIcon={<i className='tabler-file-analytics' />}>Export Comparison</Button>}
                />
                <CardContent className='p-0'>
                    <TableContainer>
                        <Table>
                            <TableHead className='bg-slate-50 border-be'>
                                <TableRow>
                                    <th className='p-4 text-left text-[11px] uppercase font-bold text-slate-600'>Vendor Name</th>
                                    <th className='p-4 text-left text-[11px] uppercase font-bold text-slate-600'>Rating</th>
                                    <th className='p-4 text-left text-[11px] uppercase font-bold text-slate-600'>Quote Price</th>
                                    <th className='p-4 text-left text-[11px] uppercase font-bold text-slate-600'>Lead Time</th>
                                    <th className='p-4 text-left text-[11px] uppercase font-bold text-slate-600'>System Analysis</th>
                                    <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Decision</th>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rfqData.bids.map((bid, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell className='p-4'>
                                            <Box className='flex items-center gap-3'>
                                                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', fontWeight: 'bold' }}>{bid.vendor[0]}</Avatar>
                                                <Typography variant='body2' className='font-bold text-slate-800'>{bid.vendor}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell className='p-4'><Chip label={`${bid.rating} ★`} size='small' variant='tonal' className='font-bold' /></TableCell>
                                        <TableCell className='p-4 text-sm font-bold text-slate-900'>{bid.price}</TableCell>
                                        <TableCell className='p-4 text-sm font-medium'>{bid.leadTime}</TableCell>
                                        <TableCell className='p-4'>
                                            <Chip label={bid.status} color={bid.color as any} size='small' variant='tonal' className='font-bold' />
                                        </TableCell>
                                        <TableCell className='p-4' align='center'>
                                            <Button variant='tonal' size='small' color={bid.color === 'success' ? 'success' : 'secondary'} className='font-bold'>
                                                Award Order
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default RFQDetailView
