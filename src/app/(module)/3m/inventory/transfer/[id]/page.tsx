import TransferDetailView from '@/views/inventory/transfer/detail/TransferDetailView'

export default async function TransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <TransferDetailView id={id} />
}
