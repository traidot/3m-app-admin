import type { ThemeColor } from '@core/types'

export interface CardStatsSquareProps {
  avatarColor?: ThemeColor
  avatarIcon: string
  stats: string | number
  statsTitle: string
  avatarVariant?: 'rounded' | 'square' | 'circular'
  avatarSize?: number | string
  avatarSkin?: 'filled' | 'light' | 'light-static'
}

export interface CardStatsCustomerStatsProps {
  title: string
  avatarIcon: string
  color?: ThemeColor
  description?: string
  stats?: string | number
  content?: string
  chipLabel?: string
}

export interface CardStatsHorizontalProps {
  stats: string | number
  avatarIcon: string
  avatarColor?: ThemeColor
  title: string
  avatarSkin?: 'filled' | 'light' | 'light-static'
  avatarSize?: number | string
}

export interface CardStatsHorizontalWithAvatarProps {
  stats: string | number
  title: string
  avatarIcon: string
  avatarColor?: ThemeColor
  avatarVariant?: 'rounded' | 'square' | 'circular'
  avatarSkin?: 'filled' | 'light' | 'light-static'
  avatarSize?: number | string
}

export interface CardStatsHorizontalWithBorderProps {
  title: string
  stats: string | number
  trendNumber: number
  avatarIcon: string
  color?: ThemeColor
}

export interface CardStatsVerticalProps {
  stats: string | number
  title: string
  subtitle?: string
  avatarIcon: string
  avatarColor?: ThemeColor
  avatarSize?: number | string
  avatarSkin?: 'filled' | 'light' | 'light-static'
  chipText?: string
  chipColor?: ThemeColor
  chipVariant?: 'filled' | 'outlined'
}

export interface CardStatsWithAreaChartProps {
  stats: string | number
  title: string
  avatarIcon: string
  chartSeries: Array<{ name: string; data: number[] }>
  avatarSize?: number | string
  chartColor?: ThemeColor
  avatarColor?: ThemeColor
  avatarSkin?: 'filled' | 'light' | 'light-static'
}

