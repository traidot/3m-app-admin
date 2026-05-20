import ReceiptDetailView from '@/views/operations/receipts/detail/ReceiptDetailView'

const ReceiptDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <ReceiptDetailView id={id} />
}

export default ReceiptDetailPage
