export interface SupplierPackage {
  id: string
  name: string
  data_mb: number
  validity_days: number
  price_usd: number
  region: string
}

export interface MarketplacePackage {
  code: string
  name: string
  dataAmount: number
  validityDays: number
  region: string
  baseCost: number
}

export class NormalizationService {
  /**
   * Normalize a package from an external supplier API to 3M standard
   */
  static normalize(supplier: string, rawData: any): MarketplacePackage {
    // Example mapping for a hypothetical supplier
    switch (supplier.toLowerCase()) {
      case 'airalo':
        return {
          code: `AIRALO-${rawData.id}`,
          name: rawData.name,
          dataAmount: rawData.data_mb || 0,
          validityDays: rawData.validity_days || 0,
          region: rawData.region || 'Global',
          baseCost: rawData.price_usd || 0
        }
      default:
        return {
          code: rawData.code || rawData.id,
          name: rawData.name,
          dataAmount: rawData.dataAmount || 0,
          validityDays: rawData.validityDays || 0,
          region: rawData.region || 'Unknown',
          baseCost: rawData.price || 0
        }
    }
  }
}
