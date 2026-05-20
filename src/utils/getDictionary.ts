// Third-party Imports
import 'server-only'

// Type Imports

const dictionaries = {
  vi: () => import('@/i18n/dictionaries/vi.json').then(module => module.default),
  ja: () => import('@/i18n/dictionaries/ja.json').then(module => module.default)
}

export const getDictionary = async (locale: 'vi' | 'ja' | 'en') => {
  // Fallback 'en' to 'vi' since we don't have English dictionary yet
  const actualLocale = locale === 'en' ? 'vi' : locale
  return dictionaries[actualLocale]()
}
