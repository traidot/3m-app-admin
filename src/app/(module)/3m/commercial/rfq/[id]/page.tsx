import RFQDetailView from '@/views/commercial/rfq/detail/RFQDetailView'

const RFQDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <RFQDetailView id={id} />
}

export default RFQDetailPage
