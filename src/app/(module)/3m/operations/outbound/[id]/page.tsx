import OutboundDetailView from '@/views/operations/outbound/detail/OutboundDetailView'

export default async function OutboundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <OutboundDetailView id={id} />
}
