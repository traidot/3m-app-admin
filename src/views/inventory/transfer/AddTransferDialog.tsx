'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppDialog from '@/components/common/AppDialog'

interface AddTransferDialogProps {
  open: boolean
  onClose: () => void
}

const AddTransferDialog = ({ open, onClose }: AddTransferDialogProps) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    items: '',
    date: new Date().toISOString().split('T')[0]
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="New Transfer Request"
      subtitle="request stock movement between warehouse locations"
      maxWidth="sm"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="info">Submit Request</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>From Location</Typography>
            <TextField
                fullWidth
                select
                size="small"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
            >
                <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                <MenuItem value="North Branch">North Branch</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>To Location</Typography>
            <TextField
                fullWidth
                select
                size="small"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            >
                <MenuItem value="North Branch">North Branch</MenuItem>
                <MenuItem value="East Storage">East Storage</MenuItem>
                <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Items to Transfer</Typography>
            <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="e.g. 50x Wireless Mouse, 20x Keyboard"
                size="small"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Scheduled Date</Typography>
            <TextField
                fullWidth
                type="date"
                size="small"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddTransferDialog
