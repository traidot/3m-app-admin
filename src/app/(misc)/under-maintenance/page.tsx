// Component Imports
import UnderMaintenance from '@/views/UnderMaintenance'

// Utils Imports
import { getServerMode } from '@core/utils/serverHelpers'

/**
 * Under Maintenance Page
 * - Displays when the system is under maintenance
 *
 * @returns Under maintenance page component
 */
const UnderMaintenancePage = async () => {
  const mode = await getServerMode()

  return <UnderMaintenance mode={mode} />
}

export default UnderMaintenancePage
