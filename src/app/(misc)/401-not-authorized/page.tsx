// Component Imports
import NotAuthorized from '@views/NotAuthorized'

// Utils Imports
import { getServerMode } from '@core/utils/serverHelpers'

/**
 * 401 Not Authorized Page
 * - Displays when user doesn't have permission to access a resource
 *
 * @returns 401 error page component
 */
const Error401 = async () => {
  const mode = await getServerMode()

  return <NotAuthorized mode={mode} />
}

export default Error401
