import InvoiceDetailView from '@/views/commercial/invoices/detail/InvoiceDetailView'

const InvoiceDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <InvoiceDetailView id={id} />
}

export default InvoiceDetailPage
