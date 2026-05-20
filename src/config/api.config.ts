/**
 * API Configuration
 * - Base URL for API calls
 * - Can be configured via environment variables
 */

export const API_CONFIG = {
  /**
   * Backend API Base URL
   * Default: Next.js API routes (relative)
   * Override: Set NEXT_PUBLIC_API_BASE_URL to point to NestJS backend
   */
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',

  /**
   * Backend API Timeout (ms)
   */
  TIMEOUT: 30000,

  /**
   * Whether to use NestJS backend
   */
  USE_NESTJS: !!process.env.NEXT_PUBLIC_API_BASE_URL,
} as const;

/**
 * Get full API URL
 */
export const getApiUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // If using NestJS, return full URL
  if (API_CONFIG.USE_NESTJS) {
    const baseUrl = API_CONFIG.BASE_URL.endsWith('/')
      ? API_CONFIG.BASE_URL.slice(0, -1)
      : API_CONFIG.BASE_URL;
    return `${baseUrl}/${cleanPath}`;
  }

  // Otherwise, use relative path for Next.js API routes
  return `/${cleanPath}`;
};

/**
 * API Endpoints
 * Mock endpoints for UI demo (no backend connection)
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    // LOGIN: 'auth/login',
    // REGISTER: 'auth/register',
    // REFRESH: 'auth/refresh',
    // PROFILE: 'system/profile',
    // CHANGE_PASSWORD: 'system/change-password',
  },
  // System
  SYSTEM: {
    USERS: 'system/users',
    USER_BY_ID: (id: string) => `system/users/${id}`,
    // USER_RESET_PASSWORD: (id: string) => `system/users/${id}/reset-password`,

    ROLES: 'system/roles',

    NOTIFICATIONS: 'system/notifications',
    NOTIFICATION_MARK_READ: (id: string) => `system/notifications/${id}/mark-read`,
    NOTIFICATION_MARK_UNREAD: (id: string) => `system/notifications/${id}/mark-unread`,
    NOTIFICATION_DISMISS: (id: string) => `system/notifications/${id}/dismiss`,

    SETTINGS: 'system/settings',
    MASTER_DATA: 'system/master-data',
  },
  // Recruit
  RECRUIT: {
    CANDIDATES: 'recruit/candidates',
    INTERVIEWS: 'recruit/interviews',
    INTERVIEW_BY_ID: (id: string) => `recruit/interviews/${id}`,
    JOBS: 'recruit/jobs',
    JOB_BY_ID: (id: string) => `recruit/jobs/${id}`,
  },
  // HRM
  HRM: {
    DEPARTMENTS: 'hrm/departments',
    POSITIONS: 'hrm/positions',
    JOB_RANKS: 'hrm/job-ranks',
    LOCATIONS: 'hrm/locations',
    JOB_TYPES: 'hrm/job-types',
    JOB_STATUSES: 'hrm/job-statuses',
    JOB_PRIORITIES: 'hrm/job-priorities',
  },

} as const;
