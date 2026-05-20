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

interface UploadContractDialogProps {
  open: boolean
  onClose: () => void
}

const UploadContractDialog = ({ open, onClose }: UploadContractDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='bg-slate-50 border-b p-6'>
         <Typography variant='h5' className='font-black text-slate-800'>Strategic Agreement Upload</Typography>
         <Typography variant='caption' className='text-slate-500 uppercase font-bold'>Legal Repository Entry</Typography>
      </DialogTitle>
      <DialogContent className='p-6'>
        <Grid2 container spacing={6} className='mt-2'>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Contracting Party' placeholder='Supplier Legal Name...' size='small' />
           </Grid2>
           <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label='Agreement Type' select size='small' defaultValue='msa'>
                 <MenuItem value='msa'>Master Service Agreement (MSA)</MenuItem>
                 <MenuItem value='nda'>Non-disclosure Agreement (NDA)</MenuItem>
                 <MenuItem value='sla'>Service Level Agreement (SLA)</MenuItem>
              </TextField>
           </Grid2>
           <Grid2 size={{ xs: 12 }}>
              <Box className='border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer'>
                 <i className='tabler-file-upload text-4xl text-slate-400 mb-2' />
                 <Typography variant='body2' className='font-bold text-slate-600'>Drag & Drop PDF Original</Typography>
                 <Typography variant='caption' className='text-slate-400 italic'>Max file size: 15MB</Typography>
              </Box>
           </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions className='p-6 bg-slate-50 border-t'>
        <Button onClick={onClose} variant='tonal' color='secondary' className='font-bold'>Discard</Button>
        <Button onClick={onClose} variant='contained' className='font-bold' startIcon={<i className='tabler-shield-check' />}>Authorize & Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default UploadContractDialog
