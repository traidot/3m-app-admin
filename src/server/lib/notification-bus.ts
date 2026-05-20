import 'server-only'

import type { Notification } from '@prisma/client'

/**
 * In-process pub/sub for SSE delivery.
 * One Set<Subscriber> per userId. SSE GET handlers register on connect and
 * remove themselves on close; notification.service publishes on insert.
 *
 * NOTE: single-process only. A multi-instance deployment would back this with
 * Redis pub/sub (or Vercel Queues) — out of scope for Phase 7.
 */

export type NotificationEvent =
  | { kind: 'created'; notification: Notification }
  | { kind: 'read'; notificationId: string }
  | { kind: 'all-read' }

type Subscriber = (event: NotificationEvent) => void

declare global {
  // eslint-disable-next-line no-var
  var __notificationBus: Map<string, Set<Subscriber>> | undefined
}

const subscribers: Map<string, Set<Subscriber>> = (globalThis.__notificationBus ??= new Map())

export function subscribe(userId: string, fn: Subscriber): () => void {
  let set = subscribers.get(userId)
  if (!set) {
    set = new Set()
    subscribers.set(userId, set)
  }
  set.add(fn)
  return () => {
    set!.delete(fn)
    if (set!.size === 0) subscribers.delete(userId)
  }
}

export function publish(userId: string, event: NotificationEvent): void {
  const set = subscribers.get(userId)
  if (!set) return
  for (const fn of set) {
    try {
      fn(event)
    } catch {
      // swallow — a broken subscriber must not stop the others
    }
  }
}

export function subscriberCount(userId: string): number {
  return subscribers.get(userId)?.size ?? 0
}
