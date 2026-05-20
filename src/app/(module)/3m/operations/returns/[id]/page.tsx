import RTVDetailView from '@/views/operations/rtv/detail/RTVDetailView'

const RTVDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <RTVDetailView id={id} />
}

export default RTVDetailPage
