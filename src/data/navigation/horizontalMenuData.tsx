// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const horizontalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): HorizontalMenuDataType[] => {
  const getUrl = (path: string) => path
  const menuDict = (dictionary as any).screens?.menu || (dictionary as any).menu || {}

  return [
    {
      label: menuDict.dashboard || 'Dashboard',
      icon: 'tabler-smart-home',
      href: getUrl('/dashboard')
    },
    {
      label: 'Operations',
      icon: 'tabler-settings',
      children: [
        {
          label: 'Inbound',
          icon: 'tabler-arrow-down-circle',
          href: getUrl('/operations/inbound'),
          exactMatch: false,
          activeUrl: '/operations/inbound'
        },
        {
          label: 'Outbound',
          icon: 'tabler-arrow-up-circle',
          href: getUrl('/operations/outbound'),
          exactMatch: false,
          activeUrl: '/operations/outbound'
        }
      ]
    },
    {
      label: 'Partners',
      icon: 'tabler-building-store',
      href: getUrl('/partners')
    },
    {
      label: 'Reports',
      icon: 'tabler-report-analytics',
      href: getUrl('/reports')
    },
    {
      label: 'System',
      icon: 'tabler-settings-cog',
      children: [
        {
          label: 'Users',
          icon: 'tabler-users',
          href: getUrl('/system/users')
        },
        {
          label: 'Settings',
          icon: 'tabler-settings',
          href: getUrl('/system/settings')
        },
      ]
    }
  ]
}

export default horizontalMenuData
