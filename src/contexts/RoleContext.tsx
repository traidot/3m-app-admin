'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Role = '3m' | 'agent'

const STORAGE_KEY = 'app.role'

interface RoleContextType {
  role: Role | null
  setRole: (role: Role) => void
  clearRole: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored === '3m' || stored === 'agent') setRoleState(stored)
    } catch {}
  }, [])

  const setRole = useCallback((next: Role) => {
    setRoleState(next)
    try {
      sessionStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const clearRole = useCallback(() => {
    setRoleState(null)
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  return <RoleContext.Provider value={{ role, setRole, clearRole }}>{children}</RoleContext.Provider>
}

export const useRole = () => {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within a RoleProvider')
  return ctx
}
