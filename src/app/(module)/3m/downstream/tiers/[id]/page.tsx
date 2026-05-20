'use client'

import TierDetail from '@/views/downstream/tiers/detail/TierDetail'
import { useParams } from 'next/navigation'

const TierDetailPage = () => {
  const params = useParams()
  return <TierDetail id={params.id as string} />
}

export default TierDetailPage
