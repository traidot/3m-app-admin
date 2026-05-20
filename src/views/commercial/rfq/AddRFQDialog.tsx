'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import AppDialog from '@/components/common/AppDialog'

import Box from '@mui/material/Box'

interface AddRFQDialogProps {
  open: boolean
  onClose: () => void
}

const AddRFQDialog = ({ open, onClose }: AddRFQDialogProps) => {
  const [formData, setFormData] = useState({
    vendor: '',
    deliveryLocation: '',
    paymentTerms: 'Net30',
    priority: 'Normal'
  })

  const handleSave = () => {
    onClose()
  }

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title='New Request for Quotation (RFQ)'
      subtitle="Solicit price offers from candidate vendors for required materials"
      fullWidth
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Publish RFQ</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Primary Vendor</Typography>
            <TextField
              fullWidth
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              size="small"
              placeholder="Search or add vendor..."
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Bidding Priority</Typography>
            <TextField
              fullWidth
              select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              size="small"
            >
              <MenuItem value="Normal">Normal</MenuItem>
              <MenuItem value="High">Fast-track</MenuItem>
              <MenuItem value="Urgent">Immediate</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Delivery Location</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
              size="small"
              placeholder='Specify the destination address'
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Preferred Payment Terms</Typography>
            <TextField
              fullWidth
              select
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              size="small"
            >
              <MenuItem value="COD">Cash on Delivery</MenuItem>
              <MenuItem value="Net30">Net 30 Days</MenuItem>
              <MenuItem value="Prepaid">Prepaid</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
            <Typography variant='caption' className='text-info italic'>Note: Candidate vendors will be notified to submit their quotes via the supplier portal.</Typography>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddRFQDialog
