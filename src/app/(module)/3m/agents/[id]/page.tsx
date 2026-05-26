import AgentDetailView from '@/views/3m/agents/AgentDetailView'

type Props = { params: Promise<{ id: string }> }

const Page = async ({ params }: Props) => {
  const { id } = await params

  return <AgentDetailView agentId={id} />
}

export default Page
