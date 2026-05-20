// I18n types and utilities
export type Dictionary = { [key: string]: string | Dictionary }

export interface I18nContextValue {
  t: (key: string, params?: Record<string, string | number>) => string
  locale: string
}

// Helper to resolve nested keys using dot notation
const getNestedValue = (obj: any, path: string): string | undefined => {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj)
  return typeof value === 'string' ? value : undefined
}

// Helper to check for missing keys in development
export const createTranslationFunction = (dict: Dictionary, locale: string = 'en') => {
  return (key: string, params?: Record<string, string | number>): string => {
    const value = getNestedValue(dict, key)
    let result = value || key

    if (!value && process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n] Missing translation for key: "${key}" in locale: "${locale}"`)
    }

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        // Hỗ trợ cả {{param}} và {param}
        const doublePattern = new RegExp(`\\{\\{\\s*${paramKey}\\s*\\}\\}`, 'g')
        const singlePattern = new RegExp(`\\{\\s*${paramKey}\\s*\\}`, 'g')
        result = result.replace(doublePattern, String(paramValue)).replace(singlePattern, String(paramValue))
      })
    }

    return result
  }
}

// Namespace helpers for better organization
export const createNamespaceDict = <T extends Record<string, string>>(
  namespace: string,
  dict: T
): Record<string, string> => {
  const result: Record<string, string> = {}

  Object.entries(dict).forEach(([key, value]) => {
    result[`${namespace}.${key}`] = value
  })

  return result
}
