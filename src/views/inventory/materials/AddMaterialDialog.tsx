'use client'

import { useState, useEffect } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import AppDialog from '@/components/common/AppDialog'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface MaterialRegistrationDialogProps {
  open: boolean
  onClose: () => void
  data?: any
}

const AddMaterialDialog = ({ open, onClose, data }: MaterialRegistrationDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    unit: 'pcs',
    location: '',
    description: ''
  })

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        sku: data.sku || '',
        category: data.category || '',
        quantity: data.quantity || 0,
        unit: data.unit || 'pcs',
        location: data.location || '',
        description: data.description || ''
      })
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        quantity: 0,
        unit: 'pcs',
        location: '',
        description: ''
      })
    }
  }, [data, open])

  const handleSave = () => {
    onClose()
  }

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={data ? 'Modify Material' : 'Register New Material'}
      subtitle="Define specifications and supply information for the material master record"
      fullWidth
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="info" onClick={handleSave}>Save Material</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Item Name / Description</Typography>
            <TextField
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              size="small"
              placeholder='e.g. Dell Latitude Laptop'
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Material Code (SKU)</Typography>
            <TextField
              fullWidth
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              size="small"
              placeholder='AUT-SKU-001'
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Category</Typography>
            <TextField
              fullWidth
              select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              size="small"
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Consumables">Consumables</MenuItem>
              <MenuItem value="Hardware">Hardware / Tools</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Initial Stock</Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              size="small"
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Unit of Measure</Typography>
            <TextField
              fullWidth
              placeholder="e.g. kg, unit, box"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              size="small"
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Primary Storage / Dept</Typography>
            <TextField
              fullWidth
              placeholder="e.g. WH-A, IT Department"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              size="small"
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Procurement Description (Optional)</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              size="small"
              placeholder='Additional specifications or vendor preferences'
            />
          </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddMaterialDialog
