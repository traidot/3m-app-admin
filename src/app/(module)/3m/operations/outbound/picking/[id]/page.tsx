import PickingWorkflowView from '@/views/operations/outbound/picking/PickingWorkflowView'

export default async function PickingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <PickingWorkflowView id={id} />
}
