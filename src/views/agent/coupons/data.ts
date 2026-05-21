export type CouponType = 'percent' | 'fixed'
export type CouponStatus = 'active' | 'scheduled' | 'expired' | 'paused'
export type CouponScope = 'all' | 'first_order' | 'specific_packages'

export type Coupon = {
  id: string
  code: string
  name: string
  description?: string
  type: CouponType
  value: number // % nếu percent, VND nếu fixed
  minOrderVND: number | null
  maxDiscountVND: number | null // chỉ áp dụng cho %
  usageLimit: number | null // null = không giới hạn
  perCustomerLimit: number | null
  usedCount: number
  scope: CouponScope
  startAt: string
  endAt: string | null // null = không hết hạn
  status: CouponStatus
  createdAt: string
}

export const COUPONS: Coupon[] = [
  {
    id: 'CPN-0001',
    code: 'SUMMER2026',
    name: 'Khuyến mãi mùa hè 2026',
    description: 'Giảm 15% cho toàn bộ gói eSIM, tối đa 100.000đ.',
    type: 'percent',
    value: 15,
    minOrderVND: 100_000,
    maxDiscountVND: 100_000,
    usageLimit: 500,
    perCustomerLimit: 1,
    usedCount: 187,
    scope: 'all',
    startAt: '2026-05-01',
    endAt: '2026-08-31',
    status: 'active',
    createdAt: '2026-04-25'
  },
  {
    id: 'CPN-0002',
    code: 'WELCOME50K',
    name: 'Chào mừng khách mới',
    description: 'Giảm 50.000đ cho đơn hàng đầu tiên.',
    type: 'fixed',
    value: 50_000,
    minOrderVND: 150_000,
    maxDiscountVND: null,
    usageLimit: null,
    perCustomerLimit: 1,
    usedCount: 1_245,
    scope: 'first_order',
    startAt: '2025-12-01',
    endAt: null,
    status: 'active',
    createdAt: '2025-11-28'
  },
  {
    id: 'CPN-0003',
    code: 'JP10',
    name: 'Giảm giá gói Nhật Bản',
    description: 'Giảm 10% cho gói cước đi Nhật.',
    type: 'percent',
    value: 10,
    minOrderVND: null,
    maxDiscountVND: 50_000,
    usageLimit: 200,
    perCustomerLimit: 2,
    usedCount: 89,
    scope: 'specific_packages',
    startAt: '2026-05-15',
    endAt: '2026-06-15',
    status: 'active',
    createdAt: '2026-05-12'
  },
  {
    id: 'CPN-0004',
    code: 'BLACKFRIDAY',
    name: 'Black Friday 2025',
    description: 'Giảm 30% toàn bộ eSIM dịp Black Friday.',
    type: 'percent',
    value: 30,
    minOrderVND: 200_000,
    maxDiscountVND: 300_000,
    usageLimit: 1_000,
    perCustomerLimit: 1,
    usedCount: 982,
    scope: 'all',
    startAt: '2025-11-25',
    endAt: '2025-12-01',
    status: 'expired',
    createdAt: '2025-11-15'
  },
  {
    id: 'CPN-0005',
    code: 'TET2026',
    name: 'Tết Nguyên Đán 2026',
    description: 'Coupon Tết — sẽ kích hoạt vào tháng 2.',
    type: 'percent',
    value: 20,
    minOrderVND: 150_000,
    maxDiscountVND: 150_000,
    usageLimit: 800,
    perCustomerLimit: 1,
    usedCount: 0,
    scope: 'all',
    startAt: '2027-02-01',
    endAt: '2027-02-28',
    status: 'scheduled',
    createdAt: '2026-05-18'
  },
  {
    id: 'CPN-0006',
    code: 'KR100K',
    name: 'Giảm 100K cho gói Hàn Quốc',
    description: 'Đang tạm dừng để rà soát.',
    type: 'fixed',
    value: 100_000,
    minOrderVND: 300_000,
    maxDiscountVND: null,
    usageLimit: 300,
    perCustomerLimit: 1,
    usedCount: 47,
    scope: 'specific_packages',
    startAt: '2026-04-01',
    endAt: '2026-07-31',
    status: 'paused',
    createdAt: '2026-03-25'
  },
  {
    id: 'CPN-0007',
    code: 'VIP25',
    name: 'Ưu đãi khách VIP',
    description: 'Giảm 25% riêng cho khách VIP.',
    type: 'percent',
    value: 25,
    minOrderVND: null,
    maxDiscountVND: 250_000,
    usageLimit: null,
    perCustomerLimit: null,
    usedCount: 312,
    scope: 'all',
    startAt: '2026-01-01',
    endAt: null,
    status: 'active',
    createdAt: '2025-12-30'
  }
]

export const STATUS_META: Record<
  CouponStatus,
  { label: string; color: 'success' | 'info' | 'secondary' | 'warning'; icon: string }
> = {
  active: { label: 'Đang chạy', color: 'success', icon: 'tabler-circle-check' },
  scheduled: { label: 'Đã lên lịch', color: 'info', icon: 'tabler-calendar-time' },
  expired: { label: 'Đã hết hạn', color: 'secondary', icon: 'tabler-clock-off' },
  paused: { label: 'Tạm dừng', color: 'warning', icon: 'tabler-player-pause' }
}

export const SCOPE_LABEL: Record<CouponScope, string> = {
  all: 'Toàn bộ gói',
  first_order: 'Đơn đầu tiên',
  specific_packages: 'Gói chỉ định'
}
