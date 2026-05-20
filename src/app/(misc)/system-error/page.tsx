// Component Imports
import SystemError from '@views/SystemError'

// Utils Imports
import { getServerMode } from '@core/utils/serverHelpers'

/**
 * System Error Page
 * - Displays when a system error occurs
 *
 * @returns System error page component
 */
const SystemErrorPage = async () => {
  const mode = await getServerMode()

  return <SystemError mode={mode} />
}

export default SystemErrorPage

