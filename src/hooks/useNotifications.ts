'use client'

import { useState, useEffect, useCallback } from 'react'
import type { NotificationsType } from '@components/layout/shared/NotificationsDropdown'
import { formatRelativeTime, formatDate } from '@/utils/localeFormatter'
import { axiosGet, axiosPatch } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api.config'
import { API_CONFIG } from '@/config/api.config'

interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  read_at?: string | null
  created_at: string
  user?: {
    id: string
    email: string
    name: string
  } | null
}

type NotificationWithId = NotificationsType & {
  _id?: string // Internal ID for tracking
}

/**
 * Hook to fetch and manage notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationWithId[]>([])
  const [notificationIds, setNotificationIds] = useState<Map<number, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Check authentication trước khi gọi API
      if (API_CONFIG.USE_NESTJS) {
        try {
          const { AuthService } = await import('@/services/auth/authService')
          const token = await AuthService.getAccessToken()
          if (!token) {
            // Chưa authenticated, skip API call
            setLoading(false)
            return
          }
        } catch (authError) {
          // Nếu check auth fail (network error, etc), skip API call
          setLoading(false)
          return
        }
      }

      // Lấy token để thêm vào Authorization header (backup nếu cookies không được gửi)
      let authHeader = '';
      try {
        const { AuthService } = await import('@/services/auth/authService');
        const token = await AuthService.getAccessToken();
        if (token) {
          authHeader = `Bearer ${token}`;
        }
      } catch (tokenError) {
        console.warn('[useNotifications] Could not get token:', tokenError);
      }

      const fetchResponse = await fetch('/api/notifications?page=1&limit=20', {
        method: 'GET',
        credentials: 'include', // Quan trọng: để gửi httpOnly cookies
        headers: {
          ...(authHeader && { 'Authorization': authHeader }),
        },
      })
      const response = await fetchResponse.json()

      if (response.success && response.data) {
        // Map NotificationItem to NotificationsType
        const idsMap = new Map<number, string>()
        const mapped: NotificationWithId[] = response.data.map((item: NotificationItem, index: number) => {
          idsMap.set(index, item.id)

          // If there's a user, use their initials (prefer text)
          if (item.user && item.user.name) {
            // Get initials from name (first 2 characters)
            const nameParts = item.user.name.trim().split(/\s+/)
            let avatarText = ''
            if (nameParts.length >= 2) {
              avatarText = `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
            } else if (nameParts.length === 1) {
              avatarText = nameParts[0].substring(0, 2).toUpperCase()
            }

            // Determine color based on type
            let avatarColor: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' = 'primary'
            switch (item.type) {
              case 'success':
                avatarColor = 'success'
                break
              case 'warning':
                avatarColor = 'warning'
                break
              case 'error':
                avatarColor = 'error'
                break
              case 'info':
                avatarColor = 'info'
                break
            }

            // Format time: relative time + date if >= 1 day
            let timeDisplay = '—'
            if (item.created_at) {
              const relativeTime = formatRelativeTime(item.created_at)
              const dateObj = new Date(item.created_at)
              const now = new Date()
              const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24))

              if (diffInDays >= 1) {
                // >= 1 day: show relative time + date
                const dateStr = formatDate(item.created_at)
                timeDisplay = `${relativeTime} (${dateStr})`
              } else {
                // < 1 day: only show relative time
                timeDisplay = relativeTime
              }
            }

            return {
              _id: item.id,
              title: item.title,
              subtitle: item.message,
              time: timeDisplay,
              read: item.is_read,
              avatarText,
              avatarColor
            } as NotificationWithId
          }

          // Otherwise use icon based on type
          let avatarIcon: string
          let avatarColor: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' = 'primary'

          switch (item.type) {
            case 'success':
              avatarIcon = 'tabler-check-circle'
              avatarColor = 'success'
              break
            case 'warning':
              avatarIcon = 'tabler-alert-triangle'
              avatarColor = 'warning'
              break
            case 'error':
              avatarIcon = 'tabler-alert-circle'
              avatarColor = 'error'
              break
            case 'info':
              avatarIcon = 'tabler-info-circle'
              avatarColor = 'info'
              break
            default:
              avatarIcon = 'tabler-bell'
              avatarColor = 'primary'
          }

          // Format time: relative time + date if >= 1 day
          let timeDisplay = '—'
          if (item.created_at) {
            const relativeTime = formatRelativeTime(item.created_at)
            const dateObj = new Date(item.created_at)
            const now = new Date()
            const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24))

            if (diffInDays >= 1) {
              // >= 1 day: show relative time + date
              const dateStr = formatDate(item.created_at)
              timeDisplay = `${relativeTime} (${dateStr})`
            } else {
              // < 1 day: only show relative time
              timeDisplay = relativeTime
            }
          }

          return {
            _id: item.id,
            title: item.title,
            subtitle: item.message,
            time: timeDisplay,
            read: item.is_read,
            avatarIcon,
            avatarColor
          } as NotificationWithId
        })

        setNotifications(mapped)
        setNotificationIds(idsMap)
      } else {
        const errorMessage = response.message;
        if (errorMessage) {
          setError(errorMessage)
        } else {
          setError('Failed to fetch notifications')
        }
      }
    } catch (err: any) {
      // Parse error để xử lý đúng cách
      const errorMessage = err.message;
      const isNetworkError = err.isNetworkError || err.statusCode === 0 ||
        (errorMessage && (
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('ERR_CONNECTION_REFUSED') ||
          errorMessage.includes('ERR_CONNECTION_RESET') ||
          errorMessage.includes('ERR_INTERNET_DISCONNECTED')
        ));

      // Xử lý network errors - hiển thị message rõ ràng cho user
      if (isNetworkError) {
        const networkMessage = errorMessage && errorMessage.includes('Không thể kết nối')
          ? errorMessage
          : 'Không thể kết nối đến backend. Vui lòng kiểm tra backend có đang chạy không.';
        setError(networkMessage);
      }
      // Xử lý session expired / 401 - silent fail (sẽ được xử lý bởi axios interceptor)
      else if (
        (errorMessage && errorMessage.includes('Session expired')) ||
        (errorMessage && errorMessage.includes('401'))
      ) {
        // Silent fail - axios interceptor sẽ redirect to login
        // Chỉ clear loading state
      } else {
        // Các lỗi khác - hiển thị error message
        const finalErrorMessage = errorMessage || 'Lỗi không xác định khi tải notifications';
        setError(finalErrorMessage);
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(
    async (indexOrId: number | string) => {
      // Support both index (number) and notificationId (string)
      let notificationId: string | undefined
      let index: number | undefined

      if (typeof indexOrId === 'string') {
        notificationId = indexOrId
        // Find index by notificationId
        index = notifications.findIndex(n => n._id === notificationId)
      } else {
        index = indexOrId
        notificationId = notificationIds.get(index)
      }

      if (!notificationId) {
        console.warn('[useNotifications] Notification ID not found for:', indexOrId)
        return
      }

      // Optimize: Check nếu notification đã đọc rồi thì skip API call
      const notification = notifications[index]
      if (notification && notification.read) {
        // Đã đọc rồi, không cần gọi API nữa
        return
      }

      try {
        // Lấy token để thêm vào Authorization header
        const { AuthService } = await import('@/services/auth/authService');
        const token = await AuthService.getAccessToken();

        // Luôn dùng Next.js API route để proxy request và forward cookies
        const fetchResponse = await fetch(`/api/notifications/${notificationId}/mark-read`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        })
        const response = await fetchResponse.json()

        if (response.success) {
          // Update local state - find by notificationId to ensure correct update
          setNotifications(prev => {
            const updated = prev.map(n => {
              if (n._id === notificationId) {
                return { ...n, read: true }
              }
              return n
            })
            return updated
          })
        }
      } catch (err) {
        // Silent fail - error đã được xử lý ở optimistic update rollback
      }
    },
    [notificationIds, notifications]
  )

  const markAsUnread = useCallback(
    async (indexOrId: number | string) => {
      // Support both index (number) and notificationId (string)
      let notificationId: string | undefined
      let index: number | undefined

      if (typeof indexOrId === 'string') {
        notificationId = indexOrId
        // Find index by notificationId
        index = notifications.findIndex(n => n._id === notificationId)
      } else {
        index = indexOrId
        notificationId = notificationIds.get(index)
      }

      if (!notificationId) {
        return
      }

      // Optimize: Check nếu notification chưa đọc thì skip API call
      const notification = notifications[index]
      if (notification && !notification.read) {
        // Chưa đọc, không cần gọi API mark-unread
        return
      }

      try {
        // Lấy token để thêm vào Authorization header
        const { AuthService } = await import('@/services/auth/authService');
        const token = await AuthService.getAccessToken();

        // Luôn dùng Next.js API route để proxy request và forward cookies
        const fetchResponse = await fetch(`/api/notifications/${notificationId}/mark-unread`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        })
        const response = await fetchResponse.json()

        if (response.success) {
          // Update local state - find by notificationId to ensure correct update
          setNotifications(prev => {
            return prev.map(n => {
              if (n._id === notificationId) {
                return { ...n, read: false }
              }
              return n
            })
          })
        }
      } catch (err) {
        // Silent fail - error đã được xử lý ở optimistic update rollback
      }
    },
    [notificationIds, notifications]
  )

  const markAllAsRead = useCallback(async () => {
    try {
      // Lấy token để thêm vào Authorization header
      const { AuthService } = await import('@/services/auth/authService');
      const token = await AuthService.getAccessToken();

      // Luôn dùng Next.js API route để proxy request và forward cookies
      const fetchResponse = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })
      const response = await fetchResponse.json()

      if (response.success) {
        // Update local state
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }
    } catch (err) {
      // Silent fail
    }
  }, [])

  const markAllAsUnread = useCallback(async () => {
    try {
      const { AuthService } = await import('@/services/auth/authService');
      const token = await AuthService.getAccessToken();

      const fetchResponse = await fetch('/api/notifications/mark-all-unread', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const response = await fetchResponse.json();

      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: false, read_at: null })));
      }
    } catch (err) {
      // Silent fail
    }
  }, [])

  const dismissNotification = useCallback(async (notificationId: string) => {
    try {
      // Lấy token để thêm vào Authorization header
      const { AuthService } = await import('@/services/auth/authService');
      const token = await AuthService.getAccessToken();

      // Luôn dùng Next.js API route để proxy request và forward cookies
      const fetchResponse = await fetch(`/api/notifications/${notificationId}/dismiss`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })
      const response = await fetchResponse.json()

      if (response.success) {
        // Remove from local state immediately
        setNotifications(prev => prev.filter(n => n._id !== notificationId))
        // Also remove from notificationIds map
        setNotificationIds(prev => {
          const newMap = new Map(prev)
          for (const [index, id] of newMap.entries()) {
            if (id === notificationId) {
              newMap.delete(index)
              break
            }
          }
          return newMap
        })
      }
    } catch (err) {
      // Silent fail
    }
  }, [])

  useEffect(() => {
    fetchNotifications()

    // Poll for new notifications every 300 seconds for better real-time experience
    const interval = setInterval(fetchNotifications, 300000)

    // Listen for custom event to refresh notifications immediately
    const handleRefreshEvent = () => {
      fetchNotifications()
    }
    window.addEventListener('refresh-notifications', handleRefreshEvent)

    return () => {
      clearInterval(interval)
      window.removeEventListener('refresh-notifications', handleRefreshEvent)
    }
  }, [fetchNotifications])

  return {
    notifications,
    loading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
    dismissNotification,
    setNotifications, // Expose để có thể update từ bên ngoài nếu cần
  }
}
