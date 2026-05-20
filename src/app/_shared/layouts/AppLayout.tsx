// Next Imports
import { cookies } from 'next/headers'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Config Imports
import { i18n } from '@configs/i18n'

// Utils Imports
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'

// Component Imports
import Providers from '@components/Providers'
import { I18nProvider } from '@/i18n/I18nProvider'
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import Customizer from '@core/components/customizer'
import ScrollToTop from '@core/components/scroll-to-top'
import AuthGuard from '@/hocs/AuthGuard'
import { NetworkStatusProvider } from '@/contexts/NetworkStatusContext'
import NetworkErrorBanner from '@/components/common/NetworkErrorBanner'
import { UserPresenceProvider } from '@/components/UserPresenceProvider'

// MUI Imports
import Button from '@mui/material/Button'

/**
 * App Layout Component
 * - Wraps the entire application with providers, guards, and layout components
 * - Handles locale detection from cookies
 * - Provides network status and user presence context
 * - Renders vertical or horizontal layout based on settings
 *
 * @param props - Component props containing children
 * @returns The app layout with all necessary providers and wrappers
 */
export default async function AppLayout(props: ChildrenType) {
  const { children } = props

  /**
   * Get locale from cookie and validate
   * Defaults to 'vi' if not found or invalid
   */
  const cookieStore = await cookies()
  const localeFromCookie = cookieStore.get('NEXT_LOCALE')?.value || 'vi'
  const locale = (['vi', 'ja'].includes(localeFromCookie) ? localeFromCookie : 'vi') as Locale

  /**
   * Get layout direction, dictionary, and mode settings
   */
  const direction = i18n.langDirection[locale]
  const dictionary = await getDictionary(locale)
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <I18nProvider dict={dictionary} locale={locale}>
        <NetworkStatusProvider>
          <NetworkErrorBanner />
          <AuthGuard>
            <UserPresenceProvider />
            <LayoutWrapper
              systemMode={systemMode}
              verticalLayout={
                <VerticalLayout
                  navigation={<Navigation dictionary={dictionary} mode={mode} />}
                  navbar={<Navbar />}
                  footer={<VerticalFooter />}
                >
                  {children}
                </VerticalLayout>
              }
              horizontalLayout={
                <HorizontalLayout header={<Header dictionary={dictionary} />} footer={<HorizontalFooter />}>
                  {children}
                </HorizontalLayout>
              }
            />
            <ScrollToTop className='mui-fixed'>
              <Button
                variant='contained'
                className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
                aria-label='Scroll to top'
              >
                <i className='tabler-arrow-up' />
              </Button>
            </ScrollToTop>
            {/* <Customizer dir={direction} /> */}
          </AuthGuard>
        </NetworkStatusProvider>
      </I18nProvider>
    </Providers>
  )
}
