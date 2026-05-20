// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

type DefaultSuggestionsType = {
  sectionLabel: string
  items: {
    label: string
    href: string
    icon?: string
  }[]
}

const defaultSuggestions: DefaultSuggestionsType[] = [
  {
    sectionLabel: 'Popular Searches',
    items: [
      {
        label: 'Báo giá',
        href: '/sales/quotations',
        icon: 'tabler-trending-up'
      },
      {
        label: 'Mua hàng',
        href: '/sales/purchase-orders',
        icon: 'tabler-chart-pie-2'
      },
      {
        label: 'Kế hoạch container',
        href: '/logistics/container',
        icon: 'tabler-container'
      },
      {
        label: 'Đóng container',
        href: '/logistics/container-loading',
        icon: 'tabler-square-rounded-arrow-up'
      }
    ]
  },
  {
    sectionLabel: 'Quản lý',
    items: [
      {
        label: 'Khách hàng',
        href: '/master-data/customers',
        icon: 'tabler-users'
      },
      {
        label: 'Nhà cung cấp',
        href: '/master-data/suppliers',
        icon: 'tabler-building-store'
      },
      {
        label: 'Sản phẩm',
        href: '/master-data/products',
        icon: 'tabler-package'
      },
      {
        label: 'Danh mục sản phẩm',
        href: '/master-data/product-categories',
        icon: 'tabler-tag'
      },
      {
        label: 'Giá nhà cung cấp',
        href: '/master-data/supplier-pricing',
        icon: 'tabler-currency-dollar'
      }
    ]
  },
  {
    sectionLabel: 'Hệ thống',
    items: [
      {
        label: 'Người dùng',
        href: '/system/users',
        icon: 'tabler-user'
      },
      {
        label: 'Cấu hình',
        href: '/system/settings',
        icon: 'tabler-settings'
      }
    ]
  }
]

const DefaultSuggestions = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
  // Hooks
  const { lang: locale } = useParams()

  return (
    <div className='flex grow flex-wrap gap-x-[48px] gap-y-8 plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      {defaultSuggestions.map((section, index) => (
        <div
          key={index}
          className='flex flex-col justify-center overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]'
        >
          <p className='text-xs leading-[1.16667] uppercase text-textDisabled tracking-[0.8px]'>
            {section.sectionLabel}
          </p>
          <ul className='flex flex-col gap-4'>
            {section.items.map((item, i) => (
              <li key={i} className='flex'>
                <Link
                  href={getLocalizedUrl(item.href, locale as Locale)}
                  className='flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <i className={classnames(item.icon, 'flex text-xl')} />}
                  <p className='text-[15px] leading-[1.4667] truncate'>{item.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DefaultSuggestions
