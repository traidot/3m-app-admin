'use client'

/**
 * Network Status Context
 * - Track network connection state (backend connectivity)
 * - Provide global state for network errors
 * - Auto-recovery when connection is restored
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface NetworkStatusState {
  isConnected: boolean
  isNetworkError: boolean
  errorMessage: string | null
  lastErrorTime: number | null
  retryCount: number
}

interface NetworkStatusContextType {
  state: NetworkStatusState
  setNetworkError: (error: { message: string; isNetworkError: boolean }) => void
  clearNetworkError: () => void
  retryConnection: () => Promise<boolean>
}

const NetworkStatusContext = createContext<NetworkStatusContextType | undefined>(undefined)

/**
 * Network Status Provider
 */
export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NetworkStatusState>({
    isConnected: true,
    isNetworkError: false,
    errorMessage: null,
    lastErrorTime: null,
    retryCount: 0,
  })

  /**
   * Set network error
   */
  const setNetworkError = useCallback((error: { message: string; isNetworkError: boolean }) => {
    if (!error.isNetworkError) {
      return // Chỉ xử lý network errors
    }

    setState(prev => ({
      isConnected: false,
      isNetworkError: true,
      errorMessage: error.message || 'Không thể kết nối đến backend',
      lastErrorTime: Date.now(),
      retryCount: prev.retryCount + 1,
    }))
  }, [])

  /**
   * Clear network error (khi kết nối lại được)
   */
  const clearNetworkError = useCallback(() => {
    setState(prev => ({
      isConnected: true,
      isNetworkError: false,
      errorMessage: null,
      lastErrorTime: null,
      retryCount: 0,
    }))
  }, [])

  /**
   * Retry connection
   */
  const retryConnection = useCallback(async () => {
    try {
      // Test connection bằng cách gọi health check hoặc simple API
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const testUrl = backendUrl 
        ? `${backendUrl}/health` 
        : '/api/health'

      const response = await fetch(testUrl, {
        method: 'GET',
        credentials: 'include',
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
      })

      if (response.ok) {
        clearNetworkError()
        return true
      } else {
        setNetworkError({
          message: 'Backend đang không phản hồi',
          isNetworkError: true,
        })
        return false
      }
    } catch (error) {
      setNetworkError({
        message: 'Không thể kết nối đến backend. Vui lòng kiểm tra backend có đang chạy không.',
        isNetworkError: true,
      })
      return false
    }
  }, [clearNetworkError, setNetworkError])

  /**
   * Listen to network errors từ axios interceptor
   */
  useEffect(() => {
    const handleNetworkError = (event: Event) => {
      const customEvent = event as CustomEvent
      const error = customEvent.detail as { message: string; isNetworkError: boolean }
      if (error && error.isNetworkError) {
        setNetworkError(error)
      }
    }

    window.addEventListener('api-network-error', handleNetworkError)

    return () => {
      window.removeEventListener('api-network-error', handleNetworkError)
    }
  }, [setNetworkError])

  /**
   * Auto-retry khi có network error
   * Retry sau mỗi 10 giây nếu vẫn còn error
   */
  useEffect(() => {
    if (!state.isNetworkError) {
      return
    }

    const interval = setInterval(() => {
      retryConnection()
    }, 10000) // Retry mỗi 10 giây

    return () => clearInterval(interval)
  }, [state.isNetworkError, retryConnection])

  /**
   * Listen to successful API calls để auto-clear error
   * Nếu có bất kỳ API call nào thành công sau khi có network error, clear error
   */
  useEffect(() => {
    if (!state.isNetworkError) {
      return
    }

    // Listen to window events từ axios interceptor
    const handleApiSuccess = () => {
      clearNetworkError()
    }

    window.addEventListener('api-success', handleApiSuccess)

    return () => {
      window.removeEventListener('api-success', handleApiSuccess)
    }
  }, [state.isNetworkError, clearNetworkError])

  return (
    <NetworkStatusContext.Provider
      value={{
        state,
        setNetworkError,
        clearNetworkError,
        retryConnection,
      }}
    >
      {children}
    </NetworkStatusContext.Provider>
  )
}

/**
 * Hook để sử dụng Network Status Context
 */
export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext)
  if (context === undefined) {
    throw new Error('useNetworkStatus must be used within NetworkStatusProvider')
  }
  return context
}

