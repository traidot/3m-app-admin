type SearchData = {
  id: string
  name: string
  url: string
  excludeLang?: boolean
  icon: string
  section: string
  shortcut?: string
}

const data: SearchData[] = [
  {
    id: '1',
    name: 'Procurement Dashboard',
    url: '/dashboard',
    icon: 'tabler-smart-home',
    section: 'Analytics & Overview'
  },
  {
    id: '2',
    name: 'Spending Intelligence',
    url: '/analytics',
    icon: 'tabler-presentation-analytics',
    section: 'Analytics & Overview'
  },
  {
    id: '3',
    name: 'Purchase Requisitions (PR)',
    url: '/commercial/pr',
    icon: 'tabler-file-plus',
    section: 'Procurement Ops'
  },
  {
    id: '4',
    name: 'Purchase Orders (PO)',
    url: '/commercial/po',
    icon: 'tabler-file-invoice',
    section: 'Procurement Ops'
  },
  {
    id: '6',
    name: 'Vendor Directory',
    url: '/partners',
    icon: 'tabler-users',
    section: 'Supplier Management'
  },
  {
    id: '7',
    name: 'System Audit Logs',
    url: '/reports/audit',
    icon: 'tabler-shield-lock',
    section: 'Compliance'
  }
]

export default data
