'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierConfig = () => {
  const { id } = useParams()
  const supplierName = id === 'airalo' ? 'Airalo Global' : 'Nomad API'
  const [active, setActive] = useState(true)

  return (
    <>
      <PageHeader
        title={`Cấu hình Kết nối: ${supplierName}`}
        description="Quản lý API Key, Webhook và các thông số bảo mật kết nối"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Nguồn cung', href: '/3m/upstream/suppliers' },
          { label: supplierName, href: `/3m/upstream/suppliers/${id}` },
          { label: 'Cấu hình API' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button variant='tonal' color='error'>Gỡ kết nối</Button>
            <Button variant='contained' startIcon={<i className='tabler-device-floppy' />}>Lưu Cấu hình</Button>
          </Stack>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card className='border-none shadow-sm'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-6 flex items-center gap-2'>
                <i className='tabler-api text-primary' /> Thông số API (Production)
              </Typography>
              
              <Grid2 container spacing={6}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField 
                    fullWidth 
                    label="API Endpoint URL" 
                    defaultValue={id === 'airalo' ? 'https://partners.airalo.com/api/v2' : 'https://api.getnomad.app/v1'}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="API Key / Client ID" 
                    defaultValue="sk_live_51Mxxxxxxxxxxxxxxxxxx"
                    type="password"
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="API Secret" 
                    defaultValue="••••••••••••••••••••••••"
                    type="password"
                  />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <TextField 
                    fullWidth 
                    label="Webhook URL (Dành cho thông báo eSIM)" 
                    defaultValue={`https://api.esim.market/hooks/${id}`}
                    helperText="URL này sẽ nhận thông báo khi trạng thái eSIM thay đổi từ phía nhà cung cấp."
                  />
                </Grid2>
              </Grid2>

              <Divider className='my-8' />

              <Typography variant='h6' className='font-black mbe-6 flex items-center gap-2'>
                <i className='tabler-shield-lock text-success' /> Bảo mật & IP Whitelist
              </Typography>
              
              <Grid2 container spacing={6}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField 
                    fullWidth 
                    label="Whitelist IP (Dành cho Outbound)" 
                    placeholder="1.2.3.4, 5.6.7.8"
                    helperText="Danh sách IP của sàn được phép gọi đến Supplier (ngăn chặn rò rỉ Key)."
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Box className='p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 h-full'>
                    <Typography variant='caption' className='font-black uppercase mbe-2 block'>Proxy Configuration</Typography>
                    <Stack spacing={2}>
                      <TextField size='small' fullWidth label="Proxy Host/Port" placeholder="proxy.example.com:8080" />
                      <TextField size='small' fullWidth label="Proxy Auth" type="password" />
                    </Stack>
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />}
                    label={<Typography variant='body2' className='font-black'>Kích hoạt Chế độ Production</Typography>}
                  />
                  <Typography variant='caption' className='block text-slate-500 mt-2'>
                    Khi tắt, hệ thống sẽ sử dụng môi trường Sandbox của NCC (nếu có).
                  </Typography>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm bg-primary/5 border-primary/20'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-2'>Kiểm tra Kết nối</Typography>
              <Typography variant='body2' className='mbe-6'>Sử dụng các thông số hiện tại để thực hiện một lệnh gọi API mẫu (Ping).</Typography>
              <Button fullWidth variant='contained' startIcon={<i className='tabler-bolt' />}>
                Test Connection Now
              </Button>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default SupplierConfig
