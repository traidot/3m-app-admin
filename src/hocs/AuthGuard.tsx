// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import JwtAuthGuard from '@/components/auth/JwtAuthGuard'

type AuthGuardProps = ChildrenType & {
  useNestJS?: boolean
}

/**
 * Auth Guard - wraps children with JWT guard (NextAuth removed)
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  return <JwtAuthGuard>{children}</JwtAuthGuard>
}
