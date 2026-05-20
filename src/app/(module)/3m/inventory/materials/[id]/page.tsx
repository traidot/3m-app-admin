import MaterialDetailView from '@/views/inventory/materials/detail/MaterialDetailView'

const MaterialDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <MaterialDetailView id={id} />
}

export default MaterialDetailPage
