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
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface AddOnboardingDialogProps {
  open: boolean
  onClose: () => void
}

const AddOnboardingDialog = ({ open, onClose }: AddOnboardingDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='bg-slate-50 border-b p-6'>
         <Typography variant='h5' className='font-black text-slate-800'>Supplier Invitation Hub</Typography>
         <Typography variant='caption' className='text-slate-500 uppercase font-bold'>Strategic Partnership Onboarding</Typography>
      </DialogTitle>
      <DialogContent className='p-6'>
        <Grid2 container spacing={6} className='mt-2'>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Entity Name' placeholder='Legal company name...' size='small' />
           </Grid2>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Compliance Category' select size='small' defaultValue='it'>
                 <MenuItem value='it'>IT & Digital Infrastructure</MenuItem>
                 <MenuItem value='logistics'>Transportation & Logistics</MenuItem>
                 <MenuItem value='raw'>Raw Materials & Production</MenuItem>
              </TextField>
           </Grid2>
           <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth label='Corporate Email' placeholder='partnership@company.com' size='small' />
           </Grid2>
           <Grid2 size={{ xs: 12 }}>
              <Box className='bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3'>
                 <i className='tabler-info-circle text-blue-500' />
                 <Typography variant='caption' className='text-blue-700'>
                    Invited suppliers will receive a secure link to the automated KYC portal where they can upload mandatory legal documents.
                 </Typography>
              </Box>
           </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions className='p-6 bg-slate-50 border-t'>
        <Button onClick={onClose} variant='tonal' color='secondary' className='font-bold'>Cancel Request</Button>
        <Button onClick={onClose} variant='contained' className='font-bold' startIcon={<i className='tabler-send' />}>Deploy Invitation</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddOnboardingDialog
