'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Grid2 from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

const ESimInfoCard = () => {
  // Dữ liệu tổng hợp từ Bảng giá và JSON API bạn cung cấp
  const esimData = {
    product: {
      name: "eSIM China Test Plan",
      packageId: "1c8c3d46a4f4420ab",
      region: "Đông Á (East Asia)",
      country: "Trung Quốc (China)",
      data: "10GB",
      days: "1 ngày",
      fup: "384kbps after high-speed",
      operator: "China Unicom / Mobile",
      type: "Roaming",
      apn: "xxx",
      activationMode: "Tự động khi kết nối mạng"
    },
    technical: {
      iccid: "8944538559985007137",
      lpa: "LPA:1$rsp.esimcase.com$A0FVN-7UMTA-J8FVG-2Q775",
      qrcode: "http://api.tsimtech.com/tsim/qrcode?id=9bd2687fb3ce4550a1394e00cddbaef1",
      iosLink: "https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=LPA:1$rsp.esimcase.com$A0FVN-7UMTA-J8FVG-2Q775",
      androidLink: "https://esimsetup.android.com/esim_qrcode_provisioning?carddata=LPA:1$rsp.esimcase.com$A0FVN-7UMTA-J8FVG-2Q775",
      msisdn: "000000000000",
      pin1: "1234",
      puk1: "12345678"
    },
    status: "Hoạt động (Active)"
  }

  const InfoRow = ({ label, value, copyable = false }: { label: string, value: string, copyable?: boolean }) => (
    <Box className='flex justify-between items-center py-2'>
      <Typography variant='caption' className='text-slate-500 uppercase font-bold'>{label}</Typography>
      <Box className='flex items-center gap-2'>
        <Typography variant='body2' className={`font-black ${copyable ? 'font-mono text-primary' : ''}`}>{value}</Typography>
        {copyable && (
          <IconButton size='small'><i className='tabler-copy text-xs' /></IconButton>
        )}
      </Box>
    </Box>
  )

  return (
    <Box className='max-is-[800px] mx-auto p-6'>
      {/* Header Profile */}
      <Card className='border-none shadow-xl overflow-visible mbe-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white'>
        <CardContent className='p-8 relative'>
          <Box className='flex justify-between items-start'>
            <Box>
              <Chip label={esimData.status} color='success' size='small' className='mbe-2 font-bold' />
              <Typography variant='h4' className='text-white font-black'>{esimData.product.name}</Typography>
              <Typography variant='body2' className='text-slate-400'>ID: {esimData.product.packageId}</Typography>
            </Box>
            <Box className='bg-white p-2 rounded-xl shadow-lg'>
              <img src={esimData.technical.qrcode} alt='QR Code' className='w-[100px] h-[100px]' />
            </Box>
          </Box>
          
          <Box className='grid grid-cols-3 gap-6 mt-8'>
            <Box>
              <Typography variant='caption' className='text-slate-400 uppercase'>Dung lượng</Typography>
              <Typography variant='h6' className='text-white font-black'>{esimData.product.data}</Typography>
            </Box>
            <Box>
              <Typography variant='caption' className='text-slate-400 uppercase'>Thời hạn</Typography>
              <Typography variant='h6' className='text-white font-black'>{esimData.product.days}</Typography>
            </Box>
            <Box>
              <Typography variant='caption' className='text-slate-400 uppercase'>Vùng phủ</Typography>
              <Typography variant='h6' className='text-white font-black'>{esimData.product.country}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid2 container spacing={6}>
        {/* Cài đặt nhanh */}
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4 flex items-center gap-2'>
                <i className='tabler-device-mobile text-primary' /> Hướng dẫn Cài đặt
              </Typography>
              
              <Box className='p-4 bg-slate-50 rounded-xl mbe-4 border border-dashed border-slate-200'>
                <Typography variant='caption' className='text-slate-500 uppercase block mbe-2 font-bold'>LPA String (Cài đặt thủ công)</Typography>
                <Typography variant='body2' className='font-mono break-all text-primary font-bold'>{esimData.technical.lpa}</Typography>
                <Button size='small' startIcon={<i className='tabler-copy' />} className='mt-2'>Sao chép LPA</Button>
              </Box>

              <Stack direction='row' spacing={4}>
                <Button 
                  fullWidth 
                  variant='tonal' 
                  startIcon={<i className='tabler-brand-apple' />} 
                  href={esimData.technical.iosLink}
                >
                  Cài cho iPhone
                </Button>
                <Button 
                  fullWidth 
                  variant='tonal' 
                  startIcon={<i className='tabler-brand-android' />}
                  href={esimData.technical.androidLink}
                >
                  Cài cho Android
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Thông số mạng */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4'>Thông số Mạng</Typography>
              <InfoRow label="Nhà mạng" value={esimData.product.operator} />
              <InfoRow label="Điểm truy cập (APN)" value={esimData.product.apn} copyable />
              <InfoRow label="FUP" value={esimData.product.fup} />
              <Divider className='my-2' />
              <InfoRow label="PIN 1" value={esimData.technical.pin1} />
              <InfoRow label="PUK 1" value={esimData.technical.puk1} />
            </CardContent>
          </Card>
        </Grid2>

        {/* Thông tin kỹ thuật đầy đủ */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-none shadow-sm'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4'>Dữ liệu Kỹ thuật (Metadata)</Typography>
              <Grid2 container spacing={4}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <InfoRow label="ICCID" value={esimData.technical.iccid} copyable />
                  <InfoRow label="Số điện thoại (MSISDN)" value={esimData.technical.msisdn} />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <InfoRow label="Chế độ kích hoạt" value={esimData.product.activationMode} />
                  <InfoRow label="Loại gói" value={esimData.product.type} />
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default ESimInfoCard
