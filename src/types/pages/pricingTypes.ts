import type { ThemeColor } from '@core/types'

export interface PricingPlanType {
  title: string
  subtitle?: string
  imgSrc: string
  imgWidth: number
  imgHeight: number
  monthlyPrice: number
  yearlyPrice?: number
  yearlyPlan?: { monthly: number; annually: number }
  currentPlan: boolean
  popularPlan: boolean
  planBenefits: string[]
  yearlyPlanPriceLabel?: string
  monthlyPlanPriceLabel?: string
  buttonText?: string
  buttonVariant?: 'contained' | 'outlined'
  popularPlanLabel?: string
  popularPlanColor?: ThemeColor
}

