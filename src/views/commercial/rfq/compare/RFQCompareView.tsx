'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'

import PageHeader from '@/components/layout/shared/PageHeader'

const RFQCompareView = ({ id }: { id: string }) => {
  const rfqTitle = 'Networking Infrastructure Q3 Expand'
  const bids = [
    { vendor: 'Tech Solutions Inc', total: '$12,500', leadTime: '5 Days', score: 92, bestPrice: true, fastest: true },
    { vendor: 'Global Office Supply', total: '$13,200', leadTime: '10 Days', score: 85, bestPrice: false, fastest: false },
    { vendor: 'Network Masters', total: '$14,000', leadTime: '7 Days', score: 95, bestPrice: false, fastest: false }
  ]

  return (
    <>
      <PageHeader
        title={`Bidding Comparison: ${id || 'RFQ-2026-04'}`}
        description={`Competitive analysis for ${rfqTitle}`}
        breadcrumbs={[
            { label: 'Home', href: '/' }, 
            { label: 'Procurement Ops' }, 
            { label: 'RFQ List', href: '/commercial/rfq' }, 
            { label: 'Comparison' }
        ]}
        actions={
          <Box className='flex gap-2'>
            <Button variant='tonal' color='secondary' startIcon={<i className='tabler-share' />}>Export Comparison</Button>
            <Button variant='contained' color='primary' startIcon={<i className='tabler-check' />}>Select Winner</Button>
          </Box>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12 }}>
            <Card className='border-t-4 border-t-primary shadow-lg overflow-hidden'>
               <CardContent className='p-0'>
                  <table className='w-full text-left'>
                     <thead>
                        <tr className='bg-slate-50 border-be'>
                           <th className='p-6 w-1/4'>
                              <Typography variant='subtitle1' className='font-black'>Criteria Matrix</Typography>
                              <Typography variant='caption' className='text-slate-400 uppercase font-bold tracking-widest'>Evaluation Factor</Typography>
                           </th>
                           {bids.map((bid, i) => (
                              <th key={i} className={`p-6 border-l w-1/4 ${bid.bestPrice ? 'bg-primary/5' : ''}`}>
                                 <Box className='flex flex-col items-center gap-3 text-center'>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>{bid.vendor[0]}</Avatar>
                                    <Box>
                                       <Typography variant='body1' className='font-black text-slate-800 leading-tight'>{bid.vendor}</Typography>
                                       <Typography variant='caption' className='text-slate-400'>Vendor Audit Score: {bid.score}/100</Typography>
                                    </Box>
                                    {bid.bestPrice && <Chip label='RECOMMENDED' size='small' color='primary' className='font-black' />}
                                 </Box>
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        <tr className='border-be'>
                           <td className='p-6 font-bold text-slate-600 bg-slate-50/30'>Total Quote (USD)</td>
                           {bids.map((bid, i) => (
                              <td key={i} className={`p-6 text-center border-l ${bid.bestPrice ? 'bg-primary/5' : ''}`}>
                                 <Typography variant='h5' className={`font-black ${bid.bestPrice ? 'text-primary' : 'text-slate-800'}`}>
                                    {bid.total}
                                 </Typography>
                              </td>
                           ))}
                        </tr>
                        <tr className='border-be'>
                           <td className='p-6 font-bold text-slate-600 bg-slate-50/30'>Estimated Lead Time</td>
                           {bids.map((bid, i) => (
                              <td key={i} className={`p-6 text-center border-l ${bid.bestPrice ? 'bg-primary/5' : ''}`}>
                                 <Typography variant='body1' className={`font-bold ${bid.fastest ? 'text-success' : 'text-slate-700'}`}>
                                    {bid.leadTime}
                                 </Typography>
                                 {bid.fastest && <Typography variant='caption' className='text-success font-bold uppercase'>Fastest</Typography>}
                              </td>
                           ))}
                        </tr>
                        <tr className='border-be'>
                           <td className='p-6 font-bold text-slate-600 bg-slate-50/30'>Warranty Period</td>
                           {bids.map((bid, i) => (
                              <td key={i} className={`p-6 text-center border-l ${bid.bestPrice ? 'bg-primary/5' : ''}`}>
                                 <Typography variant='body2' className='font-medium'>12 Months Standard</Typography>
                              </td>
                           ))}
                        </tr>
                        <tr className='border-be'>
                           <td className='p-6 font-bold text-slate-600 bg-slate-50/30'>Logistics Compliance</td>
                           {bids.map((bid, i) => (
                              <td key={i} className={`p-6 text-center border-l ${bid.bestPrice ? 'bg-primary/5' : ''}`}>
                                 <Chip label='PASS' size='small' color='success' variant='tonal' className='font-black' />
                              </td>
                           ))}
                        </tr>
                        <tr>
                           <td className='p-6 font-bold text-slate-600 bg-slate-50/30'>Action</td>
                           {bids.map((bid, i) => (
                              <td key={i} className={`p-6 text-center border-l ${bid.bestPrice ? 'bg-primary/5' : ''}`}>
                                 <Button variant={bid.bestPrice ? 'contained' : 'outlined'} size='small' className='font-bold'>Select Vendor</Button>
                              </td>
                           ))}
                        </tr>
                     </tbody>
                  </table>
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12 }}>
            <Card className='bg-slate-900 border-none'>
               <CardContent className='flex items-center gap-6 p-8 text-white'>
                  <Box className='bg-primary text-white p-4 rounded-full'>
                     <i className='tabler-brain text-3xl' />
                  </Box>
                  <Box>
                     <Typography variant='h6' className='font-bold text-white'>eSIM Market Intelligence Recommendation</Typography>
                     <Typography variant='body2' className='text-slate-400'>
                        eSIM Market recommends <strong>Tech Solutions Inc</strong> for this contract. They offer the lowest price 
                        and the fastest delivery, representing a 5.4% efficiency gain over the next best alternative.
                     </Typography>
                  </Box>
               </CardContent>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default RFQCompareView
