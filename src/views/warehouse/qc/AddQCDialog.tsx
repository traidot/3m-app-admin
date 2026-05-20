'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Rating from '@mui/material/Rating'
import AppDialog from '@/components/common/AppDialog'

interface AddQCDialogProps {
  open: boolean
  onClose: () => void
}

const AddQCDialog = ({ open, onClose }: AddQCDialogProps) => {
  const [formData, setFormData] = useState({
    receiptRef: '',
    material: '',
    sampleSize: 10,
    defectsFound: 0,
    result: 'Pass',
    complianceRating: 5,
    notes: ''
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title='Record Quality Inspection'
      subtitle="Perform quality assurance checks on received materials before stock commitment"
      fullWidth
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="success" onClick={onClose}>Commit QA Report</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12, md: 6 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Receipt Reference (GR #)</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder='Search GRN...'
              value={formData.receiptRef}
              onChange={(e) => setFormData({ ...formData, receiptRef: e.target.value })}
            />
          </Box>
        </Grid2>
        
        <Grid2 size={{ xs: 12, md: 6 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Material / Batch</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder='Select items from receipt...'
              value={formData.material}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Sample Size</Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={formData.sampleSize}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Defects Found</Typography>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={formData.defectsFound}
              onChange={(e) => setFormData({ ...formData, defectsFound: parseInt(e.target.value) || 0 })}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Final QA Decision</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            >
              <MenuItem value="Pass">Release (Pass)</MenuItem>
              <MenuItem value="Quarantine">Quarantine</MenuItem>
              <MenuItem value="Fail">Reject (Return to Vendor)</MenuItem>
            </TextField>
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
            <Box className='flex flex-col gap-1.5'>
                <Typography variant='caption' className='uppercase font-bold text-slate-500'>Standard Compliance Rating</Typography>
                <Rating 
                    value={formData.complianceRating} 
                    onChange={(e, newVal) => setFormData({ ...formData, complianceRating: newVal || 5 })}
                />
            </Box>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Inspection Remarks</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder='Describe any deviations or quality concerns'
              value={formData.notes}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
           <Box className='p-4 bg-orange-50 border border-orange-200 rounded flex items-center gap-4 text-orange-800 font-medium'>
                <i className='tabler-alert-triangle text-2xl' />
                <Typography variant='body2'>
                    Warning: Rejecting this material will automatically initiate a Return-to-Vendor (RTV) case and notify the purchasing manager.
                </Typography>
           </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddQCDialog
