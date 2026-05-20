// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import { SettingsProvider } from '@core/contexts/settingsContext'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

/**
 * Misc Layout Component
 * - Provides settings context for error pages (404, 401, system-error, etc.)
 * - Uses system mode to respect user's OS theme preference
 * - Clean layout without sidebar or navigation
 *
 * @param props - Component props containing children
 * @returns Misc layout with settings provider
 */
const MiscLayout = async (props: ChildrenType) => {
  const { children } = props

  /**
   * Get system mode for SettingsProvider
   */
  const systemMode = await getSystemMode()

  return (
    <SettingsProvider settingsCookie={null} mode={systemMode}>
      {children}
    </SettingsProvider>
  )
}

export default MiscLayout

