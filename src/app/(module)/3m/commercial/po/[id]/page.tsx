import PODetailView from '@/views/commercial/po/detail/PODetailView'

const PODetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <PODetailView id={id} />
}

export default PODetailPage
