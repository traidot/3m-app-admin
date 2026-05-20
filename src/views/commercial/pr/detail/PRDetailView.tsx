'use client'

import { useState } from 'react'
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
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import PageHeader from '@/components/layout/shared/PageHeader'
import WorkflowTimeline from '@/components/workflow/WorkflowTimeline'

const PRDetailView = ({ id }: { id: string }) => {
  const [prStatus, setPrStatus] = useState('Pending Approval')
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'info' as 'info' | 'success' | 'error' })

  const handleAction = (status: string, msg: string, severity: any = 'success') => {
    setPrStatus(status)
    setSnackbar({ open: true, msg, severity })
  }
  const prData = {
    id: id || 'PR-2026-001',
    title: 'IT Infrastructure Upgrade - Server Room',
    requestedBy: 'John Doe (IT Support)',
    department: 'IT Support',
    date: '2026-04-18',
    requiredBy: '2026-05-10',
    priority: 'High',
    status: 'Pending Approval',
    budgetCode: 'CAPEX-2026-IT',
    reason: 'Upgrading primary file server and networking switches to support Q3 expansion.',
    items: [
        { name: 'Dell PowerEdge R750', qty: 2, price: '$8,500', total: '$17,000' },
        { name: 'Cisco 9300 Switch', qty: 4, price: '$3,200', total: '$12,800' }
    ],
    totalAmount: '$29,800'
  }

  const steps = ['Submission', 'Dept Head Approval', 'Finance Verification', 'Procurement Review', 'PO Conversion']
  const activeStep = 1

  return (
    <>
      <PageHeader
        title={`Purchase Requisition: ${prData.id}`}
        description={prData.title}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Ops' }, { label: 'Purchase Requisitions (PR)', href: '/commercial/pr' }, { label: 'Detail' }]}
        actions={
          <Box className='flex gap-2'>
            {prStatus === 'Approved' ? (
              <Button variant='contained' color='primary' startIcon={<i className='tabler-transfer-in' />} onClick={() => handleAction('Converted to PO', 'Requisition successfully converted to a new Purchase Order')}>Convert to PO</Button>
            ) : prStatus === 'Pending Approval' ? (
              <>
                <Button variant='tonal' color='error' onClick={() => handleAction('Rejected', 'Requisition was sent back for revision', 'error')}>Reject</Button>
                <Button variant='contained' color='success' onClick={() => handleAction('Approved', 'Financial approval granted successfully')}>Approve Request</Button>
              </>
            ) : prStatus === 'Converted to PO' ? (
              <Button variant='tonal' color='primary' disabled startIcon={<i className='tabler-check' />}>Already Converted</Button>
            ) : (
              <Button variant='tonal' color='secondary' disabled>{prStatus}</Button>
            )}
          </Box>
        }
      />

      <Card className='mt-6 mb-6 p-8 shadow-sm border-t-2 border-t-warning'>
         <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{ sx: { '&.Mui-active': { color: 'warning.main' }, '&.Mui-completed': { color: 'success.main' } } }}
                >
                  <Typography variant='caption' className='font-bold uppercase tracking-wider'>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
         </Stepper>
      </Card>

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, lg: 8 }}>
            <Card className='shadow-sm'>
                <CardHeader title='Requisition Intelligence' subheader='Technical breakdown and budgetary alignment' />
                <CardContent className='flex flex-col gap-8 p-8'>
                    <Grid2 container spacing={6}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                             <Box className='flex flex-col gap-1.5'>
                                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Requisition Owner</Typography>
                                <Box className='flex items-center gap-2'>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>JD</Avatar>
                                    <Typography variant='body1' className='font-bold text-slate-800'>{prData.requestedBy}</Typography>
                                </Box>
                             </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                             <Box className='flex flex-col gap-1.5'>
                                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Required By Logistics</Typography>
                                <Box className='flex items-center gap-2 text-primary'>
                                    <i className='tabler-calendar-due' />
                                    <Typography variant='body1' className='font-black font-mono'>{prData.requiredBy}</Typography>
                                </Box>
                             </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                             <Box className='flex flex-col gap-1.5'>
                                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Financial Budget Link</Typography>
                                <Box className='flex items-center gap-2'>
                                    <i className='tabler-currency-dollar text-success' />
                                    <Typography variant='body1' className='font-black text-slate-900'>{prData.budgetCode}</Typography>
                                </Box>
                             </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                             <Box className='flex flex-col gap-1.5'>
                                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Sourcing Priority</Typography>
                                <Chip label={prData.priority} size='small' variant='tonal' color='warning' className='font-black tracking-wide w-fit' />
                             </Box>
                        </Grid2>
                    </Grid2>

                    <Divider />

                    <Box>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500 block mbe-2'>Business Justification</Typography>
                        <Typography variant='body2' className='text-slate-700 leading-relaxed'>{prData.reason}</Typography>
                    </Box>

                    <Box>
                        <Typography variant='subtitle2' className='font-bold mb-4'>Estimated Line Items</Typography>
                        {prData.items.map((item, index) => (
                           <Box key={index} className='flex items-center justify-between p-4 border rounded mb-3 bg-slate-50'>
                              <Box>
                                 <Typography variant='body2' className='font-bold'>{item.name}</Typography>
                                 <Typography variant='caption'>{item.qty} units x {item.price}</Typography>
                              </Box>
                              <Typography variant='body1' className='font-bold'>{item.total}</Typography>
                           </Box>
                        ))}
                        <Box className='flex justify-between p-4 mt-2'>
                           <Typography variant='h6' className='font-bold'>Estimated Total</Typography>
                           <Typography variant='h6' className='font-bold text-primary'>{prData.totalAmount}</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 4 }}>
           <Card>
              <CardHeader title='Approval History' />
               <CardContent>
                  <WorkflowTimeline 
                    steps={[
                      { title: 'Requisition Submitted', subtitle: 'Initial request created', time: 'April 18, 09:45 AM', status: 'completed', actor: 'John Doe' },
                      { title: 'Department Approval', subtitle: 'Technical validation', time: 'April 18, 14:20 PM', status: 'current', actor: 'Sarah Jenkins' },
                      { title: 'Budget Verification', subtitle: 'Finance check', time: '--', status: 'pending' },
                      { title: 'Procurement Strategy', subtitle: 'Final RFP/PO decision', time: '--', status: 'pending' }
                    ]}
                  />
               </CardContent>
           </Card>

           <Card className='mt-6'>
              <CardContent>
                 <Typography variant='body2' className='font-medium text-slate-600 mb-4'>
                    This requisition is within the current CAPEX budget for IT. Initial validation passed.
                 </Typography>
                 <Button fullWidth variant='outlined' size='small'>Download Internal PDF</Button>
              </CardContent>
           </Card>
        </Grid2>
      </Grid2>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default PRDetailView
