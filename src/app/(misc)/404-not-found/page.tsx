// Component Imports
import NotFound from '@views/NotFound'

// Utils Imports
import { getServerMode } from '@core/utils/serverHelpers'

/**
 * 404 Not Found Page
 * - Displays when a page or resource is not found
 *
 * @returns 404 error page component
 */
const Error404 = async () => {
  const mode = await getServerMode()

  return <NotFound mode={mode} />
}

export default Error404
