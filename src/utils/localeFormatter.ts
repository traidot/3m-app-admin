// Locale formatting utilities
import { i18n, type Locale } from '@/configs/i18n'

// Date formatting
export const formatDate = (date: Date | string, locale: Locale = 'vi'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }

  // Custom formatting based on locale
  const formatter = new Intl.DateTimeFormat(getIntlLocale(locale), options)
  const formatted = formatter.format(dateObj)

  // Apply custom format patterns
  switch (locale) {
    case 'vi':
      return formatted.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3') // DD/MM/YYYY
    case 'en':
      return formatted // MM/DD/YYYY (default)
    case 'ja':
      return formatted.replace(/(\d+)\/(\d+)\/(\d+)/, '$3/$1/$2') // YYYY/MM/DD
    default:
      return formatted
  }
}

// Time formatting
export const formatTime = (date: Date | string, locale: Locale = 'vi'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en' // 12-hour format for English
  }

  return new Intl.DateTimeFormat(getIntlLocale(locale), options).format(dateObj)
}

// DateTime formatting
export const formatDateTime = (date: Date | string, locale: Locale = 'vi'): string => {
  const dateStr = formatDate(date, locale)
  const timeStr = formatTime(date, locale)
  return `${dateStr} ${timeStr}`
}

// Currency formatting
export const formatCurrency = (amount: number, locale: Locale = 'vi', currency?: string): string => {
  const currencyCode = currency ?? i18n.currencyCodes[locale]

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
  }

  return new Intl.NumberFormat(getIntlLocale(locale), options).format(amount)
}

// Number formatting
export const formatNumber = (number: number, locale: Locale = 'vi', options?: Intl.NumberFormatOptions): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }

  return new Intl.NumberFormat(getIntlLocale(locale), defaultOptions).format(number)
}

// Percentage formatting
export const formatPercentage = (value: number, locale: Locale = 'vi', decimals: number = 1): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }

  return new Intl.NumberFormat(getIntlLocale(locale), options).format(value / 100)
}

// File size formatting
export const formatFileSize = (bytes: number, locale: Locale = 'vi'): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${formatNumber(size, locale, { maximumFractionDigits: 1 })} ${units[unitIndex]}`
}

// Relative time formatting (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date | string, locale: Locale = 'vi'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(getIntlLocale(locale), { numeric: 'auto' })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}

// Get Intl locale mapping
const getIntlLocale = (locale: Locale): string => {
  const mapping: Record<Locale, string> = {
    vi: 'vi-VN',
    en: 'en-US',
    ja: 'ja-JP'
  }
  return mapping[locale]
}

// Parse date from different formats
export const parseDate = (dateString: string, locale: Locale = 'vi'): Date => {
  // Handle different date formats based on locale
  let parts: string[]

  if (dateString.includes('/')) {
    parts = dateString.split('/')
  } else if (dateString.includes('-')) {
    parts = dateString.split('-')
  } else {
    return new Date(dateString)
  }

  let day: number, month: number, year: number

  switch (locale) {
    case 'vi': // DD/MM/YYYY
      day = parseInt(parts[0])
      month = parseInt(parts[1]) - 1
      year = parseInt(parts[2])
      break
    case 'en': // MM/DD/YYYY
      month = parseInt(parts[0]) - 1
      day = parseInt(parts[1])
      year = parseInt(parts[2])
      break
    case 'ja': // YYYY/MM/DD
      year = parseInt(parts[0])
      month = parseInt(parts[1]) - 1
      day = parseInt(parts[2])
      break
    default:
      return new Date(dateString)
  }

  return new Date(year, month, day)
}

// Validate date format
export const isValidDateFormat = (dateString: string, locale: Locale = 'vi'): boolean => {
  try {
    const date = parseDate(dateString, locale)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}

// Get locale-specific date input placeholder
export const getDateInputPlaceholder = (locale: Locale = 'vi'): string => {
  return i18n.dateFormats[locale]
}

// Get locale-specific time input placeholder
export const getTimeInputPlaceholder = (locale: Locale = 'vi'): string => {
  return i18n.timeFormats[locale]
}

// Format phone number based on locale
export const formatPhoneNumber = (phone: string, locale: Locale = 'vi'): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  switch (locale) {
    case 'vi':
      // Vietnamese phone format: +84 XXX XXX XXXX
      if (cleaned.startsWith('84')) {
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
      }
      return phone
    case 'en':
      // US phone format: (XXX) XXX-XXXX
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      }
      return phone
    case 'ja':
      // Japanese phone format: XXX-XXXX-XXXX
      if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
      }
      return phone
    default:
      return phone
  }
}

// Export all formatting functions
export const localeFormatter = {
  date: formatDate,
  time: formatTime,
  dateTime: formatDateTime,
  currency: formatCurrency,
  number: formatNumber,
  percentage: formatPercentage,
  fileSize: formatFileSize,
  relativeTime: formatRelativeTime,
  phone: formatPhoneNumber,
  parseDate,
  isValidDateFormat,
  getDateInputPlaceholder,
  getTimeInputPlaceholder
}
