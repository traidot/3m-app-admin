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

import PageHeader from '@/components/layout/shared/PageHeader'
import WorkflowTimeline from '@/components/workflow/WorkflowTimeline'

const SupplierOnboardingDetailView = ({ id }: { id: string }) => {
  const vendor = {
    id: id || 'ONB-7721',
    name: 'Alibaba Cloud Services',
    category: 'IT Infrastructure',
    email: 'partnerships@alibaba-inc.com',
    appliedDate: '2026-04-10',
    score: 92,
    status: 'Under Review',
    docs: [
      { name: 'Business License', status: 'Verified', date: '2026-04-11' },
      { name: 'Tax Compliance Cert', status: 'Verified', date: '2026-04-11' },
      { name: 'ISO 27001 Certificate', status: 'Under Review', date: '2026-04-12' },
      { name: 'Financial Audit 2025', status: 'Pending', date: '--' }
    ]
  }

  return (
    <>
      <PageHeader
        title={`Partnership Evaluation: ${vendor.id}`}
        description={`Audit and compliance review for ${vendor.name}`}
        breadcrumbs={[
            { label: 'Home', href: '/' }, 
            { label: 'Strategic Sourcing' }, 
            { label: 'Supplier Onboarding', href: '/partners/onboarding' }, 
            { label: 'Audit' }
        ]}
        actions={
          <Box className='flex gap-2'>
            <Button variant='tonal' color='error'>Reject Entity</Button>
            <Button variant='contained' color='primary' startIcon={<i className='tabler-shield-check' />}>Approve Partnership</Button>
          </Box>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12, md: 4 }}>
            <Card className='border-t-4 border-t-primary shadow-md'>
               <CardContent className='flex flex-col items-center p-8'>
                  <Avatar sx={{ width: 80, height: 80, mb: 4, bgcolor: 'primary.lighter', color: 'primary.main', fontSize: '2rem', fontWeight: 'bold' }}>
                     {vendor.name[0]}
                  </Avatar>
                  <Typography variant='h5' className='font-black text-slate-800 text-center mb-1'>{vendor.name}</Typography>
                  <Typography variant='body2' className='text-slate-500 mb-6'>{vendor.category}</Typography>
                  
                  <Box className='w-full bg-slate-50 p-4 rounded-xl flex items-center justify-between mb-6 border border-slate-100'>
                     <Box>
                        <Typography variant='caption' className='uppercase font-bold text-slate-400'>Trust Score</Typography>
                        <Typography variant='h4' className='font-black text-primary'>{vendor.score}%</Typography>
                     </Box>
                     <i className='tabler-award text-4xl text-primary/20' />
                  </Box>

                  <Stack spacing={4} className='w-full'>
                     <Box className='flex flex-col gap-1'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Direct Contact</Typography>
                        <Typography variant='body2' className='font-bold underline text-primary'>{vendor.email}</Typography>
                     </Box>
                     <Box className='flex flex-col gap-1'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Application Date</Typography>
                        <Typography variant='body2' className='font-bold text-slate-700'>{vendor.appliedDate}</Typography>
                     </Box>
                  </Stack>
               </CardContent>
            </Card>

            <Card className='mt-6'>
               <CardHeader title='Audit Timeline' />
               <CardContent>
                  <WorkflowTimeline 
                    steps={[
                      { title: 'Application Created', subtitle: 'Self-service portal submission', time: 'Apr 10, 10:00 AM', status: 'completed' },
                      { title: 'KYC Document Validation', subtitle: 'Automated authenticity check', time: 'Apr 11, 11:30 AM', status: 'completed' },
                      { title: 'Managerial Review', subtitle: 'Manual compliance verify', time: 'In Progress', status: 'current', actor: 'David Admin' },
                      { title: 'Final Contract Release', subtitle: 'Legal & Procurement sign-off', time: '--', status: 'pending' }
                    ]}
                  />
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12, md: 8 }}>
            <Card>
               <CardHeader title='KYC Compliance Matrix' subheader='Mandatory documents for strategic partnership' />
               <CardContent className='p-0'>
                  <table className='w-full text-left'>
                     <thead className='bg-slate-50 border-be'>
                        <tr>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-500'>Legal Document Name</th>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-500'>Last Verified</th>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-500 text-center'>Audit Status</th>
                           <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-500'>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {vendor.docs.map((doc, i) => (
                           <tr key={i} className='border-be last:border-0 hover:bg-slate-50/50 transition-colors'>
                              <td className='p-4 text-sm font-bold text-slate-800'>{doc.name}</td>
                              <td className='p-4 text-sm font-mono text-slate-500'>{doc.date}</td>
                              <td className='p-4 text-center'>
                                 <Chip 
                                    label={doc.status} 
                                    size='small' 
                                    variant='tonal' 
                                    color={doc.status === 'Verified' ? 'success' : doc.status === 'Under Review' ? 'info' : 'secondary'} 
                                    className='font-bold'
                                 />
                              </td>
                              <td className='p-4 text-center'>
                                 <Button variant='text' size='small' startIcon={<i className='tabler-eye' />}>View</Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </CardContent>
            </Card>

            <Card className='mt-6'>
               <CardHeader title='Financial Stability Analysis' />
               <CardContent>
                  <Box className='bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center gap-6'>
                     <Box className='bg-blue-500 text-white p-4 rounded-xl'>
                        <i className='tabler-report-money text-3xl' />
                     </Box>
                     <Box>
                        <Typography variant='h6' className='font-bold text-blue-900'>Enterprise Risk Rating: LOW</Typography>
                        <Typography variant='body2' className='text-blue-700 leading-relaxed'>
                           Based on the 2025 Financial Audit, the vendor shows strong liquidity and high operational stability. 
                           Recommended for long-term strategic contracts exceeding $100K/year.
                        </Typography>
                     </Box>
                  </Box>
               </CardContent>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default SupplierOnboardingDetailView
