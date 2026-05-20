import RFQCompareView from '@/views/commercial/rfq/compare/RFQCompareView'

const RFQComparePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <RFQCompareView id={id} />
}

export default RFQComparePage
