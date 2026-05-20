import { Decimal } from '@prisma/client/runtime/library'

export interface PricingFactors {
  costPrice: number
  exchangeRate: number
  opsFee: number
  markupPercent: number
  markupFixed: number
}

export class PricingService {
  /**
   * Calculate final price for an agent
   * Formula: (Cost * ExchangeRate + OpsFee) * (1 + MarkupPercent/100) + MarkupFixed
   */
  static calculatePrice(factors: PricingFactors): number {
    const { costPrice, exchangeRate, opsFee, markupPercent, markupFixed } = factors
    
    const basePriceInLocalCurrency = (costPrice * exchangeRate) + opsFee
    const withPercentMarkup = basePriceInLocalCurrency * (1 + markupPercent / 100)
    const finalPrice = withPercentMarkup + markupFixed
    
    return Math.ceil(finalPrice) // Round up for safety
  }

  /**
   * Helper to convert Prisma Decimal to number safely
   */
  static decimalToNumber(d: any): number {
    if (!d) return 0
    return typeof d === 'number' ? d : Number(d.toString())
  }
}
