import UserDetailView from '@/views/system/users/detail/UserDetailView'

const UserDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <UserDetailView id={id} />
}

export default UserDetailPage
