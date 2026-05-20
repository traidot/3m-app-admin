// Load dictionaries from JSON files
import viDict from './vi.json'
import jaDict from './ja.json'

/**
 * Recursively flatten nested object to dot-notation keys
 * @param obj - Object to flatten
 * @param prefix - Prefix for keys
 * @returns Flattened object with dot notation
 */
const flattenObject = (obj: any, prefix: string = ''): Record<string, string> => {
  const result: Record<string, string> = {}

  Object.entries(obj).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(result, flattenObject(value, newKey))
    } else {
      // For primitive values (string, number, boolean), convert to string
      result[newKey] = String(value)
    }
  })

  return result
}

/**
 * Get dictionary for specific locale
 */
const getDictionary = (locale: 'vi' | 'en' | 'ja') => {
  return locale === 'vi' ? viDict : jaDict
}

/**
 * Load dictionary for specific locale and flatten with namespaces
 * @param locale - Locale code ('vi', 'en', 'ja')
 * @returns Flattened dictionary with namespace prefixes
 */
export const loadDictionary = (locale: string = 'vi'): Record<string, string> => {
  const dict = getDictionary(locale as 'vi' | 'en' | 'ja')
  const result: Record<string, string> = {}

  // Flatten nested JSON structure with namespace prefixes
  Object.entries(dict).forEach(([namespace, translations]) => {
    // Nếu translations là primitive (string, number, boolean), giữ nguyên key không có prefix
    if (typeof translations !== 'object' || translations === null || Array.isArray(translations)) {
      result[namespace] = String(translations)
    } else {
      // Nếu là object, flatten với prefix
      const flattened = flattenObject(translations, namespace)
      Object.assign(result, flattened)
    }
  })

  return result
}

// Dictionary map for backward compatibility
const dictionaries: Record<string, any> = {
  vi: getDictionary('vi'),
  en: getDictionary('en'),
  ja: getDictionary('ja')
}

// Default export for Vietnamese (backward compatibility)
const viDictionary = loadDictionary('vi')

export default viDictionary
