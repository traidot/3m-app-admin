// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

// Mỗi item có thể gắn `roles` để VerticalMenu/HorizontalMenu lọc theo role hiện hành.
type MenuItem = HorizontalMenuDataType & { roles?: string[] }

const horizontalMenuData = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>
): HorizontalMenuDataType[] => {
  const getUrl = (path: string) => path

  const items: MenuItem[] = [
    { label: 'Bảng điều khiển', icon: 'tabler-smart-home', href: getUrl('/3m/dashboard'), roles: ['3m'] },
    { label: 'Đại lý', icon: 'tabler-building-store', href: getUrl('/3m/agents'), roles: ['3m'] },
    { label: 'Khách hàng', icon: 'tabler-users', href: getUrl('/3m/customers'), roles: ['3m'] },
    { label: 'Đơn hàng', icon: 'tabler-shopping-cart', href: getUrl('/3m/orders'), roles: ['3m'] },
    { label: 'Bảng giá', icon: 'tabler-receipt-2', href: getUrl('/3m/packages'), roles: ['3m'] },

    { label: 'Bảng điều khiển', icon: 'tabler-smart-home', href: getUrl('/agent/dashboard'), roles: ['agent'] },
    { label: 'App', icon: 'tabler-app-window', href: getUrl('/agent/app'), roles: ['agent'] },
    { label: 'Gói cước', icon: 'tabler-packages', href: getUrl('/agent/packages'), roles: ['agent'] },
    { label: 'Khách hàng', icon: 'tabler-users', href: getUrl('/agent/customers'), roles: ['agent'] },
    { label: 'Đơn hàng', icon: 'tabler-shopping-cart', href: getUrl('/agent/orders'), roles: ['agent'] },
    { label: 'Người dùng', icon: 'tabler-user-shield', href: getUrl('/agent/users'), roles: ['agent'] },
    { label: 'Phân quyền', icon: 'tabler-key', href: getUrl('/agent/roles'), roles: ['agent'] }
  ]

  return items as HorizontalMenuDataType[]
}

export default horizontalMenuData
