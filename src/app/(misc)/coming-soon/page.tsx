// Component Imports
import ComingSoon from '@/views/ComingSoon'

// Utils Imports
import { getServerMode } from '@core/utils/serverHelpers'

/**
 * Coming Soon Page
 * - Displays when a feature or page is under development
 *
 * @returns Coming soon page component
 */
const ComingSoonPage = async () => {
  const mode = await getServerMode()

  return <ComingSoon mode={mode} />
}

export default ComingSoonPage
