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

interface AddRTVDialogProps {
  open: boolean
  onClose: () => void
}

const AddRTVDialog = ({ open, onClose }: AddRTVDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='bg-red-50 border-b p-6'>
         <Typography variant='h5' className='font-black text-red-800'>Initiate Return to Vendor (RTV)</Typography>
         <Typography variant='caption' className='text-red-500 uppercase font-bold'>Defective Material Authorization Request</Typography>
      </DialogTitle>
      <DialogContent className='p-6'>
        <Grid2 container spacing={6} className='mt-2'>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Vendor Search' placeholder='Select target supplier...' size='small' />
           </Grid2>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Material / SKU' placeholder='Item being returned...' size='small' />
           </Grid2>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Original GRN Reference' placeholder='GR-202X-XXXX' size='small' />
           </Grid2>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Return Reason' select size='small' defaultValue='defective'>
                 <MenuItem value='defective'>Material Defect / Malfunction</MenuItem>
                 <MenuItem value='wrong'>Incorrect Item Shipment</MenuItem>
                 <MenuItem value='damaged'>Transit Damage</MenuItem>
              </TextField>
           </Grid2>
           <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={3} label='Technical Description' placeholder='Provide exact details of failure or reason for return...' size='small' />
           </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions className='p-6 bg-slate-50 border-t'>
        <Button onClick={onClose} variant='tonal' color='secondary' className='font-bold'>Cancel</Button>
        <Button onClick={onClose} variant='contained' color='error' className='font-bold' startIcon={<i className='tabler-truck-return' />}>Generate RMA</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddRTVDialog
