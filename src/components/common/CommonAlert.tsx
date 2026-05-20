'use client'

// React Imports
import { ReactNode } from 'react'

// MUI Imports
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import AlertTitle from '@mui/material/AlertTitle'
import type { AlertColor } from '@mui/material'

interface CommonAlertProps {
  open: boolean
  onClose: () => void
  severity?: AlertColor
  title?: string
  message: ReactNode
  autoHideDuration?: number | null
  anchorOrigin?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
  variant?: 'standard' | 'filled' | 'outlined'
}

/**
 * CommonAlert - Component alert chung cho toàn hệ thống
 *
 * @param open - Trạng thái hiển thị/ẩn alert
 * @param onClose - Callback khi đóng alert
 * @param severity - Loại alert: 'success' | 'error' | 'warning' | 'info' (default: 'info')
 * @param title - Tiêu đề alert (optional)
 * @param message - Nội dung alert
 * @param autoHideDuration - Thời gian tự động đóng (ms). null để không tự đóng (default: 6000)
 * @param anchorOrigin - Vị trí hiển thị alert (default: { vertical: 'top', horizontal: 'right' })
 * @param variant - Kiểu hiển thị: 'standard' | 'filled' | 'outlined' (default: 'standard')
 */
export default function CommonAlert({
  open,
  onClose,
  severity = 'info',
  title,
  message,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  variant = 'standard',
}: CommonAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        sx={{
          width: '100%',
          backgroundColor: severity === 'success' ? 'var(--mui-palette-success-main)' : severity === 'error' ? 'var(--mui-palette-error-main)' : severity === 'warning' ? 'var(--mui-palette-warning-main)' : 'var(--mui-palette-info-main)',
          color: severity === 'success' ? 'var(--mui-palette-success-contrastText)' : severity === 'error' ? 'var(--mui-palette-error-contrastText)' : severity === 'warning' ? 'var(--mui-palette-warning-contrastText)' : 'var(--mui-palette-info-contrastText)',
          boxShadow: 'var(--mui-customShadows-sm)',
        }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  )
}
