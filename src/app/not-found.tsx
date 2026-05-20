// Next.js 404 Not Found Page
// File này được Next.js tự động sử dụng khi route không tồn tại

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import NotFound from '@views/NotFound'
import { SettingsProvider } from '@core/contexts/settingsContext'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const NotFoundPage = async () => {
  // Vars
  const mode = await getServerMode()

  return (
    <SettingsProvider settingsCookie={null} mode={mode}>
      <NotFound mode={mode} />
    </SettingsProvider>
  )
}

export default NotFoundPage

