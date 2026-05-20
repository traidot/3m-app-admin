import 'server-only'

import type { Prisma } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import { generateRefreshToken, hashRefreshToken, signAccessToken, TokenTtl } from '../lib/jwt'
import { verifyPassword } from '../lib/password'

export interface SessionTokens {
  accessToken: string
  refreshToken: string
  accessTtlSeconds: number
  refreshTtlSeconds: number
}

export interface AuthenticatedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  status: string
  roles: string[]
  permissions: string[]
}

const userWithRolesArgs = {
  include: {
    roles: {
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } }
          }
        }
      }
    }
  }
} satisfies Prisma.UserDefaultArgs

type UserWithRoles = Prisma.UserGetPayload<typeof userWithRolesArgs>

function flattenRolesAndPermissions(user: UserWithRoles): { roles: string[]; permissions: string[] } {
  const roles: string[] = []
  const permissions = new Set<string>()
  for (const ur of user.roles) {
    roles.push(ur.role.key)
    for (const rp of ur.role.permissions) permissions.add(rp.permission.key)
  }
  return { roles, permissions: Array.from(permissions) }
}

function toAuthenticatedUser(user: UserWithRoles): AuthenticatedUser {
  const { roles, permissions } = flattenRolesAndPermissions(user)
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    status: user.status,
    roles,
    permissions
  }
}

async function issueSession(user: UserWithRoles, meta: { userAgent?: string | null; ipAddress?: string | null }): Promise<SessionTokens> {
  const { roles, permissions } = flattenRolesAndPermissions(user)
  const accessToken = signAccessToken({ sub: user.id, email: user.email, roles, permissions })
  const refresh = generateRefreshToken()
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refresh.hash,
      userAgent: meta.userAgent ?? null,
      ipAddress: meta.ipAddress ?? null,
      expiresAt: refresh.expiresAt
    }
  })
  return {
    accessToken,
    refreshToken: refresh.raw,
    accessTtlSeconds: TokenTtl.accessSeconds,
    refreshTtlSeconds: refresh.ttlSeconds
  }
}

export async function authenticate(args: {
  email: string
  password: string
  userAgent?: string | null
  ipAddress?: string | null
}): Promise<{ user: AuthenticatedUser; tokens: SessionTokens }> {
  const user = await prisma.user.findUnique({ where: { email: args.email.toLowerCase() }, ...userWithRolesArgs })
  if (!user || user.deletedAt) throw ApiErrors.unauthorized('Invalid credentials')
  if (user.status !== 'active') throw ApiErrors.forbidden(`Account is ${user.status}`)

  const valid = await verifyPassword(args.password, user.passwordHash)
  if (!valid) throw ApiErrors.unauthorized('Invalid credentials')

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
  const tokens = await issueSession(user, { userAgent: args.userAgent, ipAddress: args.ipAddress })
  return { user: toAuthenticatedUser(user), tokens }
}

export async function rotateRefreshToken(args: {
  refreshToken: string
  userAgent?: string | null
  ipAddress?: string | null
}): Promise<{ user: AuthenticatedUser; tokens: SessionTokens }> {
  const tokenHash = hashRefreshToken(args.refreshToken)
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } })
  if (!existing) throw ApiErrors.unauthorized('Invalid refresh token')
  if (existing.revokedAt) throw ApiErrors.unauthorized('Refresh token revoked')
  if (existing.expiresAt.getTime() <= Date.now()) throw ApiErrors.unauthorized('Refresh token expired')

  const user = await prisma.user.findUnique({ where: { id: existing.userId }, ...userWithRolesArgs })
  if (!user || user.deletedAt || user.status !== 'active') throw ApiErrors.unauthorized('User unavailable')

  const tokens = await issueSession(user, { userAgent: args.userAgent, ipAddress: args.ipAddress })
  // Mark old token revoked + replaced
  const replacement = await prisma.refreshToken.findUnique({ where: { tokenHash: hashRefreshToken(tokens.refreshToken) } })
  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date(), replacedById: replacement?.id ?? null }
  })
  return { user: toAuthenticatedUser(user), tokens }
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(refreshToken)
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() }
  })
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  })
}

export async function getAuthenticatedUser(userId: string): Promise<AuthenticatedUser> {
  const user = await prisma.user.findUnique({ where: { id: userId }, ...userWithRolesArgs })
  if (!user || user.deletedAt) throw ApiErrors.notFound('User not found')
  return toAuthenticatedUser(user)
}
