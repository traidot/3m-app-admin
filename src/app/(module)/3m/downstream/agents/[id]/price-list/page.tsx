'use client'

import { useParams } from 'next/navigation'
import AgentPriceList from '@/views/downstream/agents/detail/AgentPriceList'

const Page = () => {
  const params = useParams()
  return <AgentPriceList id={params.id as string} />
}

export default Page
