import 'server-only'

import type { Notification, NotificationType, Prisma } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import { publish } from '../lib/notification-bus'

export interface ListNotificationsOpts {
  userId: string
  type?: NotificationType
  status?: 'unread' | 'read'
  skip: number
  take: number
}

function buildWhere(opts: Pick<ListNotificationsOpts, 'userId' | 'type' | 'status'>): Prisma.NotificationWhereInput {
  const where: Prisma.NotificationWhereInput = { userId: opts.userId }
  if (opts.type) where.type = opts.type
  if (opts.status === 'unread') where.readAt = null
  if (opts.status === 'read') where.readAt = { not: null }
  return where
}

export async function listNotifications(opts: ListNotificationsOpts) {
  const where = buildWhere(opts)
  const [data, total, unread] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: opts.userId, readAt: null } })
  ])
  return { data, total, unread }
}

export async function unreadCount(userId: string): Promise<number> {
  return prisma.notification.count({ where: { userId, readAt: null } })
}

export interface CreateNotificationArgs {
  userId: string
  type: NotificationType
  title: string
  body?: string | null
  link?: string | null
  meta?: Prisma.InputJsonValue | null
}

export async function createNotification(
  args: CreateNotificationArgs,
  tx: Prisma.TransactionClient | typeof prisma = prisma
): Promise<Notification> {
  const created = await tx.notification.create({
    data: {
      userId: args.userId,
      type: args.type,
      title: args.title,
      body: args.body ?? null,
      link: args.link ?? null,
      meta: args.meta ?? undefined
    }
  })
  publish(args.userId, { kind: 'created', notification: created })
  return created
}

/**
 * Fan out a notification to every active user that has at least one of the
 * given role keys. Returns count of notifications created.
 */
export async function createNotificationForRoles(
  roleKeys: string[],
  template: Omit<CreateNotificationArgs, 'userId'>,
  tx: Prisma.TransactionClient | typeof prisma = prisma
): Promise<number> {
  if (roleKeys.length === 0) return 0
  const recipients = await tx.user.findMany({
    where: {
      deletedAt: null,
      status: 'active',
      roles: { some: { role: { key: { in: roleKeys } } } }
    },
    select: { id: true }
  })
  if (recipients.length === 0) return 0
  await tx.notification.createMany({
    data: recipients.map(r => ({
      userId: r.id,
      type: template.type,
      title: template.title,
      body: template.body ?? null,
      link: template.link ?? null,
      meta: template.meta ?? undefined
    }))
  })
  // createMany doesn't return rows, so re-fetch the freshly inserted set per user for SSE.
  // Cheap because each user gets one row right now.
  const ids = recipients.map(r => r.id)
  const fresh = await tx.notification.findMany({
    where: { userId: { in: ids }, title: template.title, createdAt: { gte: new Date(Date.now() - 5_000) } }
  })
  for (const n of fresh) publish(n.userId, { kind: 'created', notification: n })
  return recipients.length
}

export async function markRead(userId: string, notificationId: string): Promise<Notification> {
  const existing = await prisma.notification.findFirst({ where: { id: notificationId, userId } })
  if (!existing) throw ApiErrors.notFound('Không tìm thấy thông báo')
  if (existing.readAt) return existing
  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() }
  })
  publish(userId, { kind: 'read', notificationId })
  return updated
}

export async function markAllRead(userId: string): Promise<{ updated: number }> {
  const r = await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() }
  })
  publish(userId, { kind: 'all-read' })
  return { updated: r.count }
}
