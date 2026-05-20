import QCDetailView from '@/views/warehouse/qc/detail/QCDetailView'

const QCDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <QCDetailView id={id} />
}

export default QCDetailPage
