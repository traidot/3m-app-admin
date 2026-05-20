import { useState, useCallback } from 'react'
import { useErrorHandler } from '@/utils/errorHandler'

/**
 * Custom hook for managing API calls with loading and error states
 * Tích hợp với error handler để tự động xử lý errors theo categories
 * 
 * @returns API call management functions
 */
export const useApiCall = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { handle: handleError } = useErrorHandler()

  const executeApiCall = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      onSuccess?: (data: T) => void,
      onError?: (error: any) => void,
      errorHandlerOptions?: {
        showToast?: boolean
        showDialog?: boolean
        redirectToLogin?: boolean
        redirectToSystemError?: boolean
      }
    ): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        const result = await apiCall()
        onSuccess?.(result)
        return result
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        
        // Handle error với error handler (tự động show toast/dialog/redirect)
        handleError(err, errorHandlerOptions)
        
        // Call custom onError callback nếu có
        onError?.(err)
        
        // Avoid Next.js dev overlay by not using console.error
        console.warn('API call error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [handleError]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    executeApiCall,
    clearError
  }
}
