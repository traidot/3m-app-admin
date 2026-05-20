'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

/**
 * App Context
 * - Có thể detect thông tin từ domain/hostname nếu cần
 */

interface AppContextInfo {
  id: string
  slug: string
  schema_name?: string
  plan?: string
  status?: string
}

interface AppContextType {
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

/**
 * Detect context từ hostname
 */
async function detectTenantFromHostname(): Promise<AppContextInfo | null> {
  if (typeof window === 'undefined') {
    return null
  }

  const hostname = window.location.hostname
  if (!hostname) {
    return null
  }

  // Skip nếu là admin domain (được config trong env)
  const adminDomain = process.env.NEXT_PUBLIC_ADMIN_DOMAIN
  if (adminDomain && hostname === adminDomain) {
    return null
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!backendUrl) {
      return null
    }

    // Backend sẽ tự detect context từ domain nếu cần
    return null
  } catch (error) {
    console.error('[AppContext] Error detecting context from hostname:', error)
    return null
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  return (
    <AppContext.Provider
      value={{
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
