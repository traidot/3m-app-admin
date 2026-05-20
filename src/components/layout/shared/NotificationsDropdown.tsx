'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'
import type { MouseEvent, ReactNode } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { CustomAvatarProps } from '@core/components/mui/Avatar'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

// Util Imports
import { getInitials } from '@/utils/getInitials'

export type NotificationsType = {
  title: string
  subtitle: string
  time: string
  read: boolean
} & (
  | {
      avatarImage?: string
      avatarIcon?: never
      avatarText?: never
      avatarColor?: never
      avatarSkin?: never
    }
  | {
      avatarIcon?: string
      avatarColor?: ThemeColor
      avatarSkin?: CustomAvatarProps['skin']
      avatarImage?: never
      avatarText?: never
    }
  | {
      avatarText?: string
      avatarColor?: ThemeColor
      avatarSkin?: CustomAvatarProps['skin']
      avatarImage?: never
      avatarIcon?: never
    }
)

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <div className='overflow-x-hidden bs-full'>{children}</div>
  } else {
    return (
      <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const getAvatar = (
  params: Pick<NotificationsType, 'avatarImage' | 'avatarIcon' | 'title' | 'avatarText' | 'avatarColor' | 'avatarSkin'>
) => {
  const { avatarImage, avatarIcon, avatarText, title, avatarColor, avatarSkin } = params

  if (avatarImage) {
    return <Avatar src={avatarImage} />
  } else if (avatarIcon) {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        <i className={avatarIcon} />
      </CustomAvatar>
    )
  } else {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        {avatarText || getInitials(title)}
      </CustomAvatar>
    )
  }
}

interface NotificationDropdownProps {
  notifications?: NotificationsType[]
  loading?: boolean
  onMarkAsRead?: (indexOrId: number | string) => void | Promise<void>
  onMarkAsUnread?: (indexOrId: number | string) => void | Promise<void>
  onMarkAllAsRead?: () => void | Promise<void>
  onMarkAllAsUnread?: () => void | Promise<void>
  onRefresh?: () => void
  onDismiss?: (notificationId: string) => void
  viewAllUrl?: string // URL for "View All Notifications" button
}

const NotificationDropdown = ({
  notifications: propNotifications,
  loading = false,
  onMarkAsRead,
  onMarkAsUnread,
  onMarkAllAsRead,
  onMarkAllAsUnread,
  onRefresh,
  onDismiss,
  viewAllUrl = '/notifications'
}: NotificationDropdownProps) => {
  const { t } = useI18n()
  // States
  const [open, setOpen] = useState(false)
  const notifications = propNotifications || []
  const [notificationsState, setNotificationsState] = useState(notifications)

  // Update local state when prop notifications change
  useEffect(() => {
    if (propNotifications) {
      setNotificationsState(propNotifications)
    }
  }, [propNotifications])

  // Vars
  const notificationCount = notificationsState.filter(notification => !notification.read).length
  const readAll = notificationsState.every(notification => notification.read)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  // Hooks
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { settings } = useSettings()

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  // Read/unread notification when notification is clicked or toggle button is clicked
  const handleReadNotification = async (event: MouseEvent<HTMLElement>, value: boolean, index: number) => {
    event.stopPropagation()
    const notification = notificationsState[index]
    const notificationId = (notification as any)?._id

    if (!notificationId) return

    // Optimize: Nếu đang mark as read mà notification đã đọc rồi thì skip API call
    if (value && notification.read) {
      // Đã đọc rồi, không cần gọi API nữa
      return
    }

    // Optimize: Nếu đang mark as unread mà notification chưa đọc thì skip API call
    if (!value && !notification.read) {
      // Chưa đọc, không cần gọi API mark-unread
      return
    }

    // Optimistic update: Update local state ngay lập tức để tránh giật
    setNotificationsState(prev => {
      return prev.map((n, idx) => {
        if (idx === index) {
          return { ...n, read: value }
        }

        return n
      })
    })

    try {
      // Call API to update read status
      if (value) {
        // Mark as read - chỉ gọi nếu chưa đọc
        if (onMarkAsRead) {
          // Pass notificationId directly for more reliable lookup
          await onMarkAsRead(notificationId)
        } else {
          // Lấy token để thêm vào Authorization header
          const { AuthService } = await import('@/services/auth/authService');
          const token = await AuthService.getAccessToken();

          const response = await fetch(`/api/notifications/${notificationId}/mark-read`, {
            method: 'PATCH',
            credentials: 'include', // Quan trọng: để gửi httpOnly cookies
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` }),
            },
          })
          if (!response.ok) {
            // Rollback on error
            setNotificationsState(prev => {
              return prev.map((n, idx) => {
                if (idx === index) {
                  return { ...n, read: !value }
                }
                return n
              })
            })
            return
          }
        }
      } else {
        // Mark as unread - chỉ gọi nếu đã đọc
        if (onMarkAsUnread) {
          // Pass notificationId directly for more reliable lookup
          await onMarkAsUnread(notificationId)
        } else {
          // Lấy token để thêm vào Authorization header
          const { AuthService } = await import('@/services/auth/authService');
          const token = await AuthService.getAccessToken();

          const response = await fetch(`/api/notifications/${notificationId}/mark-unread`, {
            method: 'PATCH',
            credentials: 'include', // Quan trọng: để gửi httpOnly cookies
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` }),
            },
          })
          if (!response.ok) {
            // Rollback on error
            setNotificationsState(prev => {
              return prev.map((n, idx) => {
                if (idx === index) {
                  return { ...n, read: !value }
                }
                return n
              })
            })
            return
          }
        }
      }

      // Không gọi onRefresh() nữa để tránh reload toàn bộ
      // useNotifications hook đã tự update state rồi
    } catch (error) {
      // Rollback on error
      setNotificationsState(prev => {
        return prev.map((n, idx) => {
          if (idx === index) {
            return { ...n, read: !value }
          }
          return n
        })
      })
      // Silent fail - error đã được xử lý ở optimistic update rollback
    }
  }

  // Remove notification when close icon is clicked
  const handleRemoveNotification = (event: MouseEvent<HTMLElement>, index: number) => {
    event.stopPropagation()
    const notification = notificationsState[index]

    // Get notification ID from _id if available
    const notificationId = (notification as any)?._id

    if (notificationId && onDismiss) {
      // Call dismiss API
      onDismiss(notificationId)
    }

    // Update local state immediately for better UX
    const newNotifications = [...notificationsState]
    newNotifications.splice(index, 1)
    setNotificationsState(newNotifications)
  }

  // Read or unread all notifications when read all icon is clicked
  const readAllNotifications = async () => {
    const previousNotifications = notificationsState.map(notification => ({ ...notification }))
    const nextReadState = !readAll

    setNotificationsState(prev =>
      prev.map(notification => ({
        ...notification,
        read: nextReadState,
      })),
    )

    try {
      if (!readAll) {
        if (onMarkAllAsRead) {
          await onMarkAllAsRead()
        }
      } else {
        if (onMarkAllAsUnread) {
          await onMarkAllAsUnread()
        }
      }
    } catch (error) {
      setNotificationsState(previousNotifications)
    }
  }

  useEffect(() => {
    const adjustPopoverHeight = () => {
      if (ref.current) {
        // Calculate available height, subtracting any fixed UI elements' height as necessary
        const availableHeight = window.innerHeight - 100

        ref.current.style.height = `${Math.min(availableHeight, 550)}px`
      }
    }

    window.addEventListener('resize', adjustPopoverHeight)
  }, [])

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleToggle}
        className='text-textPrimary'
        sx={{
          display: 'flex !important',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '40px',
          width: '40px',
          height: '40px',
          visibility: 'visible !important',
          opacity: '1 !important'
        }}
      >
        <Badge
          color='error'
          className='cursor-pointer'
          variant='dot'
          overlap='circular'
          invisible={notificationCount === 0}
          sx={{
            '& .MuiBadge-dot': { top: 6, right: 5, boxShadow: 'var(--mui-palette-background-paper) 0px 0px 0px 2px' }
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <i className='tabler-bell' style={{ fontSize: '20px', display: 'block' }} />
        </Badge>
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        ref={ref}
        anchorEl={anchorRef.current}
        {...(isSmallScreen
          ? {
              className: 'is-full !mbs-3 z-[1] max-bs-[550px] bs-[550px]',
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    padding: themeConfig.layoutPadding
                  }
                }
              ]
            }
          : { className: 'is-96 !mbs-3 z-[1] max-bs-[550px] bs-[550px]' })}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={classnames('bs-full', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='bs-full flex flex-col'>
                  <div className='flex items-center justify-between plb-3.5 pli-4 is-full gap-2'>
                    <Typography variant='h6' className='flex-auto'>
                      {t('header.notifications')}
                    </Typography>
                    {notificationCount > 0 ? (
                      <Chip size='small' variant='tonal' color='primary' label={`${notificationCount} ${t('header.new')}`} />
                    ) : null}
                    {notificationsState.length > 0 ? (
                      <Tooltip
                        title={readAll ? t('header.markAllAsUnread') : t('header.markAllAsRead')}
                        placement={placement === 'bottom-end' ? 'left' : 'right'}
                        slotProps={{
                          popper: {
                            sx: {
                              '& .MuiTooltip-tooltip': {
                                transformOrigin:
                                  placement === 'bottom-end' ? 'right center !important' : 'right center !important'
                              }
                            }
                          }
                        }}
                      >
                        <IconButton size='small' onClick={() => { void readAllNotifications() }} className='text-textPrimary'>
                          <i className={readAll ? 'tabler-mail' : 'tabler-mail-opened'} />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </div>
                  <Divider />
                  <ScrollWrapper hidden={hidden}>
                    {loading ? (
                      <Box className='flex items-center justify-center p-6'>
                        <Typography variant='body2' color='text.secondary'>
                          {t('form.loading')}
                        </Typography>
                      </Box>
                    ) : notificationsState.length === 0 ? (
                      <Box className='flex flex-col items-center justify-center p-6 gap-2'>
                        <i className='tabler-bell-off text-4xl text-textSecondary' />
                        <Typography variant='body2' color='text.secondary' className='text-center'>
                          {t('header.noNotifications')}
                        </Typography>
                      </Box>
                    ) : (
                      notificationsState.map((notification, index) => {
                      const {
                        title,
                        subtitle,
                        time,
                        read,
                        avatarImage,
                        avatarIcon,
                        avatarText,
                        avatarColor,
                        avatarSkin
                      } = notification

                      return (
                        <Box
                          key={index}
                          className={classnames(
                            'relative flex plb-3 pli-4 gap-3 cursor-pointer group',
                            {
                              'border-be': index !== notificationsState.length - 1
                            }
                          )}
                          onClick={e => handleReadNotification(e, true, index)}
                          sx={{
                            // Unread: primary background with 10% opacity, Read: transparent
                            bgcolor: read ? 'transparent' : 'rgb(var(--mui-palette-primary-mainChannel) / 0.1)',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              bgcolor: read ? 'action.hover' : 'rgb(var(--mui-palette-primary-mainChannel) / 0.15)'
                            }
                          }}
                        >
                          {getAvatar({ avatarImage, avatarIcon, title, avatarText, avatarColor, avatarSkin })}
                          <div className='flex flex-col flex-auto'>
                            <Typography variant='body2' className='font-medium mbe-1' color='text.primary'>
                              {title}
                            </Typography>
                            <Typography variant='caption' color='text.secondary' className='mbe-2'>
                              {subtitle}
                            </Typography>
                            <Typography variant='caption' color='text.disabled'>
                              {time}
                            </Typography>
                          </div>
                          {/* Right side buttons - X on top, Read/Unread toggle on bottom */}
                          <div className='flex flex-col items-end justify-between min-h-full'>
                            {/* X button - top right */}
                            <IconButton
                              size='small'
                              className='text-textSecondary hover:text-error invisible group-hover:visible mie-0'
                              onClick={e => handleRemoveNotification(e, index)}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                minWidth: 'auto',
                                width: 24,
                                height: 24
                              }}
                            >
                              <i className='tabler-x text-lg' />
                            </IconButton>
                            {/* Read/Unread toggle - bottom right - Always visible */}
                            <IconButton
                              size='small'
                              className={classnames('text-textSecondary mie-0', {
                                'opacity-60': read
                              })}
                              onClick={e => handleReadNotification(e, !read, index)}
                              sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                minWidth: 'auto',
                                width: 24,
                                height: 24
                              }}
                              title={read ? t('notifications.markAsUnread') : t('notifications.markAsRead')}
                            >
                              <i className={read ? 'tabler-mail' : 'tabler-mail-opened'} />
                            </IconButton>
                          </div>
                        </Box>
                      )
                    })
                    )}
                  </ScrollWrapper>
                  <Divider />
                  <div className='p-4'>
                    <Button
                      fullWidth
                      variant='contained'
                      size='small'
                      href={viewAllUrl}
                      LinkComponent='a'
                    >
                      {t('header.viewAllNotifications')}
                    </Button>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default NotificationDropdown
