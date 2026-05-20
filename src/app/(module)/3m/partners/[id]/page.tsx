import VendorDetailView from '@/views/vendors/detail/VendorDetailView'

const VendorDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <VendorDetailView id={id} />
}

export default VendorDetailPage
