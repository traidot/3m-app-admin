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
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'

import PageHeader from '@/components/layout/shared/PageHeader'
import AddThresholdRuleDialog from './AddThresholdRuleDialog'

const WorkflowConfigView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [rules, setRules] = useState([
    { id: 1, type: 'Purchase Requisition', threshold: '< $1,000', approval: 'Dept Head', autoApprove: false },
    { id: 2, type: 'Purchase Requisition', threshold: '$1,000 - $10,000', approval: 'Finance Manager', autoApprove: false },
    { id: 3, type: 'Purchase Order', threshold: '> $50,000', approval: 'COO / Director', autoApprove: false }
  ])

  return (
    <>
      <PageHeader
        title='Governance & Approval Matrix'
        description='Configure multi-level financial thresholds and automated routing for procurement objects'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'System Engine' }, { label: 'Approval Hierarchies' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setIsDialogOpen(true)}>New Threshold Rule</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12 }}>
            <Card className='border-t-4 border-t-primary shadow-sm'>
               <CardHeader title='Operational Routing Rules' subheader='Global hierarchy for document approval flow' />
               <CardContent className='p-0'>
                  <table className='w-full text-left'>
                     <thead className='bg-slate-50 border-be'>
                        <tr>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-500'>Document Type</th>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-500'>Financial Threshold</th>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-500'>Required Approval Level</th>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-500 text-center'>Auto-Approve</th>
                           <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-500'>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {rules.map((rule, i) => (
                           <tr key={i} className='border-be last:border-0 hover:bg-slate-50/50 transition-colors'>
                              <td className='p-4'>
                                 <Chip label={rule.type} size='small' variant='tonal' color='secondary' className='font-bold' />
                              </td>
                              <td className='p-4 text-sm font-black text-slate-800'>{rule.threshold}</td>
                              <td className='p-4'>
                                 <Box className='flex items-center gap-2'>
                                    <i className='tabler-user-shield text-slate-400' />
                                    <Typography variant='body2' className='font-bold text-slate-700'>{rule.approval}</Typography>
                                 </Box>
                              </td>
                              <td className='p-4 text-center'>
                                 <Switch size='small' checked={rule.autoApprove} />
                              </td>
                              <td className='p-4 text-center'>
                                 <IconButton size='small'><i className='tabler-edit' /></IconButton>
                                 <IconButton size='small' color='error'><i className='tabler-trash' /></IconButton>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
               <CardHeader title='Global Workflow Settings' />
               <CardContent>
                  <Stack spacing={4}>
                     <Box className='flex items-center justify-between'>
                        <Box>
                           <Typography variant='body2' className='font-bold'>Parallel Approval</Typography>
                           <Typography variant='caption' className='text-slate-500'>Allow multiple stakeholders to review simultaneously</Typography>
                        </Box>
                        <Switch defaultChecked />
                     </Box>
                     <Divider />
                     <Box className='flex items-center justify-between'>
                        <Box>
                           <Typography variant='body2' className='font-bold'>Mobile Authorization</Typography>
                           <Typography variant='caption' className='text-slate-500'>Require biometric / MFA for high-value orders</Typography>
                        </Box>
                        <Switch />
                     </Box>
                  </Stack>
               </CardContent>
            </Card>
         </Grid2>
      </Grid2>
      <AddThresholdRuleDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default WorkflowConfigView
