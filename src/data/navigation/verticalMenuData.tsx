// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => {
  const getUrl = (path: string) => path

  return [
    {
      label: 'Admin 3M',
      isSection: true,
      roles: ['3m'],
      children: [
        { label: 'Bảng điều khiển', icon: 'tabler-smart-home', href: getUrl('/3m/dashboard') },
        { label: 'Quản lý đại lý app', icon: 'tabler-building-store', href: getUrl('/3m/agents') },
        { label: 'Khách hàng theo đại lý', icon: 'tabler-users', href: getUrl('/3m/customers') },
        { label: 'Đơn hàng theo đại lý', icon: 'tabler-shopping-cart', href: getUrl('/3m/orders') },
        { label: 'Bảng giá gói cước', icon: 'tabler-receipt-2', href: getUrl('/3m/packages') }
      ]
    },
    {
      label: 'Agent',
      isSection: true,
      roles: ['agent'],
      children: [
        { label: 'Bảng điều khiển', icon: 'tabler-smart-home', href: getUrl('/agent/dashboard') },
        { label: 'Quản lý app', icon: 'tabler-app-window', href: getUrl('/agent/app') },
        { label: 'Quản lý gói cước', icon: 'tabler-packages', href: getUrl('/agent/packages') },
        { label: 'Quản lý khách hàng', icon: 'tabler-users', href: getUrl('/agent/customers') },
        { label: 'Quản lý đơn hàng', icon: 'tabler-shopping-cart', href: getUrl('/agent/orders') },
        { label: 'Người dùng nội bộ', icon: 'tabler-user-shield', href: getUrl('/agent/users') },
        { label: 'Phân quyền vai trò', icon: 'tabler-key', href: getUrl('/agent/roles') }
      ]
    }
  ]
}

export default verticalMenuData
