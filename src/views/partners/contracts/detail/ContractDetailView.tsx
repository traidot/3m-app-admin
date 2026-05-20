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
import LinearProgress from '@mui/material/LinearProgress'

import PageHeader from '@/components/layout/shared/PageHeader'
import WorkflowTimeline from '@/components/workflow/WorkflowTimeline'

const ContractDetailView = ({ id }: { id: string }) => {
  const contract = {
    id: id || 'CT-2026-01',
    vendor: 'Tech Solutions Inc',
    title: 'Enterprise IT Support SLA',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    value: '$25,000.00',
    type: 'Service Level Agreement',
    status: 'Active',
    renewalTerms: 'Auto-renew with 30-day notice',
    clauses: [
      { tag: 'SLA', content: '99.9% Server Uptime guaranteed with monthly reporting.' },
      { tag: 'Payment', content: 'Net-30 days billing upon successful month-end service audit.' },
      { tag: 'Termination', content: '3-months written notice by either party without cause penalty.' }
    ]
  }

  return (
    <>
      <PageHeader
        title={`Strategic Agreement: ${contract.id}`}
        description={`${contract.title} with ${contract.vendor}`}
        breadcrumbs={[
            { label: 'Home', href: '/' }, 
            { label: 'Strategic Sourcing' }, 
            { label: 'Contracts', href: '/partners/contracts' }, 
            { label: 'Agreement Detail' }
        ]}
        actions={
          <Box className='flex gap-2'>
            <Button variant='tonal' startIcon={<i className='tabler-printer' />}>Print Original</Button>
            <Button variant='contained' color='warning' startIcon={<i className='tabler-refresh' />}>Initiate Renewal</Button>
          </Box>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12, md: 8 }}>
            <Card className='border-t-4 border-t-primary'>
               <CardHeader title='Agreement Scope & Legal Clauses' />
               <CardContent className='flex flex-col gap-6 p-8'>
                  <Box className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                     <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Legal Entity Counterparty</Typography>
                        <Typography variant='body1' className='font-black text-slate-900'>{contract.vendor}</Typography>
                     </Box>
                     <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Financial Value (Est.)</Typography>
                        <Typography variant='h5' className='font-black text-primary'>{contract.value}</Typography>
                     </Box>
                     <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Effective Period</Typography>
                        <Box className='flex items-center gap-2'>
                           <i className='tabler-calendar-event text-slate-400' />
                           <Typography variant='body2' className='font-bold'>{contract.effectiveDate} — {contract.expiryDate}</Typography>
                        </Box>
                     </Box>
                     <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Renewal Policy</Typography>
                        <Chip label={contract.renewalTerms} size='small' variant='tonal' color='info' className='font-bold w-fit' />
                     </Box>
                  </Box>

                  <Divider />

                  <Box>
                     <Typography variant='subtitle2' className='font-black mb-4 uppercase tracking-widest text-slate-400'>Critical Contractual Clauses</Typography>
                     <Stack spacing={4}>
                        {contract.clauses.map((clause, i) => (
                           <Box key={i} className='p-4 rounded-lg bg-slate-50 border border-slate-100 flex gap-4'>
                              <Chip label={clause.tag} size='small' variant='tonal' color='secondary' className='mt-1 font-black' />
                              <Typography variant='body2' className='text-slate-700 font-medium leading-relaxed'>{clause.content}</Typography>
                           </Box>
                        ))}
                     </Stack>
                  </Box>
               </CardContent>
            </Card>

            <Card className='mt-6 shadow-sm border border-dashed border-primary/30'>
               <CardContent className='flex items-center justify-between p-6'>
                  <Box className='flex items-center gap-4'>
                     <Box className='bg-primary/10 p-3 rounded-lg text-primary'>
                        <i className='tabler-file-certificate text-2xl' />
                     </Box>
                     <Box>
                        <Typography variant='body2' className='font-bold text-slate-800'>Digital Original Attachment</Typography>
                        <Typography variant='caption' className='text-slate-500'>MSA_TECH_SOLUTIONS_2026.pdf (4.2 MB)</Typography>
                     </Box>
                  </Box>
                  <Button size='small' variant='tonal' startIcon={<i className='tabler-download' />}>Download</Button>
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12, md: 4 }}>
            <Card className='shadow-md'>
               <CardHeader title='Agreement Lifecycle' />
               <CardContent>
                  <Box className='mb-8'>
                     <Box className='flex justify-between items-center mb-2'>
                        <Typography variant='body2' className='font-bold'>Contract Time Elapsed</Typography>
                        <Typography variant='body2' className='font-black text-primary'>85%</Typography>
                     </Box>
                     <LinearProgress variant='determinate' value={85} color='primary' sx={{ height: 6, borderRadius: 3 }} />
                     <Typography variant='caption' className='block mt-2 text-slate-500 text-right italic'>Agreement expires in 42 days</Typography>
                  </Box>

                  <Typography variant='subtitle2' className='font-bold mb-4'>Lifecycle Audit</Typography>
                  <WorkflowTimeline 
                    steps={[
                      { title: 'Draft Negotiated', subtitle: 'Initial terms agreed', time: 'Dec 15, 2025', status: 'completed' },
                      { title: 'Legal Sign-off', subtitle: 'Board approval obtained', time: 'Dec 22, 2025', status: 'completed' },
                      { title: 'Active Performance', subtitle: 'Service monitoring live', time: 'Active Since Jan 1', status: 'completed' },
                      { title: 'Renewal Window', subtitle: 'Negotiation phase start', time: 'Coming Soon', status: 'current' }
                    ]}
                  />
               </CardContent>
            </Card>

            <Card className='mt-6 bg-slate-900 border-none shadow-xl'>
               <CardContent className='p-6 text-white'>
                  <Box className='flex items-center gap-3 mb-4'>
                     <i className='tabler-shield-lock text-3xl text-warning' />
                     <Typography variant='h6' className='font-bold text-white uppercase tracking-tighter'>Audit Integrity</Typography>
                  </Box>
                  <Typography variant='body2' className='text-slate-400 mb-6 font-medium'>
                     This agreement is cryptographically secured and timestamped. All changes are tracked in the system audit log.
                  </Typography>
                  <Button fullWidth variant='contained' color='warning' className='font-bold'>Verify Audit Trail</Button>
               </CardContent>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default ContractDetailView
