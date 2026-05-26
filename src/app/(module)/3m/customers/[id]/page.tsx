import CustomerDetailView from '@/views/agent/customers/CustomerDetailView'

type Props = { params: Promise<{ id: string }> }

const Page = async ({ params }: Props) => {
  const { id } = await params
  
  return <CustomerDetailView customerId={id} backUrl='/3m/customers' />
}

export default Page
