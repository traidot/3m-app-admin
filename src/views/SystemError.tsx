'use client'

// Next Imports
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Service Imports
import { AuthService } from '@/services/auth/authService'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

// Styled Components
const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const SystemError = ({ mode }: { mode: SystemMode }) => {
  const { t } = useI18n()
  // Vars
  const darkImg = '/images/pages/misc-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'

  // Hooks
  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const miscBackground = useImageVariant(mode, lightImg, darkImg)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AuthService.getAccessToken()
        const authenticated = !!token
        setIsAuthenticated(authenticated)
      } catch {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Handle Back To Trang chủ button click
  const handleBackToHome = () => {
    // Check if authenticated and determine dashboard route
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      // No authentication - redirect to login
      router.push('/login')
    }
  }

  // Handle Retry button click
  const handleRetry = () => {
    // Reload page để retry
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
          <Typography className='font-medium text-8xl' color='text.primary'>
            500
          </Typography>
          <Typography variant='h4'>{t('misc.systemError.title')}</Typography>
          <Typography>
            {t('misc.systemError.description')}
          </Typography>
        </div>
        <div className='flex gap-4'>
          <Button onClick={handleRetry} variant='contained'>
            {t('misc.systemError.retry')}
          </Button>
          <Button onClick={handleBackToHome} variant='outlined'>
            {t('misc.systemError.backToHome')}
          </Button>
        </div>
        <img
          alt='error-500-illustration'
          src='/images/illustrations/characters/2.png'
          className='object-cover bs-[400px] md:bs-[450px] lg:bs-[500px] mbs-10 md:mbs-14 lg:mbs-20'
        />
      </div>
      {!hidden && (
        <MaskImg
          alt='mask'
          src={miscBackground}
          className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
        />
      )}
    </div>
  )
}

export default SystemError

