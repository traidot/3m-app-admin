'use client'

import { useParams } from 'next/navigation'
import AgentPricing from '@/views/downstream/agents/detail/AgentPricing'

const AgentPricingPage = () => {
  const params = useParams()
  return <AgentPricing id={params.id as string} />
}

export default AgentPricingPage
