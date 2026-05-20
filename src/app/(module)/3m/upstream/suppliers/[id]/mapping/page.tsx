import React from 'react'
import SupplierMappingConfig from '@/views/upstream/suppliers/detail/SupplierMappingConfig'

const MappingPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params)

  return <SupplierMappingConfig id={id} />
}

export default MappingPage
