import { SystemSettings } from '@/hooks/useSystemSettings'

/**
 * Convert date format pattern from settings to Intl format
 */
const convertDateFormat = (format: string): string => {
  const formatMap: Record<string, string> = {
    'DD/MM/YYYY': 'dd/MM/yyyy',
    'MM/DD/YYYY': 'MM/dd/yyyy',
    'YYYY-MM-DD': 'yyyy-MM-dd',
    'DD-MM-YYYY': 'dd-MM-yyyy',
    'MM-DD-YYYY': 'MM-dd-yyyy',
  }
  return formatMap[format] || 'dd/MM/yyyy'
}

/**
 * Convert time format pattern from settings to Intl format
 */
const convertTimeFormat = (format: string): Intl.DateTimeFormatOptions => {
  switch (format) {
    case 'HH:mm:ss':
      return { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
    case 'HH:mm':
      return { hour: '2-digit', minute: '2-digit', hour12: false }
    case 'hh:mm A':
      return { hour: '2-digit', minute: '2-digit', hour12: true }
    case 'hh:mm:ss A':
      return { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }
    default:
      return { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
  }
}

/**
 * Format date theo settings từ DB
 */
export const formatDateBySettings = (
  date: Date | string | null | undefined,
  settings: SystemSettings,
): string => {
  if (!date) return '—'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return '—'

    const format = settings.date_format || 'DD/MM/YYYY'
    const locale = settings.currency_locale || 'vi-VN'
    
    // Use Intl.DateTimeFormat with timezone
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: settings.timezone || 'Asia/Ho_Chi_Minh',
    })

    const parts = formatter.formatToParts(dateObj)
    const year = parts.find(p => p.type === 'year')?.value || ''
    const month = parts.find(p => p.type === 'month')?.value || ''
    const day = parts.find(p => p.type === 'day')?.value || ''

    // Apply format pattern
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`
      case 'MM-DD-YYYY':
        return `${month}-${day}-${year}`
      default:
        return `${day}/${month}/${year}`
    }
  } catch (error) {
    console.error('Error formatting date:', error)
    return '—'
  }
}

/**
 * Format time theo settings từ DB
 */
export const formatTimeBySettings = (
  date: Date | string | null | undefined,
  settings: SystemSettings,
): string => {
  if (!date) return '—'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return '—'

    const format = settings.time_format || 'HH:mm:ss'
    const locale = settings.currency_locale || 'vi-VN'
    const timeOptions = convertTimeFormat(format)

    const formatter = new Intl.DateTimeFormat(locale, {
      ...timeOptions,
      timeZone: settings.timezone || 'Asia/Ho_Chi_Minh',
    })

    return formatter.format(dateObj)
  } catch (error) {
    console.error('Error formatting time:', error)
    return '—'
  }
}

/**
 * Format datetime (date + time) theo settings từ DB
 */
export const formatDateTimeBySettings = (
  date: Date | string | null | undefined,
  settings: SystemSettings,
): string => {
  if (!date) return '—'

  const dateStr = formatDateBySettings(date, settings)
  const timeStr = formatTimeBySettings(date, settings)
  
  if (dateStr === '—' || timeStr === '—') return '—'
  
  return `${dateStr} ${timeStr}`
}

/**
 * Format currency theo settings từ DB
 */
export const formatCurrencyBySettings = (
  amount: number | null | undefined,
  settings: SystemSettings,
): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '—'

  try {
    const currencyCode = settings.currency_code || 'VND'
    const currencyLocale = settings.currency_locale || 'vi-VN'
    const decimalPlaces = settings.currency_decimal_places ?? (currencyCode === 'VND' ? 0 : 2)
    const display = settings.currency_display || 'symbol'

    const formatter = new Intl.NumberFormat(currencyLocale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })

    let formatted = formatter.format(amount)
    const currencySymbol =
      formatter.formatToParts(amount).find(part => part.type === 'currency')?.value ??
      formatter
        .formatToParts(0)
        .find(part => part.type === 'currency')
        ?.value

    // Adjust display based on currency_display setting
    if (display === 'code') {
      if (currencySymbol) {
        formatted = formatted.replace(currencySymbol, currencyCode)
      }
    } else if (display === 'name') {
      // Replace with currency name (e.g., ₫ 1,000 -> 1,000 Đồng)
      const currencyNames: Record<string, string> = {
        'VND': 'Đồng',
        'USD': 'Dollar',
        'JPY': 'Yen',
        'EUR': 'Euro',
        'GBP': 'Pound',
        'CNY': 'Yuan',
      }
      
      const name = currencyNames[currencyCode] || currencyCode
      // Remove symbol and add name at the end
      if (currencySymbol) {
        formatted = formatted.replace(currencySymbol, '').trim()
      }
      formatted = `${formatted} ${name}`.trim()
    }

    return formatted
  } catch (error) {
    console.error('Error formatting currency:', error)
    return amount.toString()
  }
}

/**
 * Format number với decimal places theo settings
 */
export const formatNumberBySettings = (
  value: number | null | undefined,
  settings: SystemSettings,
  decimalPlaces?: number,
): string => {
  if (value === null || value === undefined || isNaN(value)) return '—'

  try {
    const locale = settings.currency_locale || 'vi-VN'
    const places = decimalPlaces ?? settings.currency_decimal_places ?? 0

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: places,
      maximumFractionDigits: places,
    }).format(value)
  } catch (error) {
    console.error('Error formatting number:', error)
    return value.toString()
  }
}

