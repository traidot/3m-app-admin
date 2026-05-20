/**
 * Permission Utilities
 *
 * Helper functions for working with permissions
 */

import { parsePermissionId, isValidPermissionFormat, getPermissionDisplayName, getPermissionDescription } from '@/config/permissions.constants'

/**
 * Check if user has permission
 * @param userPermissions - Set of user permissions
 * @param requiredPermission - Required permission
 * @returns true if user has permission
 */
export function hasPermission(userPermissions: Set<string> | string[], requiredPermission: string): boolean {
  const permissionsSet = Array.isArray(userPermissions) ? new Set(userPermissions) : userPermissions

  // Wildcard permission
  if (permissionsSet.has('*')) {
    return true
  }

  // Exact match
  if (permissionsSet.has(requiredPermission)) {
    return true
  }

  // Check wildcard patterns
  const parsed = parsePermissionId(requiredPermission)
  if (!parsed) {
    return false
  }

  // Check module.* pattern
  const moduleWildcard = `${parsed.module}.*`
  if (permissionsSet.has(moduleWildcard)) {
    return true
  }

  // Check module.resource.* pattern
  if (parsed.fullResource) {
    const resourceWildcard = `${parsed.fullResource}.*`
    if (permissionsSet.has(resourceWildcard)) {
      return true
    }
  }

  return false
}

/**
 * Check if user has any of the required permissions
 * @param userPermissions - Set of user permissions
 * @param requiredPermissions - Array of required permissions
 * @returns true if user has at least one permission
 */
export function hasAnyPermission(
  userPermissions: Set<string> | string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission))
}

/**
 * Check if user has all required permissions
 * @param userPermissions - Set of user permissions
 * @param requiredPermissions - Array of required permissions
 * @returns true if user has all permissions
 */
export function hasAllPermissions(
  userPermissions: Set<string> | string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission))
}

/**
 * Group permissions by module
 * @param permissions - Array of permission IDs
 * @returns Object with module as key and permissions array as value
 */
export function groupPermissionsByModule(permissions: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {}

  permissions.forEach(permission => {
    const parsed = parsePermissionId(permission)
    if (!parsed) {
      // Invalid permission, add to "other" group
      if (!grouped['other']) {
        grouped['other'] = []
      }
      grouped['other'].push(permission)
      return
    }

    const module = parsed.module
    if (!grouped[module]) {
      grouped[module] = []
    }
    grouped[module].push(permission)
  })

  return grouped
}

/**
 * Group permissions by resource (module.resource)
 * @param permissions - Array of permission IDs
 * @returns Object with fullResource as key and permissions array as value
 */
export function groupPermissionsByResource(permissions: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {}

  permissions.forEach(permission => {
    const parsed = parsePermissionId(permission)
    if (!parsed || !parsed.fullResource) {
      // Invalid permission, add to "other" group
      if (!grouped['other']) {
        grouped['other'] = []
      }
      grouped['other'].push(permission)
      return
    }

    const resource = parsed.fullResource
    if (!grouped[resource]) {
      grouped[resource] = []
    }
    grouped[resource].push(permission)
  })

  return grouped
}

/**
 * Get all modules from permissions
 * @param permissions - Array of permission IDs
 * @returns Array of unique module names
 */
export function getModulesFromPermissions(permissions: string[]): string[] {
  const modules = new Set<string>()

  permissions.forEach(permission => {
    const parsed = parsePermissionId(permission)
    if (parsed && parsed.module !== '*') {
      modules.add(parsed.module)
    }
  })

  return Array.from(modules).sort()
}

/**
 * Get all resources from permissions (for a specific module)
 * @param permissions - Array of permission IDs
 * @param module - Module name (optional)
 * @returns Array of unique resource names
 */
export function getResourcesFromPermissions(permissions: string[], module?: string): string[] {
  const resources = new Set<string>()

  permissions.forEach(permission => {
    const parsed = parsePermissionId(permission)
    if (parsed && parsed.fullResource) {
      if (!module || parsed.module === module) {
        resources.add(parsed.fullResource)
      }
    }
  })

  return Array.from(resources).sort()
}

/**
 * Get all actions from permissions (for a specific resource)
 * @param permissions - Array of permission IDs
 * @param fullResource - Full resource name (module.resource) (optional)
 * @returns Array of unique action names
 */
export function getActionsFromPermissions(permissions: string[], fullResource?: string): string[] {
  const actions = new Set<string>()

  permissions.forEach(permission => {
    const parsed = parsePermissionId(permission)
    if (parsed && parsed.action !== '*') {
      if (!fullResource || parsed.fullResource === fullResource) {
        actions.add(parsed.action)
      }
    }
  })

  return Array.from(actions).sort()
}

// Re-export from constants
export {
  parsePermissionId,
  isValidPermissionFormat,
  getPermissionDisplayName,
  getPermissionDescription,
}

