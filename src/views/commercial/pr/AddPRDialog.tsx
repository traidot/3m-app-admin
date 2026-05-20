'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppDialog from '@/components/common/AppDialog'

interface AddPRDialogProps {
  open: boolean
  onClose: () => void
}

const AddPRDialog = ({ open, onClose }: AddPRDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Operations',
    priority: 'Normal',
    requestedBy: 'Current User',
    requiredDate: '',
    reason: ''
  })

  const handleSave = () => {
    onClose()
  }

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title='New Purchase Requisition (PR)'
      subtitle="Submit an internal request for materials or services for departmental use"
      fullWidth
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Submit Requisition</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Requisition Title / Project</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder='e.g. Q2 Office Supply Replenishment'
            />
          </Box>
        </Grid2>
        
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Requesting Department</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <MenuItem value="Operations">Operations</MenuItem>
              <MenuItem value="IT Support">IT Support</MenuItem>
              <MenuItem value="Human Resources">Human Resources</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Required By Date</Typography>
            <TextField
              fullWidth
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={formData.requiredDate}
              onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Priority Level</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Normal">Normal</MenuItem>
              <MenuItem value="High">High (Immediate Action)</MenuItem>
              <MenuItem value="Critical">Critical (Stockout Risk)</MenuItem>
            </TextField>
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Requested By</Typography>
            <TextField
              fullWidth
              disabled
              size="small"
              value={formData.requestedBy}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500 block mb-2'>Estimated Line Items</Typography>
            <Box className='border rounded-lg bg-slate-50 p-4'>
                <Grid2 container spacing={4} className='items-end'>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Box className='flex flex-col gap-1.5'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Product / SKU</Typography>
                            <TextField select fullWidth size='small' defaultValue=''>
                                <MenuItem value="">Select a product...</MenuItem>
                                <MenuItem value="COF-001">Coffee Beans 1kg</MenuItem>
                                <MenuItem value="TEA-002">Oolong Tea 250g</MenuItem>
                                <MenuItem value="BOX-003">Carton Box Medium</MenuItem>
                            </TextField>
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 3 }}>
                        <Box className='flex flex-col gap-1.5'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Order Qty</Typography>
                            <TextField type='number' fullWidth size='small' defaultValue={1} />
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 3 }}>
                        <Button variant='tonal' fullWidth startIcon={<i className='tabler-plus' />}>Add Line</Button>
                    </Grid2>
                </Grid2>
                
                {/* Mocked Item List */}
                <Box className='mt-6 border-t pt-4'>
                    <Box className='flex items-center justify-between py-2 border-b last:border-0'>
                        <Box>
                            <Typography variant='body2' className='font-bold'>Laptop Dell XPS 13</Typography>
                            <Typography variant='caption' className='text-slate-500'>Product ID: PRD-2021</Typography>
                        </Box>
                        <Box className='flex items-center gap-6'>
                            <Typography variant='body2' className='font-bold'>qty: 2</Typography>
                            <i className='tabler-trash text-error cursor-pointer' />
                        </Box>
                    </Box>
                </Box>
            </Box>
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
            <Typography variant='caption' className='text-info italic font-medium'>
                <i className='tabler-info-circle me-1' />
                Electronic workflow based on your department will be triggered upon submission.
            </Typography>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddPRDialog
