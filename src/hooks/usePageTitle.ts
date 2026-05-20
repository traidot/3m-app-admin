import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from './useUser'

/**
 * Custom hook to set page title automatically
 * Usage: usePageTitle('Dashboard') in any page component
 */
export const usePageTitle = (title: string) => {
  const { user, loading } = useUser()
  const pathname = usePathname()

  useEffect(() => {
    // Don't set title if user is still loading
    if (loading) {
      return
    }

    if (!user) {
      // If no user after loading, don't set title
      return
    }

    // Set page title directly using document.title
    if (typeof window !== 'undefined') {
      document.title = `${title} | Tenant`
    }
  }, [title, user, loading, pathname])
}
