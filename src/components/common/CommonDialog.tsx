'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

interface CommonDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  actions?: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  contentSx?: SxProps<Theme>
  showDivider?: boolean
}

/**
 * CommonDialog - Component dialog chung cho toàn hệ thống
 *
 * @param open - Trạng thái mở/đóng dialog
 * @param onClose - Callback khi đóng dialog
 * @param title - Tiêu đề dialog (hiển thị ở header)
 * @param subtitle - Phụ đề dialog (hiển thị dưới title, optional)
 * @param children - Nội dung dialog (hiển thị ở phần content)
 * @param actions - Các nút action (hiển thị ở footer)
 * @param maxWidth - Độ rộng tối đa của dialog (default: 'sm')
 * @param fullWidth - Có full width không (default: true)
 * @param contentSx - Custom styles cho content
 * @param showDivider - Có hiển thị divider không (default: true)
 */
export default function CommonDialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  contentSx,
  showDivider = true,
}: CommonDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      {/* Header */}
      {(title || subtitle) && (
        <>
          <DialogTitle>
            {title && (
              <Typography variant='h6' component='div'>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </DialogTitle>
          {showDivider && <Divider />}
        </>
      )}

      {/* Content */}
      <DialogContent sx={contentSx}>
        {children}
      </DialogContent>

      {/* Footer */}
      {actions && (
        <>
          {showDivider && <Divider />}
          <DialogActions>
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

