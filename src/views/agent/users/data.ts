export type ScreenKey =
  | 'dashboard'
  | 'app'
  | 'packages'
  | 'customers'
  | 'orders'
  | 'users'

export type RolePreset = 'owner' | 'manager' | 'staff' | 'custom'

export type UserStatus = 'active' | 'inactive'

export type InternalUser = {
  id: string
  name: string
  email: string
  phone: string
  rolePreset: RolePreset
  permissions: Record<ScreenKey, boolean>
  status: UserStatus
  lastLoginAt: string | null
  joinedAt: string
}

export const SCREENS: { key: ScreenKey; label: string; icon: string; description: string }[] = [
  { key: 'dashboard', label: 'Bảng điều khiển', icon: 'tabler-smart-home', description: 'Xem KPI và biểu đồ tổng quan.' },
  { key: 'app', label: 'Quản lý app', icon: 'tabler-app-window', description: 'Cấu hình branding, thông tin app.' },
  { key: 'packages', label: 'Quản lý gói cước', icon: 'tabler-packages', description: 'Thêm/sửa/xoá gói cước, set giá.' },
  { key: 'customers', label: 'Quản lý khách hàng', icon: 'tabler-users', description: 'Xem và chỉnh sửa thông tin khách hàng.' },
  { key: 'orders', label: 'Quản lý đơn hàng', icon: 'tabler-shopping-cart', description: 'Xem, xử lý và hoàn tiền đơn hàng.' },
  { key: 'users', label: 'Người dùng nội bộ', icon: 'tabler-user-shield', description: 'Tạo user và phân quyền truy cập.' }
]

export const ROLE_PRESETS: Record<RolePreset, { label: string; color: 'primary' | 'info' | 'secondary' | 'warning'; permissions: Record<ScreenKey, boolean> }> = {
  owner: {
    label: 'Chủ tài khoản',
    color: 'warning',
    permissions: {
      dashboard: true,
      app: true,
      packages: true,
      customers: true,
      orders: true,
      users: true
    }
  },
  manager: {
    label: 'Quản lý',
    color: 'primary',
    permissions: {
      dashboard: true,
      app: true,
      packages: true,
      customers: true,
      orders: true,
      users: false
    }
  },
  staff: {
    label: 'Nhân viên',
    color: 'info',
    permissions: {
      dashboard: true,
      app: false,
      packages: false,
      customers: true,
      orders: true,
      users: false
    }
  },
  custom: {
    label: 'Tuỳ chỉnh',
    color: 'secondary',
    permissions: {
      dashboard: true,
      app: false,
      packages: false,
      customers: false,
      orders: false,
      users: false
    }
  }
}

export const INTERNAL_USERS: InternalUser[] = [
  {
    id: 'USR-0001',
    name: 'Nguyễn Trọng Đức',
    email: 'duc.nguyen@myagent.vn',
    phone: '0901 111 222',
    rolePreset: 'owner',
    permissions: ROLE_PRESETS.owner.permissions,
    status: 'active',
    lastLoginAt: '2026-05-21 08:42',
    joinedAt: '2024-09-01'
  },
  {
    id: 'USR-0002',
    name: 'Trần Thanh Hà',
    email: 'ha.tran@myagent.vn',
    phone: '0912 333 444',
    rolePreset: 'manager',
    permissions: ROLE_PRESETS.manager.permissions,
    status: 'active',
    lastLoginAt: '2026-05-20 22:15',
    joinedAt: '2025-01-15'
  },
  {
    id: 'USR-0003',
    name: 'Lê Hoàng Sơn',
    email: 'son.le@myagent.vn',
    phone: '0933 555 666',
    rolePreset: 'staff',
    permissions: ROLE_PRESETS.staff.permissions,
    status: 'active',
    lastLoginAt: '2026-05-21 09:10',
    joinedAt: '2025-08-22'
  },
  {
    id: 'USR-0004',
    name: 'Phạm Mai Linh',
    email: 'linh.pham@myagent.vn',
    phone: '0944 777 888',
    rolePreset: 'staff',
    permissions: ROLE_PRESETS.staff.permissions,
    status: 'active',
    lastLoginAt: '2026-05-20 17:30',
    joinedAt: '2025-11-04'
  },
  {
    id: 'USR-0005',
    name: 'Vũ Đình Khoa',
    email: 'khoa.vu@myagent.vn',
    phone: '0955 222 333',
    rolePreset: 'custom',
    permissions: {
      dashboard: true,
      app: false,
      packages: true,
      customers: false,
      orders: true,
      users: false
    },
    status: 'active',
    lastLoginAt: '2026-05-19 11:20',
    joinedAt: '2026-02-10'
  },
  {
    id: 'USR-0006',
    name: 'Đỗ Hồng Nhung',
    email: 'nhung.do@myagent.vn',
    phone: '0966 888 999',
    rolePreset: 'staff',
    permissions: ROLE_PRESETS.staff.permissions,
    status: 'inactive',
    lastLoginAt: '2026-04-12 14:55',
    joinedAt: '2025-06-01'
  }
]
