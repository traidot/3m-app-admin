'use client'

import ESimInfoCard from '@/views/shared/esim/ESimInfoCard'
import PageHeader from '@/components/layout/shared/PageHeader'

const ESimDemoPage = () => {
  return (
    <>
      <PageHeader
        title="Chi tiết eSIM Chuẩn chỉnh"
        description="Bản trình diễn giao diện thông tin eSIM đầy đủ nhất cho cả Admin và Agent"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng' }, { label: 'Demo eSIM Info' }]}
        className='mbe-6'
      />
      <ESimInfoCard />
    </>
  )
}

export default ESimDemoPage
