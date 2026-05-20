'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppDialog from '@/components/common/AppDialog'

interface AddOutboundDialogProps {
  open: boolean
  onClose: () => void
}

const AddOutboundDialog = ({ open, onClose }: AddOutboundDialogProps) => {
  const [formData, setFormData] = useState({
    customer: '',
    requestDate: '',
    notes: ''
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Create Outbound Order"
      subtitle="Prepare a new shipment for a customer"
      maxWidth="sm"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="secondary">Confirm Order</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Customer Name / Organization</Typography>
            <TextField
                fullWidth
                size="small"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Request Date</Typography>
            <TextField
                fullWidth
                type="date"
                size="small"
                value={formData.requestDate}
                onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Shipping Instructions</Typography>
            <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                placeholder="e.g. Fragile items, handle with care"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddOutboundDialog
