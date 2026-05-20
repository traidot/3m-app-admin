import 'server-only'

import { NextResponse } from 'next/server'

import { ApiError, ApiErrors, toApiError } from './api-error'

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiSuccessBody<T> {
  success: true
  data: T
  pagination?: PaginationMeta
  timestamp: string
}

export function ok<T>(data: T, init?: { pagination?: PaginationMeta; status?: number }): NextResponse {
  const body: ApiSuccessBody<T> = {
    success: true,
    data,
    pagination: init?.pagination,
    timestamp: new Date().toISOString()
  }
  return NextResponse.json(body, { status: init?.status ?? 200 })
}

export function created<T>(data: T): NextResponse {
  return ok(data, { status: 201 })
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

export function buildPagination(opts: { page: number; pageSize: number; total: number }): PaginationMeta {
  return {
    page: opts.page,
    pageSize: opts.pageSize,
    total: opts.total,
    totalPages: opts.pageSize > 0 ? Math.ceil(opts.total / opts.pageSize) : 0
  }
}

export type RouteHandler<TArgs extends unknown[]> = (...args: TArgs) => Promise<NextResponse>

/**
 * Wrap a route handler so thrown ApiError / unknown errors become consistent JSON responses.
 */
export function withApi<TArgs extends unknown[]>(handler: RouteHandler<TArgs>): RouteHandler<TArgs> {
  return async (...args) => {
    try {
      return await handler(...args)
    } catch (err) {
      const apiErr = toApiError(err)
      if (apiErr.status >= 500) {
        // eslint-disable-next-line no-console
        console.error('[api] unhandled error', err)
      }
      return apiErr.toResponse()
    }
  }
}

/**
 * Generic schema-parse helper. Accepts any object exposing `.parse` or `.safeParse`,
 * so it works with both Zod-style and Valibot-style schemas without forcing a dep.
 */
export function parseInput<T>(
  schema: { parse?: (v: unknown) => T; safeParse?: (v: unknown) => { success: boolean; data?: T; error?: unknown } },
  value: unknown,
  field?: string
): T {
  if (schema.safeParse) {
    const r = schema.safeParse(value)
    if (r.success) return r.data as T
    throw ApiErrors.validation('Invalid request payload', { field, issues: r.error })
  }
  if (schema.parse) {
    try {
      return schema.parse(value)
    } catch (err) {
      throw ApiErrors.validation('Invalid request payload', { field, issues: err })
    }
  }
  throw ApiErrors.internal('parseInput called with unsupported schema')
}

export { ApiError, ApiErrors }
