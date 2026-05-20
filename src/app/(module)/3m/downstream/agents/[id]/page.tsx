'use client'

import { useParams } from 'next/navigation'
import AgentDetail from '@/views/downstream/agents/detail/AgentDetail'

const AgentDetailPage = () => {
  const params = useParams()
  return <AgentDetail id={params.id as string} />
}

export default AgentDetailPage
