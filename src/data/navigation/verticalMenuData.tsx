// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => {
  const getUrl = (path: string) => path

  return [
    {
      label: 'Chính',
      isSection: true,
      roles: ['admin', 'agent'],
      children: [
        { label: 'Bảng điều khiển', icon: 'tabler-smart-home', href: getUrl('/3m/dashboard'), roles: ['admin'] },
        { label: 'Bảng điều khiển', icon: 'tabler-smart-home', href: getUrl('/agent/dashboard'), roles: ['agent'] }
      ]
    },
    {
      label: 'Quản lý danh mục eSIM',
      icon: 'tabler-packages',
      roles: ['admin'],
      children: [
        { label: 'Danh mục eSIM', icon: 'tabler-e-sim', href: getUrl('/3m/marketplace/products') },
        { label: 'Quản lý Tỉ giá', icon: 'tabler-currency-dollar', href: getUrl('/3m/finance/exchange-rates') }
      ]
    },
    {
      label: 'Kho SIM Vật lý',
      icon: 'tabler-cpu',
      roles: ['admin'],
      children: [
        { label: 'Danh sách Phôi SIM', icon: 'tabler-database', href: getUrl('/3m/physical-sim/inventory') },
        { label: 'Nhập kho', icon: 'tabler-file-import', href: getUrl('/3m/physical-sim/import') },
        { label: 'Phân bổ Đại lý', icon: 'tabler-share', href: getUrl('/3m/physical-sim/allocation') },
        { label: 'Quản lý Gói cước', icon: 'tabler-packages', href: getUrl('/3m/physical-sim/packages') },
        { label: 'Lịch sử Kích hoạt', icon: 'tabler-history-toggle', href: getUrl('/3m/physical-sim/history') }
      ]
    },
    {
      label: 'Nguồn cung (Upstream)',
      icon: 'tabler-cloud-download',
      roles: ['admin'],
      children: [
        { label: 'Nhà cung cấp', icon: 'tabler-world', href: getUrl('/3m/upstream/suppliers'), exactMatch: false },
        { label: 'Lịch sử giao dịch', icon: 'tabler-receipt-2', href: getUrl('/3m/upstream/transactions') }
      ]
    },
    {
      label: 'Phân phối (Downstream)',
      icon: 'tabler-users-group',
      roles: ['admin'],
      children: [
        { label: 'Nhóm đại lý', icon: 'tabler-hierarchy-2', href: getUrl('/3m/downstream/tiers'), exactMatch: false },
        { label: 'Đại lý & Đối tác', icon: 'tabler-users', href: getUrl('/3m/downstream/agents'), exactMatch: false },
        { label: 'Lịch sử giao dịch', icon: 'tabler-api', href: getUrl('/3m/downstream/transactions') }
      ]
    },
    {
      label: 'Tài chính & Ví',
      icon: 'tabler-wallet',
      roles: ['admin'],
      children: [
        { label: 'Phải thu (Đại lý)', icon: 'tabler-file-invoice', href: getUrl('/3m/finance/agent-debts') },
        { label: 'Phải trả (NCC)', icon: 'tabler-file-analytics', href: getUrl('/3m/finance/supplier-debts') },
        { label: 'Lịch sử Giao dịch', icon: 'tabler-receipt-2', href: getUrl('/3m/finance/transactions') },
        {
          label: 'Đối soát (Reconciliation)',
          icon: 'tabler-file-analytics',
          href: getUrl('/3m/finance/reconciliation')
        }
      ]
    },
    {
      label: 'Hệ thống',
      icon: 'tabler-settings-cog',
      roles: ['admin'],
      children: [
        { label: 'Người dùng Nội bộ', icon: 'tabler-user-shield', href: getUrl('/3m/system/users') },
        { label: 'Cấu hình Hệ thống', icon: 'tabler-settings', href: getUrl('/3m/system/settings') },
        { label: 'Quản lý log', icon: 'tabler-history-toggle', href: getUrl('/3m/system/audit-logs') },
        { label: 'Cổng API (Gateway)', icon: 'tabler-key', href: getUrl('/3m/downstream/api-keys') }
      ]
    },
    {
      label: 'Kênh Đại lý',
      isSection: true,
      roles: ['agent'],
      children: [
        { label: 'Tìm kiếm eSIM', icon: 'tabler-shopping-bag', href: getUrl('/agent/marketplace/store') },
        { label: 'Lịch sử mua eSIM', icon: 'tabler-history', href: getUrl('/agent/orders/my-orders') },
        {
          label: 'Quản lý SIM trắng vật lý',
          icon: 'tabler-cpu',
          children: [
            { label: 'Mua Phôi SIM', icon: 'tabler-shopping-cart', href: getUrl('/agent/physical-sim/order') },
            { label: 'Kho Phôi SIM', icon: 'tabler-database', href: getUrl('/agent/physical-sim/inventory') },
            { label: 'Bảng giá Gói cước', icon: 'tabler-receipt-2', href: getUrl('/agent/physical-sim/packages') },
            { label: 'Kích hoạt SIM', icon: 'tabler-bolt', href: getUrl('/agent/physical-sim/activation') },
            { label: 'Lịch sử Kích hoạt', icon: 'tabler-history', href: getUrl('/agent/physical-sim/history') }
          ]
        },
        { label: 'Ví của tôi', icon: 'tabler-wallet', href: getUrl('/agent/finance/wallet') },
        { label: 'Quản lý công nợ', icon: 'tabler-file-invoice', href: getUrl('/agent/finance/my-debt') },
        { label: 'Lịch sử Giao dịch', icon: 'tabler-receipt-2', href: getUrl('/agent/finance/transactions') },
        { label: 'Cấu hình API', icon: 'tabler-api', href: getUrl('/agent/system/api') }
      ]
    }
  ]
}

export default verticalMenuData
