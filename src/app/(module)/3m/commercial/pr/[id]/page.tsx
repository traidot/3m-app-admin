import PRDetailView from '@/views/commercial/pr/detail/PRDetailView'

const PRDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <PRDetailView id={id} />
}

export default PRDetailPage
