'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import AppDialog from '@/components/common/AppDialog'

interface AddInvoiceDialogProps {
  open: boolean
  onClose: () => void
}

const AddInvoiceDialog = ({ open, onClose }: AddInvoiceDialogProps) => {
  const [formData, setFormData] = useState({
    invoiceNo: '',
    vendor: '',
    poReference: '',
    grReference: '',
    date: '',
    dueDate: '',
    amount: 0,
    tax: 0,
    total: 0
  })

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title='Record Supplier Invoice'
      subtitle="Register vendor invoices and perform 3-way matching with POs and Goods Receipts"
      fullWidth
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={onClose}>Verify & Post</Button>
        </>
      }
    >
      <Grid2 container spacing={5}>
        <Grid2 size={{ xs: 12, md: 6 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Invoice Number</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder='e.g. INV-99821'
              value={formData.invoiceNo}
              onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
            />
          </Box>
        </Grid2>
        
        <Grid2 size={{ xs: 12, md: 6 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Supplier / Vendor</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder='Search vendor...'
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>PO Matching</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder='Enter PO #'
              value={formData.poReference}
              onChange={(e) => setFormData({ ...formData, poReference: e.target.value })}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Receipt (GRN) Matching</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder='Enter GR #'
              value={formData.grReference}
              onChange={(e) => setFormData({ ...formData, grReference: e.target.value })}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5 items-end justify-center h-full'>
              <Chip label="3-Way Match Pending" color="warning" size="small" variant="tonal" className="font-bold" />
           </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Invoice Date</Typography>
            <TextField
              fullWidth
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Payment Due Date</Typography>
            <TextField
              fullWidth
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Subtotal Amount</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder='0.00'
              value={formData.amount}
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Tax (VAT)</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder='0.00'
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
           <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Grand Total</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder='0.00'
              variant='filled'
              disabled
            />
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
            <Box className='p-4 bg-slate-50 border rounded flex items-center gap-4'>
                <i className='tabler-info-circle text-info text-2xl' />
                <Typography variant='body2' className='text-slate-600 font-medium'>
                    The system will automatically compare matching quantities and prices between the PO, Receipt, and this Invoice. Any discrepancies above 5% will flag this invoice for manager review.
                </Typography>
            </Box>
        </Grid2>
      </Grid2>
    </AppDialog>
  )
}

export default AddInvoiceDialog
