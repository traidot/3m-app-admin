import Chip from '@mui/material/Chip'

export type AgentTier = 'Platinum' | 'Gold' | 'Silver'
export type AgentStatus = 'active' | 'blocked'

export type Agent = {
  id: string
  name: string
  owner: string
  phone: string
  email: string
  tier: AgentTier
  walletBalanceVND: number
  totalSalesVND: number
  ordersCount: number
  apiKeyEnabled: boolean
  status: AgentStatus
  joinedAt: string
}

export const AGENTS: Agent[] = [
  {
    id: 'AGT-0001',
    name: 'TravelConnect SG',
    owner: 'Nguyễn Văn An',
    phone: '0901 234 567',
    email: 'an.nguyen@travelconnect.sg',
    tier: 'Platinum',
    walletBalanceVND: 45_000_000,
    totalSalesVND: 128_500_000,
    ordersCount: 412,
    apiKeyEnabled: true,
    status: 'active',
    joinedAt: '2025-01-15'
  },
  {
    id: 'AGT-0002',
    name: 'Global Roam JP',
    owner: 'Trần Minh Tuấn',
    phone: '0912 345 678',
    email: 'tuan.tran@globalroam.jp',
    tier: 'Gold',
    walletBalanceVND: 18_400_000,
    totalSalesVND: 84_200_000,
    ordersCount: 295,
    apiKeyEnabled: true,
    status: 'active',
    joinedAt: '2025-03-22'
  },
  {
    id: 'AGT-0003',
    name: 'EuroSim Partners',
    owner: 'Phan Thị Quỳnh',
    phone: '0987 654 321',
    email: 'quynh.phan@eurosim.vn',
    tier: 'Platinum',
    walletBalanceVND: 72_900_000,
    totalSalesVND: 210_800_000,
    ordersCount: 684,
    apiKeyEnabled: true,
    status: 'active',
    joinedAt: '2024-11-10'
  },
  {
    id: 'AGT-0004',
    name: 'IndoConnect',
    owner: 'Lê Hoàng Long',
    phone: '0933 444 555',
    email: 'long.le@indoconnect.com',
    tier: 'Silver',
    walletBalanceVND: 5_200_000,
    totalSalesVND: 24_500_000,
    ordersCount: 88,
    apiKeyEnabled: false,
    status: 'active',
    joinedAt: '2025-08-05'
  },
  {
    id: 'AGT-0005',
    name: 'VietSim Go',
    owner: 'Hoàng Minh Đức',
    phone: '0977 888 999',
    email: 'duc.hoang@vietsimgo.vn',
    tier: 'Silver',
    walletBalanceVND: -1_500_000, // Negative balance (credit allowed)
    totalSalesVND: 12_800_000,
    ordersCount: 45,
    apiKeyEnabled: false,
    status: 'blocked', // Blocked agent
    joinedAt: '2025-10-18'
  }
]

export const tierColor: Record<AgentTier, 'primary' | 'warning' | 'info'> = {
  Platinum: 'primary',
  Gold: 'warning',
  Silver: 'info'
}

export const statusColor: Record<AgentStatus, 'success' | 'error'> = {
  active: 'success',
  blocked: 'error'
}

export const statusLabel: Record<AgentStatus, string> = {
  active: 'Hoạt động',
  blocked: 'Đã khóa'
}
