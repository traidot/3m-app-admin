import 'server-only'

import { ApiErrors } from './api-error'

const ALLOWED_PAGE_SIZES = [10, 20, 50, 100] as const
type AllowedPageSize = (typeof ALLOWED_PAGE_SIZES)[number]
const DEFAULT_PAGE_SIZE: AllowedPageSize = 20

export interface PageInput {
  page: number
  pageSize: number
  skip: number
  take: number
}

export function parsePage(searchParams: URLSearchParams): PageInput {
  const pageRaw = searchParams.get('page')
  const sizeRaw = searchParams.get('pageSize')

  const page = pageRaw ? Math.max(1, Number.parseInt(pageRaw, 10)) : 1
  const requestedSize = sizeRaw ? Number.parseInt(sizeRaw, 10) : DEFAULT_PAGE_SIZE
  const pageSize = (ALLOWED_PAGE_SIZES as readonly number[]).includes(requestedSize)
    ? (requestedSize as AllowedPageSize)
    : DEFAULT_PAGE_SIZE

  if (Number.isNaN(page) || Number.isNaN(pageSize)) {
    throw ApiErrors.validation('Invalid pagination parameters', { field: 'page|pageSize' })
  }

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  }
}

export interface SortInput<TField extends string> {
  field: TField
  direction: 'asc' | 'desc'
}

/**
 * Parse `?sort=field` or `?sort=-field` against an allowlist.
 * Returns null when no sort is specified.
 */
export function parseSort<TField extends string>(
  searchParams: URLSearchParams,
  allowed: readonly TField[],
  fallback?: SortInput<TField>
): SortInput<TField> | null {
  const raw = searchParams.get('sort')
  if (!raw) return fallback ?? null

  const direction: 'asc' | 'desc' = raw.startsWith('-') ? 'desc' : 'asc'
  const field = raw.replace(/^[-+]/, '') as TField

  if (!allowed.includes(field)) {
    throw ApiErrors.validation(`Sort field not allowed: ${field}`, {
      field: 'sort',
      details: { allowed }
    })
  }

  return { field, direction }
}

/**
 * Convert a SortInput to a Prisma `orderBy` clause.
 */
export function toOrderBy<T extends string>(
  sort: SortInput<T> | null
): Record<T, 'asc' | 'desc'> | undefined {
  if (!sort) return undefined
  return { [sort.field]: sort.direction } as Record<T, 'asc' | 'desc'>
}

/**
 * Trim, then return undefined when empty — keeps Prisma `where` clauses clean.
 */
export function nonEmpty(value: string | null | undefined): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
