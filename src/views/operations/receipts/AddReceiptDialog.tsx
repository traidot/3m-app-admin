'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import AppDialog from '@/components/common/AppDialog'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface AddReceiptDialogProps {
  open: boolean
  onClose: () => void
}

const AddReceiptDialog = ({ open, onClose }: AddReceiptDialogProps) => {
  const [formData, setFormData] = useState({
    supplier: '',
    expectedDate: '',
    warehouse: 'Main Warehouse',
    notes: ''
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Create Inbound Receipt"
      subtitle="Schedule a new shipment from a supplier"
      maxWidth="sm"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained">Create Schedule</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Purchase Order Reference (Optional)</Typography>
            <TextField
              fullWidth
              select
              size="small"
              placeholder="Select PO to link"
              defaultValue=""
            >
              <MenuItem value="">Manual Receipt (No PO)</MenuItem>
              <MenuItem value="PO-2026-001">PO-2026-001 - Tech Solutions</MenuItem>
              <MenuItem value="PO-2026-003">PO-2026-003 - Global Office</MenuItem>
            </TextField>
            <Typography variant='caption' className='text-primary font-medium italic'>Linking a PO will auto-verify quantities during QC.</Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Supplier</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            >
              <MenuItem value="Tech Solutions Inc">Tech Solutions Inc</MenuItem>
              <MenuItem value="Office Depot">Office Depot</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Expected Arrival</Typography>
            <TextField
              fullWidth
              type="date"
              size="small"
              value={formData.expectedDate}
              onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
            />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Destination Warehouse</Typography>
            <TextField
              fullWidth
              select
              size="small"
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
            >
              <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
              <MenuItem value="North Branch">North Branch</MenuItem>
            </TextField>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Internal Notes</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder='Instructions for receiving clerk'
            />
          </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddReceiptDialog
