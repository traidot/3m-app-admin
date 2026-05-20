'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// Hook Imports
import { useUser } from '@/hooks/useUser'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux-store'

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { clearTokenCache } from '@/lib/axios-client'

// Service Imports
import { AuthService } from '@/services/auth/authService'

// Component Imports
import ProfileDialog from '@/app/(module)/3m/profile/ProfileDialog'
import ChangePasswordDialog from '@/components/common/ChangePasswordDialog'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

// Status badge colors
const statusColors = {
  online: 'var(--mui-palette-success-main)',
  offline: 'var(--mui-palette-secondary-main)',
  away: 'var(--mui-palette-warning-main)',
  busy: 'var(--mui-palette-error-main)'
}

// Styled component for status badge
const StatusBadgeSpan = styled('span')<{ status?: 'online' | 'offline' | 'away' | 'busy' }>(({ status = 'offline' }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: statusColors[status],
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)',
  position: 'absolute',
  bottom: 0,
  right: 0,
  zIndex: 1
}))

// Styled component for badge content (deprecated, using StatusBadgeSpan instead)
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

// Styled component for role badge
const RoleBadge = styled('span')<{ role?: string }>(({ role }) => {
  let backgroundColor = 'var(--mui-palette-error-main)'

  if (role === 'sadmin') {
    backgroundColor = 'var(--mui-palette-warning-main)'
  } else if (role === 'admin') {
    backgroundColor = 'var(--mui-palette-success-main)'
  } else if (role === 'user') {
    backgroundColor = 'var(--mui-palette-info-main)'
  }

  return {
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor,
    color: 'white',
    boxShadow: '0 0 0 2px var(--mui-palette-background-paper)',
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    zIndex: 1
  }
})

// Function to get role label
const getRoleLabel = (role?: string): string => {
  switch (role) {
    case 'sadmin':
      return 'SADMIN'
    case 'admin':
      return 'ADMIN'
    case 'user':
      return 'USER'
    default:
      return ''
  }
}

const UserDropdown = () => {
  const { t } = useI18n()
  // States
  const [open, setOpen] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()
  const { user: jwtUser } = useUser() // Get user from JWT
  const { settings } = useSettings()
  const { lang: locale } = useParams()

  // Get current user status (default to offline since chatReducer is not in store)
  const currentUserStatus = 'offline'

  // Use JWT user
  const currentUser = {
    name: jwtUser?.name || 'Administrator',
    email: jwtUser?.email || 'admin@arai-ims.com',
    image: '/Users/david/.gemini/antigravity/brain/0a24ff7b-5ace-4a6f-b952-374979f04442/professional_avatar_admin_1776365951949.png',
  }

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale as Locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    try {
      // Dùng AuthService để logout
      await AuthService.logout()

      // Clear any cached data
      if (typeof window !== 'undefined') {
        // Clear token cache
        clearTokenCache()
        // Clear localStorage nếu có
        localStorage.clear()
        // Clear sessionStorage nếu có
        sessionStorage.clear()
      }

      // Redirect to login page sau khi logout
      // Dùng window.location.href để force reload và clear state
      window.location.href = getLocalizedUrl('/login', locale as Locale)
    } catch (error) {
      console.error('Logout error:', error)
      // Vẫn redirect về login ngay cả khi có lỗi
      if (typeof window !== 'undefined') {
        window.location.href = getLocalizedUrl('/login', locale as Locale)
      }
    }
  }

  return (
    <>
      <div
        ref={anchorRef}
        className='flex items-center gap-2 cursor-pointer plb-1 pli-2 rounded hover:bg-action-hover transition-colors mis-2 relative'
        onClick={handleDropdownOpen}
      >
        <div className='relative'>
          <Avatar
            alt={currentUser.name || ''}
            src={currentUser.image || ''}
            className='bs-[38px] is-[38px]'
            sx={{ border: '2px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            {!currentUser.image && currentUser.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          {getRoleLabel(jwtUser?.role) && (
            <RoleBadge role={jwtUser?.role}>
              {getRoleLabel(jwtUser?.role)}
            </RoleBadge>
          )}
          <StatusBadgeSpan status={currentUserStatus as 'online' | 'offline' | 'away' | 'busy'} />
        </div>
        {/* <div className='flex items-start flex-col min-is-0'>
          <Typography className='font-medium truncate max-is-[200px]' color='text.primary'>
            {currentUser.name || ''}
          </Typography>
          <Typography variant='caption' className='truncate max-is-[200px]' color='text.secondary'>
            {currentUser.email || ''}
          </Typography>
        </div> */}
      </div>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar alt={currentUser.name || ''} src={currentUser.image || ''}>
                      {!currentUser.image && currentUser.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {currentUser.name || ''}
                      </Typography>
                      <Typography variant='caption'>{currentUser.email || ''}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem
                    className='mli-2 gap-3'
                    onClick={e => {
                      handleDropdownClose(e)
                      setProfileDialogOpen(true)
                    }}
                  >
                    <i className='tabler-user' />
                    <Typography color='text.primary'>{t('header.myProfile')}</Typography>
                  </MenuItem>
                  <MenuItem
                    className='mli-2 gap-3'
                    onClick={e => {
                      handleDropdownClose(e)
                      setChangePasswordDialogOpen(true)
                    }}
                  >
                    <i className='tabler-lock' />
                    <Typography color='text.primary'>{t('header.changePassword')}</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/system/settings')}>
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>{t('header.settings')}</Typography>
                  </MenuItem>
                  <Divider className='mlb-1' />
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      {t('header.logout')}
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Profile Dialog */}
      <ProfileDialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        onChangePassword={async (oldPassword: string, newPassword: string) => {
          // TODO: Implement change password với AuthService
          // await AuthService.changePassword({ oldPassword, newPassword })
          throw new Error('Change password chưa được implement')
        }}
      />
    </>
  )
}

export default UserDropdown


