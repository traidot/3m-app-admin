export const inboundData = [
  {
    id: 'INB-001',
    supplier: 'Tech Solutions Inc',
    expectedDate: '2026-04-20',
    totalItems: 50,
    status: 'Scheduled',
    warehouse: 'Main Warehouse'
  },
  {
    id: 'INB-002',
    supplier: 'Office Depot',
    expectedDate: '2026-04-18',
    totalItems: 120,
    status: 'In Transit',
    warehouse: 'North Branch'
  },
  {
    id: 'INB-003',
    supplier: 'Global Logistics',
    expectedDate: '2026-04-16',
    totalItems: 30,
    status: 'Received',
    warehouse: 'Main Warehouse'
  }
]

export const outboundData = [
  {
    id: 'OUT-001',
    customer: 'John Doe',
    requestDate: '2026-04-16',
    status: 'Picking',
    items: 4
  },
  {
    id: 'OUT-002',
    customer: 'Retail Hub',
    requestDate: '2026-04-17',
    status: 'Pending',
    items: 25
  },
  {
    id: 'OUT-003',
    customer: 'Sarah Smith',
    requestDate: '2026-04-15',
    status: 'Shipped',
    items: 2
  }
]
