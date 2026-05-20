'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import PageHeader from '@/components/layout/shared/PageHeader'

const SystemSettings = () => {
  return (
    <>
      <PageHeader
        title="Cài đặt Hệ thống"
        description="Cấu hình thông số kỹ thuật, thông báo và các tham số vận hành sàn"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Hệ thống' }, { label: 'Cài đặt' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-device-floppy' />}>Lưu Cấu hình</Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card className='border-none shadow-sm'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4'>Thông tin Sàn</Typography>
              <Stack spacing={4}>
                <TextField fullWidth label="Tên sàn" defaultValue="3M App Admin" />
                <TextField fullWidth label="Email hệ thống" defaultValue="no-reply@3m-app.vn" />
                <TextField fullWidth label="Số điện thoại hỗ trợ" defaultValue="1900 1234" />
                <TextField fullWidth multiline rows={2} label="Địa chỉ" defaultValue="Tòa nhà Innovation, TP. Hồ Chí Minh" />
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4'>Tham số Vận hành</Typography>
              <Stack spacing={4}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Chế độ Bảo trì (Maintenance Mode)"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Cho phép Đại lý đăng ký mới"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default SystemSettings
