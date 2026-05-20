'use client'

/**
 * Network Error Banner
 * - Hiển thị banner khi backend không kết nối được
 * - Tự động ẩn khi kết nối lại được
 * - Có nút retry để thử kết nối lại
 */

import { Alert, AlertTitle, Box, Button, IconButton, Collapse } from '@mui/material'
import { useNetworkStatus } from '@/contexts/NetworkStatusContext'
import { useCallback, useState } from 'react'

const NetworkErrorBanner = () => {
  const { state, retryConnection, clearNetworkError } = useNetworkStatus()
  const [isRetrying, setIsRetrying] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  /**
   * Handle retry connection
   */
  const handleRetry = useCallback(async () => {
    setIsRetrying(true)
    try {
      const success = await retryConnection()
      if (success) {
        setIsDismissed(false)
      }
    } finally {
      setIsRetrying(false)
    }
  }, [retryConnection])

  /**
   * Handle dismiss (tạm thời ẩn banner)
   */
  const handleDismiss = useCallback(() => {
    setIsDismissed(true)
    // Auto-show lại sau 30 giây nếu vẫn còn error
    setTimeout(() => {
      if (state.isNetworkError) {
        setIsDismissed(false)
      }
    }, 30000)
  }, [state.isNetworkError])

  // Không hiển thị nếu không có network error hoặc đã dismiss
  if (!state.isNetworkError || isDismissed) {
    return null
  }

  return (
    <Collapse in={state.isNetworkError && !isDismissed}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1300, // Higher than AppBar (1100)
          width: '100%',
        }}
      >
        <Alert
          severity='error'
          sx={{
            borderRadius: 0, // Full width banner
            '& .MuiAlert-action': {
              alignItems: 'center',
            },
          }}
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                color='inherit'
                size='small'
                onClick={handleRetry}
                disabled={isRetrying}
                sx={{ minWidth: 'auto' }}
              >
                {isRetrying ? 'Đang thử...' : 'Thử lại'}
              </Button>
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={handleDismiss}
              >
                <i className='tabler-x' />
              </IconButton>
            </Box>
          }
        >
          <AlertTitle>Không thể kết nối đến backend</AlertTitle>
          {state.errorMessage || 'Vui lòng kiểm tra backend có đang chạy không.'}
          {state.retryCount > 1 && (
            <Box component='span' sx={{ ml: 1, fontSize: '0.875rem', opacity: 0.8 }}>
              (Đã thử {state.retryCount} lần)
            </Box>
          )}
        </Alert>
      </Box>
    </Collapse>
  )
}

export default NetworkErrorBanner

