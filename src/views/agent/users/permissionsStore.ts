'use client'

import { useSyncExternalStore } from 'react'
import { SCREENS, type ScreenKey } from './data'

export type ManagedRole = 'owner' | 'manager' | 'staff'

export type RolePermissions = Record<ManagedRole, Record<ScreenKey, boolean>>

const STORAGE_KEY = 'agent.rolePermissions.v1'

const DEFAULT_PERMISSIONS: RolePermissions = {
  owner: {
    dashboard: true,
    app: true,
    packages: true,
    customers: true,
    orders: true,
    users: true
  },
  manager: {
    dashboard: true,
    app: true,
    packages: true,
    customers: true,
    orders: true,
    users: false
  },
  staff: {
    dashboard: true,
    app: false,
    packages: false,
    customers: true,
    orders: true,
    users: false
  }
}

const clone = (p: RolePermissions): RolePermissions =>
  JSON.parse(JSON.stringify(p))

const load = (): RolePermissions => {
  if (typeof window === 'undefined') return clone(DEFAULT_PERMISSIONS)
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return clone(DEFAULT_PERMISSIONS)
    const parsed = JSON.parse(raw) as Partial<RolePermissions>
    const merged = clone(DEFAULT_PERMISSIONS)
    ;(['owner', 'manager', 'staff'] as ManagedRole[]).forEach(r => {
      if (parsed[r]) {
        SCREENS.forEach(s => {
          if (typeof parsed[r]?.[s.key] === 'boolean') merged[r][s.key] = parsed[r]![s.key]!
        })
      }
    })
    return merged
  } catch {
    return clone(DEFAULT_PERMISSIONS)
  }
}

let current: RolePermissions = load()
const listeners = new Set<() => void>()

const persist = () => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    } catch {}
  }
  listeners.forEach(l => l())
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

const getSnapshot = () => current
const getServerSnapshot = () => DEFAULT_PERMISSIONS

export const useRolePermissions = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export const setRolePermissions = (next: RolePermissions) => {
  current = clone(next)
  persist()
}

export const resetRolePermissions = () => {
  current = clone(DEFAULT_PERMISSIONS)
  persist()
}

export const DEFAULT_ROLE_PERMISSIONS = DEFAULT_PERMISSIONS
