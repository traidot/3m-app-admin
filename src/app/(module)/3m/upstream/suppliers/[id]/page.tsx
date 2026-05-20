import React from 'react'

import SupplierDetail from '@/views/upstream/suppliers/detail/SupplierDetail'

const SupplierDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params)

  return <SupplierDetail id={id} />
}

export default SupplierDetailPage
