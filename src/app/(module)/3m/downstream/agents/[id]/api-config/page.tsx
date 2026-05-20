'use client'

import { useParams } from 'next/navigation'
import AgentApiConfig from '@/views/downstream/agents/detail/AgentApiConfig'

const AgentApiConfigPage = () => {
  const params = useParams()
  return <AgentApiConfig id={params.id as string} />
}

export default AgentApiConfigPage
