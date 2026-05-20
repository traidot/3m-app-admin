'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import AppDialog from '@/components/common/AppDialog'

import Box from '@mui/material/Box'

interface AddPODialogProps {
  open: boolean
  onClose: () => void
}

const AddPODialog = ({ open, onClose }: AddPODialogProps) => {
  const [formData, setFormData] = useState({
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    warehouse: 'Main Warehouse',
    expectedDate: '',
    notes: ''
  })

  const handleSave = () => {
    onClose()
  }

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title='Create Purchase Order (PO)'
      subtitle="Issue a new buying request to a registered supplier"
      fullWidth
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Discard</Button>
          <Button variant="contained" onClick={handleSave}>Create & Approve</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Select Supplier</Typography>
            <TextField
              fullWidth
              select
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              size="small"
              placeholder='Choose vendor'
            >
              <MenuItem value="Tech Solutions Inc">Tech Solutions Inc</MenuItem>
              <MenuItem value="Furniture Co">Furniture Co</MenuItem>
              <MenuItem value="Office Depot">Office Depot</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Order Date</Typography>
            <TextField
              fullWidth
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              size="small"
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Receiving Warehouse</Typography>
            <TextField
              fullWidth
              select
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              size="small"
            >
              <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
              <MenuItem value="North Storage">North Storage</MenuItem>
              <MenuItem value="East Annex">East Annex</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Expected Delivery</Typography>
            <TextField
              fullWidth
              type="date"
              value={formData.expectedDate}
              onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
              size="small"
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Internal Notes</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              size="small"
              placeholder='Enter any internal instructions or remarks'
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
            <Typography variant='caption' className='text-info italic'>Line Items will be added on the next screen after PO creation.</Typography>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddPODialog
