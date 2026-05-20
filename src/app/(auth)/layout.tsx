// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import { SettingsProvider } from '@core/contexts/settingsContext'

/**
 * Auth Layout Component
 * - Provides settings context for authentication pages
 * - Uses light mode by default (no dark mode for auth pages)
 * - Clean layout without sidebar or navigation
 *
 * @param props - Component props containing children
 * @returns Auth layout with settings provider
 */
const AuthLayout = (props: ChildrenType) => {
  const { children } = props

  return (
    <SettingsProvider settingsCookie={null} mode='light'>
      {children}
    </SettingsProvider>
  )
}

export default AuthLayout
