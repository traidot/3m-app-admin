'use client'

import type { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

type Severity = 'primary' | 'warning' | 'error' | 'info'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: ReactNode
  description?: ReactNode
  /** Pre-rendered content below the description (e.g. callout / list). */
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Color/severity of the icon + confirm button */
  severity?: Severity
  /** Tabler icon class (defaults based on severity) */
  icon?: string
  /** Loading state on the confirm button */
  loading?: boolean
  /** Disable confirm button */
  disableConfirm?: boolean
  maxWidth?: 'xs' | 'sm' | 'md'
}

const DEFAULT_ICON: Record<Severity, string> = {
  primary: 'tabler-info-circle',
  warning: 'tabler-alert-triangle',
  error: 'tabler-alert-octagon',
  info: 'tabler-info-circle'
}

const AppConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Huỷ',
  severity = 'primary',
  icon,
  loading = false,
  disableConfirm = false,
  maxWidth = 'xs'
}: Props) => {
  const finalIcon = icon ?? DEFAULT_ICON[severity]

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `rgba(var(--mui-palette-${severity}-mainChannel) / 0.10)`,
            color: `${severity}.main`,
            flexShrink: 0
          }}
        >
          <i className={`${finalIcon} text-[22px]`} />
        </Box>
        <Box sx={{ fontSize: '1.125rem', fontWeight: 600 }}>{title}</Box>
      </DialogTitle>
      <DialogContent>
        {description && <DialogContentText>{description}</DialogContentText>}
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant='tonal' color='secondary' onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant='contained'
          color={severity}
          onClick={onConfirm}
          disabled={loading || disableConfirm}
          startIcon={
            loading ? (
              <i className='tabler-loader-2 text-[18px] animate-spin' />
            ) : (
              <i className={`${finalIcon} text-[18px]`} />
            )
          }
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AppConfirmDialog
