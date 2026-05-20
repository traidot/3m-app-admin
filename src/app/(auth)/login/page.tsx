'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

/**
 * Quick login user type
 */
type QuickLoginUser = {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string | null
}

/**
 * Login Page Component
 * - Handles user authentication
 * - Supports quick login for demo/dev users
 * - Handles redirects after login
 * - Manages form state and error handling
 *
 * @returns Login page component
 */
const LoginPage = () => {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State management
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [quickUsers, setQuickUsers] = useState<QuickLoginUser[]>([])
  const [quickUsersLoading, setQuickUsersLoading] = useState(false)
  const [quickLoginUserId, setQuickLoginUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    password: 'admin123',
  })

  // Illustration image paths
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()

  /**
   * Load quick login users for demo/dev mode
   */
  const loadQuickUsers = async () => {
    try {
      setQuickUsersLoading(true)
      // Mock dev users for UI demo
      const mockUsers = [
        { id: '1', email: 'admin@3m-app.local', name: '3M Admin', role: 'Full Access' },
        { id: '2', email: 'agent@3m-app.local', name: 'Agent: TravelConnect', role: 'Downstream' },
      ]
      const data = { users: mockUsers }
      if (Array.isArray(data.users)) {
        setQuickUsers(data.users)
      }
    } catch (error) {
      console.error('[LoginPage] Error loading dev users', error)
    } finally {
      setQuickUsersLoading(false)
    }
  }

  useEffect(() => {
    loadQuickUsers()
  }, [])

  /**
   * Read error message from query parameter (when redirected from guard)
   * Remove message from URL after displaying to avoid showing again on refresh
   */
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setErrorState(decodeURIComponent(message))
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('message')
      // Keep 'from' parameter for redirect after login
      const newUrl = newSearchParams.toString() ? `?${newSearchParams.toString()}` : '/login'
      router.replace(newUrl)
    }
  }, [searchParams, router])

  // State for illustrations to avoid hydration mismatch
  // Start with default values (light mode) to match server render
  const [authBackground, setAuthBackground] = useState(lightImg)
  const [characterIllustration, setCharacterIllustration] = useState(lightIllustration)

  // State for client-only values to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false)

  // Media query hook - only has value on client-side
  // Default to true (hidden) to match server render
  const hiddenFromMediaQuery = useMediaQuery(theme.breakpoints.down('md'))
  const [hidden, setHidden] = useState(true)

  /**
   * Update client-only values after mount to avoid hydration mismatch
   */
  useEffect(() => {
    setIsMounted(true)
    setHidden(hiddenFromMediaQuery)
  }, [hiddenFromMediaQuery])

  /**
   * Update illustrations after mount to match client settings
   */
  useEffect(() => {
    if (!isMounted) return

    /**
     * Get system mode from settings
     * Convert 'system' mode to 'light' or 'dark' based on system preference
     */
    const getSystemMode = (): SystemMode => {
      const settingMode = settings?.mode || 'light'
      if (settingMode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return prefersDark ? 'dark' : 'light'
      }
      return settingMode as SystemMode
    }

    const mode = getSystemMode()
    const bordered = settings?.skin === 'bordered'
    const isDarkMode = mode === 'dark'

    // Update auth background
    setAuthBackground(isDarkMode ? darkImg : lightImg)

    // Update character illustration
    if (bordered && borderedLightIllustration && borderedDarkIllustration) {
      setCharacterIllustration(isDarkMode ? borderedDarkIllustration : borderedLightIllustration)
    } else {
      setCharacterIllustration(isDarkMode ? darkIllustration : lightIllustration)
    }
  }, [isMounted, settings?.mode, settings?.skin, darkImg, lightImg, darkIllustration, lightIllustration, borderedDarkIllustration, borderedLightIllustration])

  /**
   * Toggle password visibility
   */
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  /**
   * Handle redirect after successful login
   */
  const handlePostLoginSuccess = async () => {
    const redirectUrl = searchParams.get('from') || searchParams.get('redirectTo') || '/dashboard'
    const finalRedirectUrl = redirectUrl === '/login' ? '/dashboard' : redirectUrl

    window.location.href = finalRedirectUrl
  }

  /**
   * Handle form submission
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorState(null)
    setIsLoading(true)

    await handlePostLoginSuccess()
    setIsLoading(false)
  }

  /**
   * Handle quick login for demo/dev users
   * @param userId - User ID to login as
   */
  const handleQuickLogin = async (userId: string) => {
    setErrorState(null)
    setQuickLoginUserId(userId)
    setIsLoading(true)
    await handlePostLoginSuccess()
    setIsLoading(false)
    setQuickLoginUserId(null)
  }

  /**
   * Handle input field changes
   * @param field - Field name to update
   * @returns Event handler function
   */
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorState(null)
    setFormData({ ...formData, [field]: e.target.value })
  }

  return (
    <div className='flex bs-full justify-center'>
      {/* Left side - Illustration (hidden on mobile) */}
      <div
        className={classnames('flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden')}
      >
        {/* <LoginIllustration src={characterIllustration} alt='character-illustration' /> */}
        {isMounted && !hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>

      {/* Right side - Login Form */}
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href='/'
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h5'>Login</Typography>
          </div>
          {errorState && (
            <Alert
              severity='error'
              sx={{
                width: '100%',
                backgroundColor: 'error.main',
                color: 'common.white',
                '& .MuiAlert-icon': {
                  color: 'common.white'
                }
              }}
            >
              <Typography variant='body2' color='common.white'>
                {errorState}
              </Typography>
            </Alert>
          )}
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              value={formData.email}
              onChange={handleInputChange('email')}
              type='email'
            />
            <CustomTextField
              fullWidth
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox />} label={t('auth.rememberMe')} />
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
              {isLoading ? t('auth.loggingIn') : t('auth.login')}
            </Button>
          </form>
          {quickUsersLoading && (
            <div className='flex items-center gap-2'>
              <CircularProgress size={16} />
              <Typography variant='caption' className='text-textSecondary'>
                {t('auth.quickLoginLoading')}
              </Typography>
            </div>
          )}
          {!quickUsersLoading && quickUsers.length > 0 && (
            <div className='flex flex-col gap-2 border rounded-lg p-4 bg-backgroundPaper/30'>
              <Typography variant='body2' className='font-semibold'>
                {t('auth.quickLoginTitle')}
              </Typography>
              <Typography variant='caption' className='text-textSecondary'>
                {t('auth.quickLoginDescription')}
              </Typography>
              <div className='flex flex-wrap gap-2'>
                {quickUsers.map(user => (
                  <Button
                    key={user.id}
                    variant='outlined'
                    color='secondary'
                    disabled={isLoading && quickLoginUserId !== user.id}
                    onClick={() => handleQuickLogin(user.id)}
                  >
                    {quickLoginUserId === user.id && isLoading
                      ? t('auth.loggingIn')
                      : `${user.name}${user.role ? ` (${user.role})` : ''}`}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
