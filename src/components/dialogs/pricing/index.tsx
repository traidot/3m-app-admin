'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'

// Type Imports
import type { PricingPlanType } from '@/types/pages/pricingTypes'

// Component Imports
// import Pricing from '@components/pricing' // Component not found - commented out

type PricingProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data: PricingPlanType[]
}

const PricingDialog = ({ open, setOpen, data }: PricingProps) => {
  return (
    <Dialog
      fullWidth
      maxWidth='lg'
      open={open}
      onClose={() => setOpen(false)}
      scroll='body'
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogContent className='sm:p-16'>
        {/* Pricing component placeholder - component not found */}
        <div>Pricing component not available</div>
      </DialogContent>
    </Dialog>
  )
}

export default PricingDialog
