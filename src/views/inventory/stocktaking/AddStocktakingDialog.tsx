'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppDialog from '@/components/common/AppDialog'

interface AddStocktakingDialogProps {
  open: boolean
  onClose: () => void
}

const AddStocktakingDialog = ({ open, onClose }: AddStocktakingDialogProps) => {
  const [formData, setFormData] = useState({
    location: 'Main Warehouse',
    date: new Date().toISOString().split('T')[0],
    assignedTo: ''
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Create Stocktaking Session"
      subtitle="Schedule a physical inventory count for a specific location"
      maxWidth="sm"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained">Initialize Session</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Storage Location</Typography>
            <TextField
                fullWidth
                select
                size="small"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            >
                <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                <MenuItem value="Section A">Section A</MenuItem>
                <MenuItem value="Section B">Section B</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Schedule Date</Typography>
            <TextField
                fullWidth
                type="date"
                size="small"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Assigned Lead Counter</Typography>
            <TextField
                fullWidth
                placeholder="Search user..."
                size="small"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
          </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddStocktakingDialog
