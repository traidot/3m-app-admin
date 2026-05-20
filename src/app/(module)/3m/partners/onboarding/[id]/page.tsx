import SupplierOnboardingDetailView from '@/views/partners/onboarding/detail/SupplierOnboardingDetailView'

const SupplierOnboardingDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <SupplierOnboardingDetailView id={id} />
}

export default SupplierOnboardingDetailPage
