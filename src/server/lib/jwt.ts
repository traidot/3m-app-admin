import 'server-only'

import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import type { JwtPayload, SignOptions } from 'jsonwebtoken'

import { ApiErrors } from './api-error'

export interface AccessTokenPayload extends JwtPayload {
  sub: string
  email: string
  roles: string[]
  permissions?: string[]
}

const ACCESS_TTL_SECONDS = parseInt(process.env.JWT_ACCESS_TTL_SECONDS ?? '900', 10) // 15 min
const REFRESH_TTL_SECONDS = parseInt(process.env.JWT_REFRESH_TTL_SECONDS ?? '2592000', 10) // 30 days

function accessSecret(): string {
  const s = process.env.JWT_ACCESS_SECRET ?? process.env.NEXTAUTH_SECRET
  if (!s) throw ApiErrors.internal('JWT_ACCESS_SECRET is not configured')
  return s
}

export function signAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>, ttlSeconds = ACCESS_TTL_SECONDS): string {
  const opts: SignOptions = { expiresIn: ttlSeconds, algorithm: 'HS256' }
  return jwt.sign(payload, accessSecret(), opts)
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, accessSecret(), { algorithms: ['HS256'] })
    if (typeof decoded === 'string') throw ApiErrors.unauthorized('Malformed access token')
    return decoded as AccessTokenPayload
  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError') {
      throw ApiErrors.unauthorized('Access token expired')
    }
    throw ApiErrors.unauthorized('Invalid access token')
  }
}

export interface RefreshTokenMaterial {
  raw: string
  hash: string
  expiresAt: Date
  ttlSeconds: number
}

/**
 * Generate an opaque refresh token and its server-side hash.
 * Refresh tokens are NOT JWTs — we store only their hash and rotate on every refresh.
 */
export function generateRefreshToken(ttlSeconds = REFRESH_TTL_SECONDS): RefreshTokenMaterial {
  const raw = crypto.randomBytes(48).toString('base64url')
  const hash = hashRefreshToken(raw)
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)
  return { raw, hash, expiresAt, ttlSeconds }
}

export function hashRefreshToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex')
}

export const TokenTtl = {
  accessSeconds: ACCESS_TTL_SECONDS,
  refreshSeconds: REFRESH_TTL_SECONDS
}
