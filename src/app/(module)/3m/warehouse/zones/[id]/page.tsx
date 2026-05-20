import ZoneDetailView from '@/views/warehouse/zones/detail/ZoneDetailView'

export default async function ZoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <ZoneDetailView id={id} />
}
