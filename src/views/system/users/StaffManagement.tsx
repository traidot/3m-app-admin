'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

import PageHeader from '@/components/layout/shared/PageHeader'

const StaffManagement = () => {
  const staff = [
    { name: 'Nguyễn Văn A', email: 'admin@3m-app.vn', role: 'Super Admin', status: 'Online' },
    { name: 'Trần Thị B', email: 'support@3m-app.vn', role: 'Support', status: 'Offline' },
    { name: 'Lê Văn C', email: 'finance@3m-app.vn', role: 'Accountant', status: 'Online' }
  ]

  return (
    <>
      <PageHeader
        title="Quản lý Nhân sự"
        description="Quản lý tài khoản nội bộ và phân quyền truy cập hệ thống Admin"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Hệ thống' }, { label: 'Nhân sự' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-user-plus' />}>Thêm Thành viên</Button>
        }
        className='mbe-6'
      />

      <Card className='border-none shadow-sm'>
        <CardContent className='p-0'>
          <Box className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 border-be'>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Thành viên</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Vai trò</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Trạng thái</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s, i) => (
                  <tr key={i} className='border-be last:border-0 hover:bg-slate-50/50 transition-colors'>
                    <td className='p-4'>
                      <Box className='flex items-center gap-3'>
                        <Avatar sx={{ bgcolor: 'info.main' }}>{s.name[0]}</Avatar>
                        <Box>
                          <Typography variant='body2' className='font-black'>{s.name}</Typography>
                          <Typography variant='caption' className='text-slate-400'>{s.email}</Typography>
                        </Box>
                      </Box>
                    </td>
                    <td className='p-4'>
                      <Chip label={s.role} size='small' variant='tonal' color='info' className='font-bold' />
                    </td>
                    <td className='p-4'>
                      <Box className='flex items-center gap-2'>
                        <Box className={`w-2 h-2 rounded-full ${s.status === 'Online' ? 'bg-success' : 'bg-slate-300'}`} />
                        <Typography variant='caption'>{s.status}</Typography>
                      </Box>
                    </td>
                    <td className='p-4 text-right'>
                      <Button size='small' variant='text'>Phân quyền</Button>
                      <Button size='small' variant='text' color='error'>Gỡ bỏ</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default StaffManagement
