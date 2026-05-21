'use client'

import type { ReactNode } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

type Props = {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  /** Optional content rendered under the title row — e.g. avatar + chips */
  subject?: ReactNode
  /** Optional content rendered between subject and body — e.g. tabs */
  banner?: ReactNode
  footer?: ReactNode
  width?: number | { xs?: string | number; sm?: number; md?: number }
  children: ReactNode
}

const AppDrawer = ({
  open,
  onClose,
  title,
  subtitle,
  subject,
  banner,
  footer,
  width = 560,
  children
}: Props) => {
  const widthSx = typeof width === 'number' ? { width: { xs: '100%', sm: width } } : { width }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...widthSx,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 4,
          pt: 3,
          pb: subject ? 3 : 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0
        }}
      >
        <Box className='flex items-start justify-between gap-2'>
          <Box className='flex-1 min-is-0'>
            <Typography
              variant='overline'
              sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.8, lineHeight: 1.4 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant='body2' color='text.secondary' className='block'>
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton
            size='small'
            onClick={onClose}
            sx={{
              mt: -0.5,
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <i className='tabler-x text-[20px]' />
          </IconButton>
        </Box>

        {subject && <Box className='mbs-4'>{subject}</Box>}
      </Box>

      {banner && (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>{banner}</Box>
      )}

      {/* Body */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 4, py: 3 }}>{children}</Box>

      {/* Footer */}
      {footer && (
        <Box
          sx={{
            px: 4,
            py: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1.5
          }}
        >
          {footer}
        </Box>
      )}
    </Drawer>
  )
}

export default AppDrawer
