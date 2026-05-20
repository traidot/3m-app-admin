export const i18n = {
  defaultLocale: 'en',
  locales: ['vi', 'en', 'ja'],
  langDirection: {
    vi: 'ltr',
    en: 'ltr',
    ja: 'ltr'
  },
  localeNames: {
    vi: 'Tiếng Việt',
    en: 'English',
    ja: '日本語'
  },
  localeFlags: {
    vi: '🇻🇳',
    en: '🇺🇸',
    ja: '🇯🇵'
  },
  currencyCodes: {
    vi: 'VND',
    en: 'USD',
    ja: 'JPY'
  },
  dateFormats: {
    vi: 'DD/MM/YYYY',
    en: 'MM/DD/YYYY',
    ja: 'YYYY/MM/DD'
  },
  timeFormats: {
    vi: 'HH:mm',
    en: 'h:mm a',
    ja: 'HH:mm'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
