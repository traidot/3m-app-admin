import 'server-only'

import { NextResponse } from 'next/server'

export type ApiErrorCategory = 'validation' | 'check' | 'business' | 'user' | 'system'

export interface ApiErrorBody {
  success: false
  error: {
    code: string
    message: string
    category?: ApiErrorCategory
    field?: string
    details?: unknown
  }
  timestamp: string
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly category: ApiErrorCategory
  readonly field?: string
  readonly details?: unknown

  constructor(opts: {
    code: string
    status: number
    message: string
    category?: ApiErrorCategory
    field?: string
    details?: unknown
  }) {
    super(opts.message)
    this.code = opts.code
    this.status = opts.status
    this.category = opts.category ?? 'system'
    this.field = opts.field
    this.details = opts.details
  }

  toJSON(): ApiErrorBody {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        category: this.category,
        field: this.field,
        details: this.details
      },
      timestamp: new Date().toISOString()
    }
  }

  toResponse(): NextResponse {
    return NextResponse.json(this.toJSON(), { status: this.status })
  }
}

export const ApiErrors = {
  badRequest: (message: string, details?: unknown) =>
    new ApiError({ code: 'BAD_REQUEST', status: 400, message, category: 'validation', details }),
  validation: (message: string, details?: unknown) =>
    new ApiError({ code: 'VALIDATION_ERROR', status: 400, message, category: 'validation', details }),
  unauthorized: (message = 'Authentication required') =>
    new ApiError({ code: 'UNAUTHORIZED', status: 401, message, category: 'user' }),
  forbidden: (message = 'Insufficient permissions') =>
    new ApiError({ code: 'FORBIDDEN', status: 403, message, category: 'user' }),
  notFound: (message = 'Resource not found') =>
    new ApiError({ code: 'NOT_FOUND', status: 404, message, category: 'user' }),
  conflict: (message: string, details?: unknown) =>
    new ApiError({ code: 'CONFLICT', status: 409, message, category: 'business', details }),
  internal: (message = 'Internal server error', details?: unknown) =>
    new ApiError({ code: 'INTERNAL_ERROR', status: 500, message, category: 'system', details })
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err
  if (err instanceof Error) {
    return ApiErrors.internal(err.message)
  }
  return ApiErrors.internal('Unknown error')
}
