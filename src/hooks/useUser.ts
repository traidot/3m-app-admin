'use client'

import { useState, useEffect } from 'react'
import { AuthService } from '@/services/auth/authService'

interface UserInfo {
  id: string
  email: string
  name: string
  image?: string
  loginType: 'user'
  role?: string
}

/**
 * Hook để lấy user info từ JWT token (AuthService)
 * - Dùng AuthService để lấy token và profile
 */
export function useUser() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)

      try {
        // Lấy token từ AuthService
        const token = await AuthService.getAccessToken()

        if (token && typeof token === 'string') {
          try {
            // Decode JWT token to get user info
            const payload = JSON.parse(atob(token.split('.')[1]))

            // Try to get profile from API
            try {
              const profile = await AuthService.getProfile()

              setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                loginType: 'user',
                role: profile.role,
              })
            } catch (error: any) {
              console.warn('[useUser] Error getting profile, falling back to token payload:', {
                message: error?.message,
                statusCode: error?.statusCode,
              })

              // Fallback to token payload
              const userId = payload.id ?? payload.sub;

              if (!userId) {
                console.warn('[useUser] No userId in token payload')
                setUser(null);

                return;
              }

              const userEmail = payload.email;
              const userName = payload.name;

              if (!userEmail || !userName) {
                console.warn('[useUser] No email or name in token payload')
                setUser(null);

                return;
              }

              setUser({
                id: userId,
                email: userEmail,
                name: userName,
                loginType: 'user',
                role: payload.role,
              })
            }
          } catch (error) {
            console.error('Error loading user from JWT:', error)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
      }

      setLoading(false)
    }

    loadUser()
  }, [])

  return { user, loading, isAuthenticated: !!user }
}

