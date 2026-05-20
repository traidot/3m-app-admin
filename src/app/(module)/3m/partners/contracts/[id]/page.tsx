import ContractDetailView from '@/views/partners/contracts/detail/ContractDetailView'

const ContractDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <ContractDetailView id={id} />
}

export default ContractDetailPage
