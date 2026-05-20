'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

import type { Dictionary, I18nContextValue } from './index'
import { createTranslationFunction } from './index'

const I18nContext = createContext<I18nContextValue>({
  t: (key: string, params?: Record<string, string | number>) => {
    if (!params) {
      return key
    }

    return Object.entries(params).reduce((acc, [paramKey, value]) => {
      const pattern = new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g')

      return acc.replace(pattern, String(value))
    }, key)
  },
  locale: 'vi'
})

interface I18nProviderProps {
  dict: Dictionary
  locale?: string
  children: ReactNode
}

export function I18nProvider({ dict, locale = 'vi', children }: I18nProviderProps) {
  const t = createTranslationFunction(dict, locale)

  return <I18nContext.Provider value={{ t, locale }}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return context
}
