export type PackageSourceCost = {
  supplier: string
  costUSD: number
  qualityRating: number
  status: 'available' | 'out_of_stock' | 'paused'
}

export type AdminPackage = {
  id: string
  name: string
  country: string
  flag: string
  region: string
  dataGB: number | 'unlimited'
  durationDays: number
  simType: 'esim' | 'physical'
  sources: PackageSourceCost[]
  suggestedRetailPriceVND: number
  active: boolean
}

export const ADMIN_PACKAGES: AdminPackage[] = [
  {
    id: 'PKG-001',
    name: 'eSIM Nhật Bản 5GB 7 ngày',
    country: 'Nhật Bản',
    flag: '🇯🇵',
    region: 'Asia',
    dataGB: 5,
    durationDays: 7,
    simType: 'esim',
    sources: [
      { supplier: 'eSIM Access', costUSD: 4.2, qualityRating: 4.8, status: 'available' },
      { supplier: 'Airalo Wholesale', costUSD: 4.95, qualityRating: 4.9, status: 'available' },
      { supplier: 'BNESIM', costUSD: 5.5, qualityRating: 4.4, status: 'out_of_stock' }
    ],
    suggestedRetailPriceVND: 149_000,
    active: true
  },
  {
    id: 'PKG-002',
    name: 'eSIM Hàn Quốc 10GB 15 ngày',
    country: 'Hàn Quốc',
    flag: '🇰🇷',
    region: 'Asia',
    dataGB: 10,
    durationDays: 15,
    simType: 'esim',
    sources: [
      { supplier: 'GoMoWorld', costUSD: 7.2, qualityRating: 4.6, status: 'available' },
      { supplier: 'eSIM Access', costUSD: 7.8, qualityRating: 4.8, status: 'available' },
      { supplier: 'Airalo Wholesale', costUSD: 8.5, qualityRating: 4.9, status: 'available' }
    ],
    suggestedRetailPriceVND: 245_000,
    active: true
  },
  {
    id: 'PKG-003',
    name: 'eSIM Châu Âu 30 nước 5GB 30 ngày',
    country: 'Châu Âu',
    flag: '🇪🇺',
    region: 'Europe',
    dataGB: 5,
    durationDays: 30,
    simType: 'esim',
    sources: [
      { supplier: 'Airalo Wholesale', costUSD: 11.9, qualityRating: 4.9, status: 'available' },
      { supplier: 'eSIM Access', costUSD: 12.4, qualityRating: 4.8, status: 'available' }
    ],
    suggestedRetailPriceVND: 399_000,
    active: true
  },
  {
    id: 'PKG-004',
    name: 'SIM vật lý đi Mỹ 20GB 30 ngày',
    country: 'Hoa Kỳ',
    flag: '🇺🇸',
    region: 'America',
    dataGB: 20,
    durationDays: 30,
    simType: 'physical',
    sources: [
      { supplier: 'eSIM Access', costUSD: 18.5, qualityRating: 4.7, status: 'available' },
      { supplier: 'BNESIM', costUSD: 17.2, qualityRating: 4.3, status: 'paused' }
    ],
    suggestedRetailPriceVND: 599_000,
    active: true
  },
  {
    id: 'PKG-005',
    name: 'eSIM Đông Nam Á 8 nước 3GB 7 ngày',
    country: 'Đông Nam Á',
    flag: '🌏',
    region: 'Asia',
    dataGB: 3,
    durationDays: 7,
    simType: 'esim',
    sources: [
      { supplier: 'GoMoWorld', costUSD: 3.5, qualityRating: 4.6, status: 'available' },
      { supplier: 'Airalo Wholesale', costUSD: 3.9, qualityRating: 4.9, status: 'available' },
      { supplier: 'eSIM Access', costUSD: 4.1, qualityRating: 4.8, status: 'available' }
    ],
    suggestedRetailPriceVND: 119_000,
    active: true
  },
  {
    id: 'PKG-006',
    name: 'eSIM Toàn cầu 100 nước 10GB 30 ngày',
    country: 'Toàn cầu',
    flag: '🌐',
    region: 'Global',
    dataGB: 10,
    durationDays: 30,
    simType: 'esim',
    sources: [
      { supplier: 'BNESIM', costUSD: 32.5, qualityRating: 4.4, status: 'out_of_stock' },
      { supplier: 'Airalo Wholesale', costUSD: 35.0, qualityRating: 4.9, status: 'available' }
    ],
    suggestedRetailPriceVND: 999_000,
    active: true
  }
]

export const USD_VND = 25500
export const getCheapestSource = (pkg: AdminPackage) => {
  const available = pkg.sources.filter(s => s.status === 'available')
  if (!available.length) return null
  return available.reduce((a, b) => a.costUSD <= b.costUSD ? a : b)
}
