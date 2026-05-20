/**
 * Permission Constants and Utilities
 *
 * Helper functions for parsing and formatting permissions
 */

/**
 * Parsed permission structure
 */
export interface ParsedPermission {
  module: string
  resource?: string
  fullResource?: string // module.resource
  action: string
}

/**
 * Parse permission ID into components
 * Format: module.resource.action or module.action
 * @param permissionId - Permission ID string
 * @returns Parsed permission object or null if invalid
 */
export function parsePermissionId(permissionId: string): ParsedPermission | null {
  if (!permissionId || typeof permissionId !== 'string') {
    return null
  }

  // Handle wildcard
  if (permissionId === '*') {
    return {
      module: '*',
      action: '*',
    }
  }

  const parts = permissionId.split('.')
  
  // module.action format
  if (parts.length === 2) {
    return {
      module: parts[0],
      action: parts[1],
    }
  }

  // module.resource.action format
  if (parts.length === 3) {
    return {
      module: parts[0],
      resource: parts[1],
      fullResource: `${parts[0]}.${parts[1]}`,
      action: parts[2],
    }
  }

  return null
}

/**
 * Check if permission format is valid
 * @param permissionId - Permission ID string
 * @returns true if format is valid
 */
export function isValidPermissionFormat(permissionId: string): boolean {
  return parsePermissionId(permissionId) !== null
}

/**
 * Get display name for permission
 * @param permissionId - Permission ID string
 * @returns Display name
 */
export function getPermissionDisplayName(permissionId: string): string {
  const parsed = parsePermissionId(permissionId)
  if (!parsed) {
    return permissionId
  }

  if (permissionId === '*') {
    return 'All Permissions'
  }

  const actionNames: Record<string, string> = {
    create: 'Create',
    read: 'View',
    update: 'Edit',
    delete: 'Delete',
    '*': 'All Actions',
  }

  const actionName = actionNames[parsed.action] || parsed.action

  if (parsed.fullResource) {
    return `${parsed.fullResource}: ${actionName}`
  }

  return `${parsed.module}: ${actionName}`
}

/**
 * Get description for permission
 * @param permissionId - Permission ID string
 * @returns Description
 */
export function getPermissionDescription(permissionId: string): string {
  const parsed = parsePermissionId(permissionId)
  if (!parsed) {
    return `Invalid permission: ${permissionId}`
  }

  if (permissionId === '*') {
    return 'Full access to all modules and resources'
  }

  const actionDescriptions: Record<string, string> = {
    create: 'Can create new items',
    read: 'Can view items',
    update: 'Can edit existing items',
    delete: 'Can delete items',
    '*': 'Can perform all actions',
  }

  const actionDesc = actionDescriptions[parsed.action] || `Can perform ${parsed.action} action`

  if (parsed.fullResource) {
    return `${actionDesc} on ${parsed.fullResource}`
  }

  return `${actionDesc} in ${parsed.module} module`
}
