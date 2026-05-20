'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppDialog from '@/components/common/AppDialog'

interface AddUserDialogProps {
  open: boolean
  onClose: () => void
}

const AddUserDialog = ({ open, onClose }: AddUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Operator',
    password: ''
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Create System User"
      subtitle="Define access levels for warehouse staff and administrators"
      maxWidth="sm"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="info">Assign & Create</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Full Name</Typography>
            <TextField
                fullWidth
                size="small"
                placeholder='Enter full name e.g. John Doe'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Email / Login ID</Typography>
            <TextField
                fullWidth
                size="small"
                placeholder='Email address used for login'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>System Role</Typography>
            <TextField
                fullWidth
                select
                size="small"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
                <MenuItem value="Administrator">Administrator</MenuItem>
                <MenuItem value="Manager">Warehouse Manager</MenuItem>
                <MenuItem value="Operator">Standard Operator</MenuItem>
                <MenuItem value="Viewer">Read-only Viewer</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Temporary Password</Typography>
            <TextField
                fullWidth
                type="password"
                size="small"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddUserDialog
