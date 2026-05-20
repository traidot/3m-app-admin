'use client'

import { useParams } from 'next/navigation'
import AgentTransactions from '@/views/downstream/agents/detail/AgentTransactions'

const AgentTransactionsPage = () => {
  const params = useParams()
  return <AgentTransactions id={params.id as string} />
}

export default AgentTransactionsPage
