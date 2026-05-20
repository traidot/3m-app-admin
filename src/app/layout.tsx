// Next Imports
import { cookies } from 'next/headers'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import { I18nProvider } from '@/i18n/I18nProvider'
import { loadDictionary } from '@/i18n/dictionaries/lang'
import { RoleProvider } from '@/contexts/RoleContext'

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: '3M App Admin',
  description: '3M App Admin - Enterprise Management System'
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Get locale from cookie or use default
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'vi') as Locale

  // Vars
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection[locale]
  const { headers } = await import('next/headers')
  const headersList = await headers()

  return (
    <TranslationWrapper headersList={headersList} lang={locale}>
      <html id='__next' lang={locale} dir={direction} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          <I18nProvider dict={loadDictionary(locale)} locale={locale}>
            <RoleProvider>
              {children}
            </RoleProvider>
          </I18nProvider>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
