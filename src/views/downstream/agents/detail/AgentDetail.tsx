'use client'

import { useState } from 'react'
import Link from 'next/link'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { useTheme } from '@mui/material/styles'

import PageHeader from '@/components/layout/shared/PageHeader'
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'

const AgentDetail = ({ id }: { id: string }) => {
  const theme = useTheme()
  const [openEdit, setOpenEdit] = useState(false)
  const [openPayment, setOpenPayment] = useState(false)
  const [year, setYear] = useState('2026')

  // Mock Agent Data
  const agent = {
    id: id.toUpperCase(),
    name: id.toUpperCase() === 'A001' ? 'TravelConnect Solutions' : 'Global eSIM Hub',
    email: 'contact@travelconnect.com',
    tier: id.toUpperCase() === 'A001' ? 'PLATINUM' : 'GOLD',
    balance: 5240.00,
    limit: 50000.00,
    currency: 'USD',
    ordersThisMonth: 1240,
    markupProfitThisMonth: 4500.50,
    type: id.toUpperCase() === 'A001' ? 'postpaid' : 'prepaid'
  }

  const quickLinks = [
    { title: 'Thiết lập bảng giá đại lý', desc: 'Định giá & Markup riêng', icon: 'tabler-cash', href: `/3m/downstream/agents/${id.toLowerCase()}/pricing`, color: 'success' },
    { title: 'Bảng giá Đại lý', desc: 'Xem giá cuối cùng áp dụng', icon: 'tabler-file-invoice', href: `/3m/downstream/agents/${id.toLowerCase()}/price-list`, color: 'primary' }
  ]

  // Chart Configuration
  const primaryColor = '#7367f0'
  const successColor = '#28c76f'

  const chartOptions: any = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: [primaryColor, successColor],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      colors: ['transparent'],
      width: 4
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${val.toLocaleString()}`
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      padding: { top: -20, bottom: -10 }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { radius: 12 }
    }
  }

  const chartSeries = [
    { name: 'Doanh thu', data: [12000, 15000, 18500, 16000, 22400, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Lợi nhuận', data: [2500, 3200, 4100, 3800, 5200, 0, 0, 0, 0, 0, 0, 0] }
  ]

  return (
    <>
      <PageHeader
        title={`Dashboard: ${agent.name}`}
        description={`Quản lý tài khoản, doanh thu và cấu hình phân phối cho đại lý (${agent.id})`}
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân phối', href: '/3m/downstream/agents' }, { label: agent.name }]}
        actions={
          <Stack direction='row' spacing={4}>
            <Button
              variant='tonal'
              color='info'
              startIcon={<i className='tabler-plug-connected mie-2' />}
              component={Link}
              href={`/3m/downstream/agents/${id.toLowerCase()}/api-config`}
            >
              Cổng API & Webhooks
            </Button>
            <Button
              variant='contained'
              color='primary'
              startIcon={<i className='tabler-edit mie-2' />}
              onClick={() => setOpenEdit(true)}
            >
              Chỉnh sửa Đại lý
            </Button>
          </Stack>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* MAIN CONTENT (LEFT) */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Grid2 container spacing={6} className='mbe-6'>
            {/* CARD 1: WALLET / DEBT */}
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              {agent.type === 'postpaid' ? (
                <Card className='border-none shadow-sm bg-error/5 border-error/20 h-full'>
                  <CardContent className='p-6 flex flex-col justify-center h-full'>
                    <Box className='flex justify-between items-start mbe-4'>
                      <Typography variant='subtitle2' className='font-black uppercase text-error'>Công nợ hiện tại</Typography>
                      <Chip label="Dùng Công nợ" size="small" color="error" variant="tonal" className="font-bold" />
                    </Box>
                    <Typography variant='h2' className='font-black mbe-4 text-slate-900'>${agent.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                    <Box className='mbe-6'>
                      <Button variant="contained" color="error" size="small" startIcon={<i className='tabler-receipt' />} onClick={() => setOpenPayment(true)}>
                        Thanh toán nợ
                      </Button>
                    </Box>
                    <Box>
                      <Typography variant='caption' className='font-black uppercase text-slate-500 mbe-1 block text-[10px]'>Đơn vị tiền tệ</Typography>
                      <Typography variant='h6' className='font-black text-primary'>USD ($)</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Card className='border-none shadow-sm bg-success/5 border-success/20 h-full'>
                  <CardContent className='p-6 flex flex-col justify-center h-full'>
                    <Box className='flex justify-between items-start mbe-4'>
                      <Typography variant='subtitle2' className='font-black uppercase text-success'>Số dư ví</Typography>
                      <Chip label="Dùng Ví" size="small" color="success" variant="tonal" className="font-bold" />
                    </Box>
                    <Typography variant='h2' className='font-black mbe-4 text-slate-900'>${agent.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                    <Box className='mbe-6'>
                      <Button variant="contained" color="success" size="small" startIcon={<i className='tabler-plus' />} onClick={() => setOpenPayment(true)}>
                        Nạp thêm tiền
                      </Button>
                    </Box>
                    <Box>
                      <Typography variant='caption' className='font-black uppercase text-slate-500 mbe-1 block text-[10px]'>Đơn vị tiền tệ</Typography>
                      <Typography variant='h6' className='font-black text-success'>USD ($)</Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid2>

            {/* CARD 2: ORDERS STATS */}
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              <Card className='border-none shadow-sm h-full flex flex-col justify-center'>
                <CardContent className='p-6 text-center'>
                  <Avatar variant='rounded' sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 4, width: 48, height: 48 }}>
                    <i className='tabler-shopping-cart text-2xl' />
                  </Avatar>
                  <Typography variant='subtitle2' className='font-black uppercase text-slate-500 mbe-1'>Đơn hàng</Typography>
                  <Typography variant='h2' className='font-black text-slate-900'>{agent.ordersThisMonth.toLocaleString()}</Typography>
                  <Typography variant='caption' className='text-slate-400 block mt-2'>Tháng này</Typography>
                </CardContent>
              </Card>
            </Grid2>

            {/* CARD 3: PROFIT STATS */}
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
              <Card className='border-none shadow-sm h-full flex flex-col justify-center'>
                <CardContent className='p-6 text-center'>
                  <Avatar variant='rounded' sx={{ bgcolor: 'success.main', mx: 'auto', mb: 4, width: 48, height: 48 }}>
                    <i className='tabler-chart-arrows-vertical text-2xl' />
                  </Avatar>
                  <Typography variant='subtitle2' className='font-black uppercase text-slate-500 mbe-1'>Lợi nhuận gộp</Typography>
                  <Typography variant='h2' className='font-black text-success'>${agent.markupProfitThisMonth.toLocaleString()}</Typography>
                  <Typography variant='caption' className='text-slate-400 block mt-2'>Dựa trên Markup</Typography>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>

          {/* REVENUE CHART */}
          <Grid2 size={{ xs: 12 }}>
            <Card className='border-none shadow-sm'>
              <CardHeader 
                title='Phân tích Doanh thu & Lợi nhuận' 
                subheader='Thống kê hiệu quả kinh doanh theo từng tháng'
                action={
                  <TextField 
                    select 
                    size='small' 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                    className='is-[100px]'
                  >
                    <MenuItem value='2024'>2024</MenuItem>
                    <MenuItem value='2025'>2025</MenuItem>
                    <MenuItem value='2026'>2026</MenuItem>
                  </TextField>
                }
              />
              <CardContent>
                <AppReactApexCharts type='bar' height={350} options={chartOptions} series={chartSeries} />
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        {/* SIDEBAR (RIGHT) */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Box className='flex flex-col gap-6 sticky top-6'>
            <Typography variant='h5' className='font-black'>Trung tâm Quản trị</Typography>
            <Stack spacing={4}>
              {quickLinks.map((link) => (
                <Card
                  key={link.title}
                  component={Link}
                  href={link.href}
                  className='border-none shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-primary/20'
                >
                  <CardContent className='flex items-center gap-4 p-5'>
                    <Avatar variant='rounded' sx={{ bgcolor: `${link.color}.main`, width: 44, height: 44 }}>
                      <i className={`${link.icon} text-xl`} />
                    </Avatar>
                    <Box>
                      <Typography variant='body1' className='font-black'>{link.title}</Typography>
                      <Typography variant='caption' className='text-slate-500'>{link.desc}</Typography>
                    </Box>
                    <i className='tabler-chevron-right mis-auto text-slate-300' />
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Card className='border-none shadow-sm bg-primary/5'>
              <CardContent className='p-6'>
                <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-primary'>Thông tin nhanh</Typography>
                <Stack spacing={3}>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='caption' className='font-bold text-slate-500'>Cấp bậc hiện tại</Typography>
                    <Chip label={agent.tier} size='small' color='primary' className='font-black' />
                  </Box>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='caption' className='font-bold text-slate-500'>Hình thức thanh toán</Typography>
                    <Typography variant='caption' className='font-black uppercase'>{agent.type === 'postpaid' ? 'Công nợ' : 'Ví'}</Typography>
                  </Box>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='caption' className='font-bold text-slate-500'>Liên hệ</Typography>
                    <Typography variant='caption' className='font-black'>{agent.email}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid2>
      </Grid2>

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle className='font-black text-xl'>Chỉnh sửa thông tin Đại lý</DialogTitle>
        <DialogContent dividers>
          <Grid2 container spacing={4} className='mbs-2'>
            <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth label='Tên đại lý' defaultValue={agent.name} />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth label='Email liên hệ' defaultValue={agent.email} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField select fullWidth label='Cấp bậc (Tier)' defaultValue={agent.tier}>
                <MenuItem value='PLATINUM'>Platinum</MenuItem>
                <MenuItem value='GOLD'>Gold</MenuItem>
                <MenuItem value='SILVER'>Silver</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField select fullWidth label='Hình thức thanh toán' defaultValue={agent.type}>
                <MenuItem value='postpaid'>Công nợ</MenuItem>
                <MenuItem value='prepaid'>Ví</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField select fullWidth label='Đơn vị tiền tệ' defaultValue='USD'>
                <MenuItem value='USD'>USD ($)</MenuItem>
                <MenuItem value='JPY'>JPY (¥)</MenuItem>
                <MenuItem value='VND'>VND (đ)</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions className='p-4'>
          <Button variant='tonal' color='secondary' onClick={() => setOpenEdit(false)}>Hủy</Button>
          <Button variant='contained' onClick={() => setOpenEdit(false)}>Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle className='font-black text-xl'>
          {agent.type === 'postpaid' ? 'Thanh toán công nợ' : 'Nạp tiền vào ví'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={4} className='mbs-2'>
            <Box className='p-4 bg-primary/5 rounded-lg'>
              <Typography variant='caption' className='font-bold text-slate-500 uppercase block mbe-1'>
                {agent.type === 'postpaid' ? 'Công nợ hiện tại' : 'Số dư hiện tại'}
              </Typography>
              <Typography variant='h4' className='font-black text-primary'>
                ${agent.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
            <TextField
              fullWidth
              label='Số tiền thanh toán'
              placeholder='0.00'
              type='number'
              InputProps={{
                startAdornment: <i className='tabler-currency-dollar text-slate-400 mie-2' />
              }}
            />
            <TextField select fullWidth label='Phương thức thanh toán' defaultValue='bank'>
              <MenuItem value='bank'>Chuyển khoản ngân hàng</MenuItem>
              <MenuItem value='cash'>Tiền mặt</MenuItem>
              <MenuItem value='wallet'>Ví điện tử</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={2}
              label='Ghi chú'
              placeholder='Nhập nội dung thanh toán...'
            />
          </Stack>
        </DialogContent>
        <DialogActions className='p-4'>
          <Button variant='tonal' color='secondary' onClick={() => setOpenPayment(false)}>Hủy</Button>
          <Button variant='contained' color={agent.type === 'postpaid' ? 'error' : 'success'} onClick={() => setOpenPayment(false)}>
            {agent.type === 'postpaid' ? 'Xác nhận thanh toán' : 'Xác nhận nạp tiền'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AgentDetail
