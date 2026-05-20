import { useState, useEffect } from 'react'
import { axiosGet } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api.config'

export interface SystemSettings {
  key: string
  system_name?: string | null
  system_description?: string | null
  maintenance_mode: boolean
  allow_registration: boolean
  require_email_verification: boolean
  session_timeout: number
  max_login_attempts: number
  password_min_length: number
  require_strong_password: boolean
  enable_two_factor: boolean
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  cache_enabled: boolean
  cache_duration: number
  enable_logging: boolean
  log_level: string
  default_locale: string
  timezone: string
  date_format: string
  time_format: string
  currency_code: string
  currency_locale: string
  currency_decimal_places: number
  currency_display: string
}

const defaultSettings: SystemSettings = {
  key: 'system',
  default_locale: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  date_format: 'DD/MM/YYYY',
  time_format: 'HH:mm:ss',
  currency_code: 'VND',
  currency_locale: 'vi-VN',
  currency_decimal_places: 0,
  currency_display: 'symbol',
  maintenance_mode: false,
  allow_registration: true,
  require_email_verification: false,
  session_timeout: 30,
  max_login_attempts: 5,
  password_min_length: 6,
  require_strong_password: false,
  enable_two_factor: false,
  email_notifications: true,
  push_notifications: true,
  sms_notifications: false,
  cache_enabled: true,
  cache_duration: 60,
  enable_logging: true,
  log_level: 'info',
}

/**
 * Hook để load và cache system settings
 */
export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axiosGet<SystemSettings>(API_ENDPOINTS.SYSTEM.SETTINGS)
        if (response?.success && response?.data) {
          setSettings(response.data)
        } else {
          // Fallback to default if API fails
          setSettings(defaultSettings)
        }
      } catch (err) {
        console.warn('Failed to load system settings, using defaults:', err)
        setError('Failed to load settings')
        setSettings(defaultSettings)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  return { settings, loading, error }
}

