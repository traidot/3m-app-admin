'use client'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AppDialog from '@/components/common/AppDialog'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  confirmColor?: 'primary' | 'error' | 'warning'
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  confirmColor = 'error'
}: ConfirmationDialogProps) => {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color={confirmColor} onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </Button>
        </>
      }
    >
      <Typography variant="body1">{message}</Typography>
    </AppDialog>
  )
}

export default ConfirmationDialog
