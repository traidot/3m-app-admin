'use client'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import type { SxProps } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'

type AppDialogProps = {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  children?: React.ReactNode
  contentSx?: SxProps
  variant?: 'default' | 'confirm'
}

export default function AppDialog({
  open,
  onClose,
  title,
  subtitle,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  children,
  contentSx,
  variant = 'default'
}: AppDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth}>
      {title ? (
        <DialogTitle component='div' sx={{ p: 0, m: 2 }}>
          <Box
            sx={{
              position: 'relative',
              py: 2,
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start'
            }}
          >
            <Typography variant='h6' component='div' sx={{ textAlign: 'left', width: '100%' }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography
                variant='body2'
                color='text.secondary'
                component='div'
                sx={{ textAlign: 'left', mt: 1, width: '100%' }}
              >
                {subtitle}
              </Typography>
            ) : null}
            <IconButton size='small' onClick={onClose} sx={{ position: 'absolute', top: 2, right: 2 }}>
              <i className='tabler-x' />
            </IconButton>
          </Box>
        </DialogTitle>
      ) : null}
      <DialogContent sx={{ py: 3, px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ...contentSx }}>{children}</Box>
      </DialogContent>
      {actions ? (
        <DialogActions sx={{ py: 2, px: 3, justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  )
}
