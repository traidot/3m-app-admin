'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppDialog from '@/components/common/AppDialog'

interface AddVendorDialogProps {
  open: boolean
  onClose: () => void
}

const AddVendorDialog = ({ open, onClose }: AddVendorDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Material Supplier',
    email: '',
    contact: '',
    phone: '',
    address: ''
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Vendor Onboarding"
      subtitle="Register a new verified supplier or service provider to the procurement network"
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="secondary">Onboard Vendor</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Company Name / Brand</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder='Enter vendor company name'
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Vendor Category</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="Material Supplier">Material Supplier</MenuItem>
              <MenuItem value="Service Provider">Service Provider</MenuItem>
              <MenuItem value="Logistics">Logistics Partner</MenuItem>
              <MenuItem value="Software">IT / Software</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Account Manager</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder='Name of the point of contact'
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Primary Phone</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder='+1 (555) 000-0000'
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Business Email</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder='vendor@company.com'
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Headquarters Address</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder='Registered business address'
            />
          </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddVendorDialog
