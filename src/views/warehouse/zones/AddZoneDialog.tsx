'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppDialog from '@/components/common/AppDialog'

interface AddZoneDialogProps {
  open: boolean
  onClose: () => void
}

const AddZoneDialog = ({ open, onClose }: AddZoneDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    lead: '',
    totalBins: ''
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title='Create Storage Zone'
      subtitle="Define a new logical or physical storage area within the warehouse"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={onClose}>Create Zone</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Zone Name</Typography>
            <TextField
                fullWidth
                placeholder="e.g. Zone E - Hazardous"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                size="small"
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Zone Lead / Manager</Typography>
            <TextField
                fullWidth
                value={formData.lead}
                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                size="small"
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Planned Bin Capacity</Typography>
            <TextField
                fullWidth
                type="number"
                value={formData.totalBins}
                onChange={(e) => setFormData({ ...formData, totalBins: e.target.value })}
                size="small"
            />
          </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddZoneDialog
