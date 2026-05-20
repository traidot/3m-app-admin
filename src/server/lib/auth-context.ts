import 'server-only'

import type { NextRequest } from 'next/server'

import { ApiErrors } from './api-error'
import { type AccessTokenPayload, verifyAccessToken } from './jwt'

export const ACCESS_TOKEN_COOKIE = 'accessToken'
export const REFRESH_TOKEN_COOKIE = 'refreshToken'

export interface AuthContext {
  userId: string
  email: string
  roles: string[]
  permissions: string[]
  raw: AccessTokenPayload
}

/**
 * Extract bearer token from a request (header first, cookie fallback).
 */
export function extractAccessToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization')
  if (header?.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim()
  }
  return req.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null
}

/**
 * Resolve the current AuthContext from a request, or throw 401.
 */
export function requireAuth(req: NextRequest): AuthContext {
  const token = extractAccessToken(req)
  if (!token) throw ApiErrors.unauthorized()
  const payload = verifyAccessToken(token)
  return {
    userId: payload.sub,
    email: payload.email,
    roles: payload.roles ?? [],
    permissions: payload.permissions ?? [],
    raw: payload
  }
}

/**
 * Best-effort auth resolver — returns null when no/invalid token.
 */
export function tryAuth(req: NextRequest): AuthContext | null {
  try {
    return requireAuth(req)
  } catch {
    return null
  }
}

/**
 * Enforce that the caller has at least one of the given roles.
 */
export function requireRole(roles: string | string[], req: NextRequest): AuthContext {
  const ctx = requireAuth(req)
  const allowed = Array.isArray(roles) ? roles : [roles]
  if (!ctx.roles.some(r => allowed.includes(r))) {
    throw ApiErrors.forbidden(`Requires role: ${allowed.join(' | ')}`)
  }
  return ctx
}

/**
 * Enforce that the caller has the given permission key.
 * Permissions in the token are flat strings (e.g. "products.update").
 */
export function requirePermission(permission: string, req: NextRequest): AuthContext {
  const ctx = requireAuth(req)
  if (!ctx.permissions.includes(permission)) {
    throw ApiErrors.forbidden(`Requires permission: ${permission}`)
  }
  return ctx
}
