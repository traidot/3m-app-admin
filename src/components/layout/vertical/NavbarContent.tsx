'use client'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ShortcutsType } from '@components/layout/shared/ShortcutsDropdown'
import type { NotificationsType } from '@components/layout/shared/NotificationsDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

// Component Imports
import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import ShortcutsDropdown from '@components/layout/shared/ShortcutsDropdown'
import NotificationDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'

// Hook Imports
import { useNotifications } from '@/hooks/useNotifications'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Vars
const shortcuts: ShortcutsType[] = [
  {
    url: '/commercial/pr',
    icon: 'tabler-file-plus',
    title: 'New PR',
    subtitle: 'Requisition'
  },
  {
    url: '/commercial/po',
    icon: 'tabler-file-invoice',
    title: 'Orders',
    subtitle: 'Purchase Orders'
  },
  {
    url: '/inventory/materials',
    icon: 'tabler-box',
    title: 'Materials',
    subtitle: 'Master Data'
  },
  {
    url: '/warehouse/qc',
    icon: 'tabler-shield-check',
    title: 'Quality',
    subtitle: 'Inspections'
  },
  {
    url: '/dashboard',
    icon: 'tabler-smart-home',
    title: 'Dashboard',
    subtitle: 'Main View'
  },
  {
    url: '/system/settings',
    icon: 'tabler-settings',
    title: 'Settings',
    subtitle: 'System Config'
  }
]

const NavbarContent = () => {
  // Hooks
  const {
    notifications,
    loading: notificationsLoading,
    refresh: refreshNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
    dismissNotification,
  } = useNotifications()

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <NavSearch />
      </div>
      <div className='flex items-center'>
        {/* <LanguageDropdown /> */}
        {/* <ThemeModeToggle />// */}
        <ModeDropdown />
        <ShortcutsDropdown shortcuts={shortcuts} />
        <NotificationDropdown
          notifications={notifications as any}
          loading={notificationsLoading}
          onMarkAsRead={markAsRead}
          onMarkAsUnread={markAsUnread}
          onMarkAllAsRead={markAllAsRead}
          onMarkAllAsUnread={markAllAsUnread}
          onDismiss={dismissNotification}
          onRefresh={refreshNotifications}
          viewAllUrl='/notifications'
        />
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
