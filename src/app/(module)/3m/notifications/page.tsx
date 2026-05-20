'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import PageHeader from '@/components/layout/shared/PageHeader'
import Breadcrumb from '@/components/layout/shared/Breadcrumb'
import NotificationsTable from './NotificationsTable'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

// Hook Imports
import { usePageTitle } from '@/hooks/usePageTitle'

/**
 * Notifications Page Component
 * - Displays system notifications and alerts
 * - Allows users to view and manage notifications
 *
 * @returns Notifications page component
 */
const AdminSystemNotificationsPage = () => {
  const { t } = useI18n()
  usePageTitle(t('notifications.pageTitle'))

  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: '/dashboard' },
    { label: t('notifications.title') }
  ]

  return (
    <>
      <PageHeader
        title={t('notifications.pageTitle')}
        description={t('notifications.pageDescription')}
        className='mbe-4'
      />
      <Breadcrumb items={breadcrumbs} className='mbe-4' />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <NotificationsTable />
        </Grid>
      </Grid>
    </>
  )
}

export default AdminSystemNotificationsPage

