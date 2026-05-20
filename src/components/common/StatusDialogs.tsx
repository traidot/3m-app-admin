'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import CommonDialog from './CommonDialog'
import CustomAvatar from '@core/components/mui/Avatar'
import type { ThemeColor } from '@core/types'

type StatusType = 'success' | 'error' | 'warning' | 'info'

interface StatusConfig {
  icon: string
  bg: string
  defaultTitle: string
  defaultDescription: string
  buttonColor: 'primary' | 'success' | 'error' | 'warning' | 'info'
  avatarColor: ThemeColor
}

const statusConfig: Record<StatusType, StatusConfig> = {
  success: {
    icon: 'tabler-circle-check',
    bg: 'rgba(var(--mui-palette-success-mainChannel) / 0.08)',
    defaultTitle: 'Thành công',
    defaultDescription: 'Thao tác đã được thực hiện thành công.',
    buttonColor: 'success',
    avatarColor: 'success',
  },
  error: {
    icon: 'tabler-alert-circle',
    bg: 'rgba(var(--mui-palette-error-mainChannel) / 0.08)',
    defaultTitle: 'Đã xảy ra lỗi',
    defaultDescription: 'Vui lòng kiểm tra lại và thử lại sau.',
    buttonColor: 'error',
    avatarColor: 'error',
  },
  warning: {
    icon: 'tabler-alert-triangle',
    bg: 'rgba(var(--mui-palette-warning-mainChannel) / 0.08)',
    defaultTitle: 'Cảnh báo',
    defaultDescription: 'Vui lòng xác nhận thông tin trước khi tiếp tục.',
    buttonColor: 'warning',
    avatarColor: 'warning',
  },
  info: {
    icon: 'tabler-info-circle',
    bg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.08)',
    defaultTitle: 'Thông báo',
    defaultDescription: 'Hệ thống đang xử lý yêu cầu của bạn.',
    buttonColor: 'primary',
    avatarColor: 'primary',
  },
}

interface StatusDialogProps {
  open: boolean
  onClose: () => void
  status: StatusType
  title?: string
  description?: ReactNode
  detail?: ReactNode
  actions?: ReactNode
  actionText?: string
  hideDefaultAction?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const StatusDialog = ({
  open,
  onClose,
  status,
  title,
  description,
  detail,
  actions,
  actionText,
  hideDefaultAction = false,
  maxWidth = 'xs',
}: StatusDialogProps) => {
  const config = statusConfig[status]

  const defaultAction = (
    <Button variant='contained' color={config.buttonColor} onClick={onClose}>
      {actionText ?? 'Đã hiểu'}
    </Button>
  )

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title={title ?? config.defaultTitle}
      maxWidth={maxWidth}
      actions={actions ?? (!hideDefaultAction ? defaultAction : undefined)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 3,
            borderRadius: 2,
            backgroundColor: config.bg,
          }}
        >
          <CustomAvatar
            skin='light'
            color={config.avatarColor}
            variant='rounded'
            sx={{ width: 48, height: 48, fontSize: '1.5rem' }}
          >
            <i className={config.icon} style={{ fontSize: 26 }} />
          </CustomAvatar>
          <Typography variant='body1' sx={{ color: 'text.primary' }}>
            {description ?? config.defaultDescription}
          </Typography>
        </Box>
        {detail}
      </Box>
    </CommonDialog>
  )
}

interface SimpleStatusDialogProps extends Omit<StatusDialogProps, 'status'> {}

export const SuccessDialog = (props: SimpleStatusDialogProps) => (
  <StatusDialog status='success' maxWidth='xs' {...props} />
)

export const ErrorDialog = (props: SimpleStatusDialogProps) => (
  <StatusDialog status='error' maxWidth='xs' {...props} />
)

export const WarningDialog = (props: SimpleStatusDialogProps) => (
  <StatusDialog status='warning' {...props} />
)

export const InfoDialog = (props: SimpleStatusDialogProps) => (
  <StatusDialog status='info' {...props} />
)

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'success' | 'error' | 'warning'
  loading?: boolean
  maxWidth?: 'xs' | 'sm' | 'md'
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận thao tác',
  description = 'Bạn có chắc chắn muốn tiếp tục thao tác này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmColor = 'error',
  loading = false,
  maxWidth = 'xs',
}: ConfirmDialogProps) => {
  const confirmHandler = () => {
    if (loading) return
    const result = onConfirm()
    return result
  }

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant='contained'
            color={confirmColor}
            onClick={confirmHandler}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color='inherit' /> : undefined}
          >
            {loading ? 'Đang xử lý...' : confirmText}
          </Button>
        </>
      }
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: 'rgba(var(--mui-palette-warning-mainChannel) / 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--mui-palette-warning-main)',
          }}
        >
          <i className='tabler-alert-triangle text-[24px]' />
        </Box>
        {typeof description === 'string' ? (
          <Typography variant='body1' color='text.primary'>
            {description}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, color: 'text.primary' }}>
            {description}
          </Box>
        )}
      </Box>
    </CommonDialog>
  )
}

export type { StatusDialogProps, ConfirmDialogProps }

