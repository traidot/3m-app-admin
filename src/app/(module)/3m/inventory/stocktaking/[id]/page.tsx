import StocktakingDetailView from '@/views/inventory/stocktaking/detail/StocktakingDetailView'

export default async function StocktakingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <StocktakingDetailView id={id} />
}
