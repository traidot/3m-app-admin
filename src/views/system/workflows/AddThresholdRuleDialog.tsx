'use client'

import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid2 from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface AddThresholdRuleDialogProps {
  open: boolean
  onClose: () => void
}

const AddThresholdRuleDialog = ({ open, onClose }: AddThresholdRuleDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='bg-slate-50 border-b p-6'>
         <Typography variant='h5' className='font-black text-slate-800'>Governance Rule Definition</Typography>
         <Typography variant='caption' className='text-slate-500 uppercase font-bold'>Configure Document Approval Logic</Typography>
      </DialogTitle>
      <DialogContent className='p-6'>
        <Grid2 container spacing={6} className='mt-2'>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField 
                fullWidth 
                label='Target Document' 
                select 
                size='small' 
                defaultValue='pr'
              >
                 <MenuItem value='pr'>Purchase Requisition (PR)</MenuItem>
                 <MenuItem value='po'>Purchase Order (PO)</MenuItem>
                 <MenuItem value='rfq'>Request for Quotation (RFQ)</MenuItem>
                 <MenuItem value='invoice'>Supplier Invoice</MenuItem>
              </TextField>
           </Grid2>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField 
                fullWidth 
                label='Required Reviewer Level' 
                select 
                size='small' 
                defaultValue='finance'
              >
                 <MenuItem value='dept'>Department Head</MenuItem>
                 <MenuItem value='finance'>Finance Manager</MenuItem>
                 <MenuItem value='coo'>COO / Strategic Director</MenuItem>
                 <MenuItem value='ceo'>CEO / Board Level</MenuItem>
              </TextField>
           </Grid2>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Minimum Amount ($)' type='number' placeholder='0.00' size='small' />
           </Grid2>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Maximum Amount ($)' type='number' placeholder='Unlimited' size='small' />
           </Grid2>
           <Grid2 size={{ xs: 12 }}>
              <Box className='bg-slate-50 p-4 rounded-lg border border-slate-200'>
                 <Typography variant='caption' color='textSecondary' className='italic'>
                    Rule behavior: Documents falling within this range will be automatically routed to the selected reviewer for electronic signature.
                 </Typography>
              </Box>
           </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions className='p-6 bg-slate-50 border-t'>
        <Button onClick={onClose} variant='tonal' color='secondary' className='font-bold'>Cancel</Button>
        <Button onClick={onClose} variant='contained' className='font-bold' startIcon={<i className='tabler-shield-check' />}>Deploy Governance Rule</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddThresholdRuleDialog
