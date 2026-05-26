export type SupplierSource = {
  id: string
  supplier: string
  supplierCode: string
  costUSD: number
  status: 'available' | 'out_of_stock' | 'paused'
  lastSync: string
  qualityRating?: number
  salesCount?: number
}

export type Region = 'Asia' | 'Europe' | 'America' | 'Africa' | 'Oceania' | 'Global'
export type SimType = 'esim' | 'physical'
export type QuotaType = 'daily' | 'total'

export type AgentPackage = {
  id: string
  name: string
  country: string
  countryCode: string
  flag: string
  region: Region
  simType: SimType
  quotaType: QuotaType
  dataGB: number | 'unlimited'
  durationDays: number
  type: 'Data only' | 'Data + Call'
  sources: SupplierSource[]
  pinnedSourceId: string | null
  sellPriceVND: number
  active: boolean
  updatedAt: string
}

const USD_VND = 25500

export const cheapestSource = (pkg: AgentPackage): SupplierSource | null => {
  if (pkg.pinnedSourceId) {
    const pinned = pkg.sources.find(s => s.id === pkg.pinnedSourceId)
    if (pinned) return pinned
  }
  const available = pkg.sources.filter(s => s.status === 'available')
  if (!available.length) return null
  return available.reduce((a, b) => (a.costUSD <= b.costUSD ? a : b))
}

export type CriterionType = 'price' | 'quality' | 'bestseller'

export const selectSourceByPriorityOrder = (
  pkg: AgentPackage,
  priorityOrder: CriterionType[]
): SupplierSource | null => {
  const available = [...pkg.sources].filter(s => s.status === 'available')
  if (!available.length) return null

  available.sort((a, b) => {
    for (const criterion of priorityOrder) {
      if (criterion === 'quality') {
        const diff = (b.qualityRating ?? 0) - (a.qualityRating ?? 0)
        if (diff !== 0) return diff
      } else if (criterion === 'bestseller') {
        const diff = (b.salesCount ?? 0) - (a.salesCount ?? 0)
        if (diff !== 0) return diff
      } else if (criterion === 'price') {
        const diff = a.costUSD - b.costUSD
        if (diff !== 0) return diff
      }
    }
    return 0
  })

  return available[0]
}

export const selectSourceByCriterion = (
  pkg: AgentPackage,
  criterion: CriterionType
): SupplierSource | null => {
  return selectSourceByPriorityOrder(pkg, [criterion])
}

export const calculateSmartPrice = (
  costVndValue: number,
  markupPct: number,
  roundToThousand: boolean = true
): number => {
  if (costVndValue <= 0) return 0
  const rawPrice = costVndValue * (1 + markupPct / 100)
  return roundToThousand ? Math.round(rawPrice / 1000) * 1000 : Math.round(rawPrice)
}

export const costVND = (pkg: AgentPackage): number => {
  const src = cheapestSource(pkg)
  return src ? Math.round(src.costUSD * USD_VND) : 0
}

export const marginPct = (pkg: AgentPackage): number => {
  const c = costVND(pkg)
  if (!c) return 0
  return Math.round(((pkg.sellPriceVND - c) / c) * 100)
}

export const AGENT_PACKAGES: AgentPackage[] = [
  {
    id: 'PKG-001',
    name: 'eSIM đi Nhật Bản',
    country: 'Nhật Bản',
    countryCode: 'JP',
    flag: '🇯🇵',
    region: 'Asia',
    simType: 'esim',
    quotaType: 'total',
    dataGB: 5,
    durationDays: 7,
    type: 'Data only',
    sources: [
      { id: 's1', supplier: 'eSIM Access', supplierCode: 'ESA', costUSD: 4.2, status: 'available', lastSync: '2026-05-20 09:30', qualityRating: 4.8, salesCount: 150 },
      { id: 's2', supplier: 'Airalo Wholesale', supplierCode: 'AIR', costUSD: 4.95, status: 'available', lastSync: '2026-05-20 09:32', qualityRating: 4.9, salesCount: 200 },
      { id: 's3', supplier: 'BNESIM', supplierCode: 'BNE', costUSD: 5.5, status: 'out_of_stock', lastSync: '2026-05-20 08:10', qualityRating: 4.4, salesCount: 30 }
    ],
    pinnedSourceId: null,
    sellPriceVND: 149000,
    active: true,
    updatedAt: '2026-05-20 09:32'
  },
  {
    id: 'PKG-002',
    name: 'eSIM đi Hàn Quốc',
    country: 'Hàn Quốc',
    countryCode: 'KR',
    flag: '🇰🇷',
    region: 'Asia',
    simType: 'esim',
    quotaType: 'total',
    dataGB: 10,
    durationDays: 15,
    type: 'Data only',
    sources: [
      { id: 's1', supplier: 'eSIM Access', supplierCode: 'ESA', costUSD: 7.8, status: 'available', lastSync: '2026-05-20 09:30', qualityRating: 4.8, salesCount: 110 },
      { id: 's2', supplier: 'GoMoWorld', supplierCode: 'GMW', costUSD: 7.2, status: 'available', lastSync: '2026-05-20 09:25', qualityRating: 4.6, salesCount: 95 },
      { id: 's3', supplier: 'Airalo Wholesale', supplierCode: 'AIR', costUSD: 8.5, status: 'available', lastSync: '2026-05-20 09:32', qualityRating: 4.9, salesCount: 140 }
    ],
    pinnedSourceId: null,
    sellPriceVND: 245000,
    active: true,
    updatedAt: '2026-05-20 09:30'
  },
  {
    id: 'PKG-003',
    name: 'eSIM Châu Âu 30 nước',
    country: 'Châu Âu (30 nước)',
    countryCode: 'EU',
    flag: '🇪🇺',
    region: 'Europe',
    simType: 'esim',
    quotaType: 'total',
    dataGB: 5,
    durationDays: 30,
    type: 'Data only',
    sources: [
      { id: 's1', supplier: 'eSIM Access', supplierCode: 'ESA', costUSD: 12.4, status: 'available', lastSync: '2026-05-20 09:30', qualityRating: 4.8, salesCount: 220 },
      { id: 's2', supplier: 'Airalo Wholesale', supplierCode: 'AIR', costUSD: 11.9, status: 'available', lastSync: '2026-05-20 09:32', qualityRating: 4.9, salesCount: 310 }
    ],
    pinnedSourceId: 's1',
    sellPriceVND: 399000,
    active: true,
    updatedAt: '2026-05-19 17:15'
  },
  {
    id: 'PKG-004',
    name: 'SIM vật lý đi Mỹ',
    country: 'Hoa Kỳ',
    countryCode: 'US',
    flag: '🇺🇸',
    region: 'America',
    simType: 'physical',
    quotaType: 'total',
    dataGB: 20,
    durationDays: 30,
    type: 'Data + Call',
    sources: [
      { id: 's1', supplier: 'eSIM Access', supplierCode: 'ESA', costUSD: 18.5, status: 'available', lastSync: '2026-05-20 09:30', qualityRating: 4.7, salesCount: 40 },
      { id: 's2', supplier: 'BNESIM', supplierCode: 'BNE', costUSD: 17.2, status: 'paused', lastSync: '2026-05-20 08:10', qualityRating: 4.3, salesCount: 15 }
    ],
    pinnedSourceId: null,
    sellPriceVND: 599000,
    active: false,
    updatedAt: '2026-05-18 14:22'
  },
  {
    id: 'PKG-005',
    name: 'eSIM Đông Nam Á 8 nước',
    country: 'Đông Nam Á',
    countryCode: 'SEA',
    flag: '🌏',
    region: 'Asia',
    simType: 'esim',
    quotaType: 'daily',
    dataGB: 3,
    durationDays: 7,
    type: 'Data only',
    sources: [
      { id: 's1', supplier: 'GoMoWorld', supplierCode: 'GMW', costUSD: 3.5, status: 'available', lastSync: '2026-05-20 09:25', qualityRating: 4.6, salesCount: 180 },
      { id: 's2', supplier: 'Airalo Wholesale', supplierCode: 'AIR', costUSD: 3.9, status: 'available', lastSync: '2026-05-20 09:32', qualityRating: 4.9, salesCount: 240 },
      { id: 's3', supplier: 'eSIM Access', supplierCode: 'ESA', costUSD: 4.1, status: 'available', lastSync: '2026-05-20 09:30', qualityRating: 4.8, salesCount: 160 }
    ],
    pinnedSourceId: null,
    sellPriceVND: 119000,
    active: true,
    updatedAt: '2026-05-20 09:25'
  },
  {
    id: 'PKG-006',
    name: 'eSIM Toàn cầu 100 nước',
    country: 'Toàn cầu',
    countryCode: 'GL',
    flag: '🌐',
    region: 'Global',
    simType: 'esim',
    quotaType: 'total',
    dataGB: 10,
    durationDays: 30,
    type: 'Data only',
    sources: [
      { id: 's1', supplier: 'Airalo Wholesale', supplierCode: 'AIR', costUSD: 35.0, status: 'available', lastSync: '2026-05-20 09:32', qualityRating: 4.9, salesCount: 85 },
      { id: 's2', supplier: 'BNESIM', supplierCode: 'BNE', costUSD: 32.5, status: 'out_of_stock', lastSync: '2026-05-20 08:10', qualityRating: 4.4, salesCount: 20 }
    ],
    pinnedSourceId: null,
    sellPriceVND: 999000,
    active: true,
    updatedAt: '2026-05-20 09:32'
  },
  {
    id: 'PKG-007',
    name: 'SIM vật lý đi Thái Lan',
    country: 'Thái Lan',
    countryCode: 'TH',
    flag: '🇹🇭',
    region: 'Asia',
    simType: 'physical',
    quotaType: 'daily',
    dataGB: 'unlimited',
    durationDays: 5,
    type: 'Data only',
    sources: [
      { id: 's1', supplier: 'GoMoWorld', supplierCode: 'GMW', costUSD: 6.2, status: 'available', lastSync: '2026-05-20 09:25', qualityRating: 4.6, salesCount: 130 },
      { id: 's2', supplier: 'eSIM Access', supplierCode: 'ESA', costUSD: 6.5, status: 'available', lastSync: '2026-05-20 09:30', qualityRating: 4.8, salesCount: 145 }
    ],
    pinnedSourceId: null,
    sellPriceVND: 199000,
    active: true,
    updatedAt: '2026-05-20 09:25'
  }
]

export const USD_TO_VND = USD_VND
