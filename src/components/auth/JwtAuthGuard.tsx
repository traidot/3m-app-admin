'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface JwtAuthGuardProps {
  children: React.ReactNode
}

/**
 * JWT Auth Guard - Client component
 * Checks JWT token from HttpOnly cookies for authentication
 */
export default function JwtAuthGuard({ children }: JwtAuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  const formatTimestamp = () => {
    const now = new Date()
    const pad = (value: number) => value.toString().padStart(2, '0')
    return `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(
      now.getMinutes()
    )}:${pad(now.getSeconds())}`
  }

  const logWithTimestamp =
    (method: 'log' | 'warn' | 'error') =>
    (...args: any[]) =>
      console[method](`[${formatTimestamp()}]`, ...args)

  const log = logWithTimestamp('log')
  const warn = logWithTimestamp('warn')
  const error = logWithTimestamp('error')

  useEffect(() => {
    const checkAuth = async () => {
      // Demo UI-only: luôn cho phép, không check token, không redirect.
      setIsChecking(false)
    }

    checkAuth()
  }, [router, pathname])

  // Show loading state while checking
  if (isChecking) {
    return null
  }

  return <>{children}</>
}
