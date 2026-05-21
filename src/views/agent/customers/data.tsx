import Chip from '@mui/material/Chip'

export type Channel = 'app' | 'web' | 'referral' | 'imported'
export type CustomerType = 'individual' | 'business' | 'vip'
export type CustomerStatus = 'active' | 'inactive' | 'blocked'

export type Customer = {
  id: string
  name: string
  phone: string
  email: string
  avatar?: string
  type: CustomerType
  channel: Channel
  orders: number
  totalSpentVND: number
  lastOrderAt: string | null
  status: CustomerStatus
  joinedAt: string
}

export const CUSTOMERS: Customer[] = [
  {
    id: 'CUS-0001',
    name: 'Nguyễn Văn An',
    phone: '0901 234 567',
    email: 'an.nguyen@gmail.com',
    type: 'vip',
    channel: 'app',
    orders: 14,
    totalSpentVND: 4_280_000,
    lastOrderAt: '2026-05-19',
    status: 'active',
    joinedAt: '2025-08-12'
  },
  {
    id: 'CUS-0002',
    name: 'Trần Thị Bích',
    phone: '0912 345 678',
    email: 'bich.tran@yahoo.com',
    type: 'individual',
    channel: 'app',
    orders: 3,
    totalSpentVND: 547_000,
    lastOrderAt: '2026-05-15',
    status: 'active',
    joinedAt: '2026-01-04'
  },
  {
    id: 'CUS-0003',
    name: 'Công ty TNHH Du lịch Sao Việt',
    phone: '028 3822 1234',
    email: 'booking@saoviet.com.vn',
    type: 'business',
    channel: 'referral',
    orders: 47,
    totalSpentVND: 18_950_000,
    lastOrderAt: '2026-05-20',
    status: 'active',
    joinedAt: '2024-11-22'
  },
  {
    id: 'CUS-0004',
    name: 'Lê Minh Chiến',
    phone: '0933 111 222',
    email: 'chienle@outlook.com',
    type: 'individual',
    channel: 'web',
    orders: 1,
    totalSpentVND: 149_000,
    lastOrderAt: '2026-03-08',
    status: 'inactive',
    joinedAt: '2026-03-08'
  },
  {
    id: 'CUS-0005',
    name: 'Phạm Quỳnh Như',
    phone: '0987 654 321',
    email: 'quynhnhu@gmail.com',
    type: 'vip',
    channel: 'app',
    orders: 22,
    totalSpentVND: 7_120_000,
    lastOrderAt: '2026-05-18',
    status: 'active',
    joinedAt: '2025-04-30'
  },
  {
    id: 'CUS-0006',
    name: 'Hoàng Văn Đạt',
    phone: '0978 222 333',
    email: 'dathv@gmail.com',
    type: 'individual',
    channel: 'imported',
    orders: 0,
    totalSpentVND: 0,
    lastOrderAt: null,
    status: 'inactive',
    joinedAt: '2026-05-10'
  },
  {
    id: 'CUS-0007',
    name: 'Bùi Khánh Linh',
    phone: '0966 777 888',
    email: 'linhbk@hotmail.com',
    type: 'individual',
    channel: 'app',
    orders: 5,
    totalSpentVND: 985_000,
    lastOrderAt: '2026-04-22',
    status: 'active',
    joinedAt: '2025-12-01'
  },
  {
    id: 'CUS-0008',
    name: 'Đỗ Tuấn Kiệt',
    phone: '0944 555 666',
    email: 'tuankiet@gmail.com',
    type: 'individual',
    channel: 'web',
    orders: 2,
    totalSpentVND: 318_000,
    lastOrderAt: '2026-02-14',
    status: 'blocked',
    joinedAt: '2025-09-17'
  },
  {
    id: 'CUS-0009',
    name: 'Travel Agent VN',
    phone: '024 7300 8989',
    email: 'sales@travelagent.vn',
    type: 'business',
    channel: 'referral',
    orders: 31,
    totalSpentVND: 12_440_000,
    lastOrderAt: '2026-05-17',
    status: 'active',
    joinedAt: '2025-02-08'
  }
]

export const typeChip = (t: CustomerType) => {
  const map: Record<CustomerType, { label: string; color: 'primary' | 'secondary' | 'warning' }> = {
    vip: { label: 'VIP', color: 'warning' },
    business: { label: 'Doanh nghiệp', color: 'primary' },
    individual: { label: 'Cá nhân', color: 'secondary' }
  }
  return <Chip size='small' variant='tonal' color={map[t].color} label={map[t].label} />
}

export const statusChip = (s: CustomerStatus) => {
  const map: Record<CustomerStatus, { label: string; color: 'success' | 'secondary' | 'error' }> = {
    active: { label: 'Hoạt động', color: 'success' },
    inactive: { label: 'Không hoạt động', color: 'secondary' },
    blocked: { label: 'Đã khoá', color: 'error' }
  }
  return <Chip size='small' variant='tonal' color={map[s].color} label={map[s].label} />
}

export const channelLabel: Record<Channel, string> = {
  app: 'App',
  web: 'Website',
  referral: 'Giới thiệu',
  imported: 'Import'
}

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

export const daysAgo = (iso: string | null) => {
  if (!iso) return null
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diff === 0) return 'hôm nay'
  if (diff === 1) return 'hôm qua'
  if (diff < 30) return `${diff} ngày trước`
  if (diff < 365) return `${Math.floor(diff / 30)} tháng trước`
  return `${Math.floor(diff / 365)} năm trước`
}
