'use client'

// React Imports
import { ReactNode } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

interface CommonDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  width?: number | string
  anchor?: 'left' | 'right' | 'top' | 'bottom'
}

/**
 * CommonDrawer - Component drawer chung cho toàn hệ thống
 *
 * @param open - Trạng thái mở/đóng drawer
 * @param onClose - Callback khi đóng drawer
 * @param title - Tiêu đề drawer (hiển thị ở header)
 * @param subtitle - Phụ đề drawer (hiển thị dưới title, optional)
 * @param children - Nội dung drawer (hiển thị ở phần content)
 * @param footer - Footer content (hiển thị ở phần footer)
 * @param width - Độ rộng drawer (default: 400)
 * @param anchor - Vị trí drawer (default: 'right')
 */
export default function CommonDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 400,
  anchor = 'right',
}: CommonDrawerProps) {
  return (
    <Drawer
      open={open}
      anchor={anchor}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: typeof width === 'number' ? `${width}px` : width,
          background: 'var(--mui-palette-background-paper)',
        },
      }}
    >
      <Box className='flex flex-col h-full'>
        {/* Header */}
        <Box className='flex items-center justify-between pli-6 pbs-5 pbe-4 border-be border-divider'>
          <Box className='flex flex-col'>
            <Typography variant='h6' className='flex items-center gap-2'>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton size='small' onClick={onClose}>
            <i className='tabler-x' />
          </IconButton>
        </Box>

        {/* Content */}
        <Box className='flex-1 overflow-y-auto p-4'>{children}</Box>

        {/* Footer */}
        {footer && (
          <Box className='flex items-center justify-between pli-6 pbs-4 pbe-4 border-te border-divider'>
            {footer}
          </Box>
        )}
      </Box>
    </Drawer>
  )
}
