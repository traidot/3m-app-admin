'use client'

// React Imports
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// API Client Imports
import { axiosGet } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api.config'

export interface UsersCardsRef {
  refresh: () => void
}

const UsersCards = forwardRef<UsersCardsRef>((props, ref) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosGet(`${API_ENDPOINTS.SYSTEM.USERS}?limit=1000`)

      if (response.success && response.data) {
        const users = response.data
        const totalUsers = users.length
        const activeUsers = users.filter((u: any) => u.isActive).length
        const inactiveUsers = users.filter((u: any) => !u.isActive).length

        setStats({
          totalUsers,
          activeUsers,
          inactiveUsers
        })
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Expose refresh method to parent
  useImperativeHandle(ref, () => ({
    refresh: fetchStats
  }))

  const data: UserDataType[] = [
    {
      title: 'Total Users',
      stats: stats.totalUsers.toString(),
      avatarIcon: 'tabler-users',
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '15%',
      subtitle: 'All users across tenants'
    },
    {
      title: 'Active Users',
      stats: stats.activeUsers.toString(),
      avatarIcon: 'tabler-user-check',
      avatarColor: 'success',
      trend: 'positive',
      trendNumber: '8%',
      subtitle: 'Currently active'
    },
    {
      title: 'Inactive Users',
      stats: stats.inactiveUsers.toString(),
      avatarIcon: 'tabler-user-off',
      avatarColor: 'warning',
      trend: 'negative',
      trendNumber: '5%',
      subtitle: 'Deactivated'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
})

UsersCards.displayName = 'UsersCards'

export default UsersCards

