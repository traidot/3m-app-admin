'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'

import PageHeader from '@/components/layout/shared/PageHeader'
import CardStatHorizontal from '@/components/card-statistics/Horizontal'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const AdminDashboard = () => {
  const theme = useTheme()
  const [year, setYear] = useState('2026')

  const primaryColor = '#7367f0'
  const successColor = '#28c76f'
  const warningColor = '#ff9f43'
  const errorColor = '#ea5455'
  const infoColor = '#00cfe8'
  const secondaryColor = '#a8aaae'

  const chartOptions: any = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: [primaryColor, errorColor],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: false
    },
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
        formatter: (val: number) => `$${val / 1000}k`
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
    { name: 'Doanh thu', data: [85000, 92000, 110000, 105000, 124500, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Chi phí', data: [65000, 70000, 82000, 78000, 92300, 0, 0, 0, 0, 0, 0, 0] }
  ]

  const pieOptionsRegions: any = {
    chart: { type: 'donut' },
    labels: ['Nhật Bản', 'Hàn Quốc', 'Châu Âu', 'Mỹ', 'Đông Nam Á'],
    colors: [primaryColor, infoColor, warningColor, successColor, errorColor],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { position: 'bottom' }
  }
  const pieSeriesRegions = [30, 25, 20, 15, 10]

  const pieOptionsAgents: any = {
    chart: { type: 'donut' },
    labels: ['TravelConnect SG', 'Global Roam JP', 'EuroSim Partners', 'Khác'],
    colors: [successColor, errorColor, secondaryColor, '#9c92f4'],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { position: 'bottom' }
  }
  const pieSeriesAgents = [35, 30, 20, 15]

  return (
    <>
      <PageHeader
        title="Bảng điều khiển 3M (Admin)"
        description="Tổng quan tài chính và công nợ nền tảng"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bảng điều khiển' }]}
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <CardStatHorizontal
            stats="$124,500"
            title="Doanh thu tháng này"
            avatarIcon='tabler-currency-dollar'
            avatarColor='success'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <CardStatHorizontal
            stats="$92,300"
            title="Chi phí tháng này"
            avatarIcon='tabler-credit-card'
            avatarColor='error'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <CardStatHorizontal
            stats="$32,450"
            title="Công nợ phải thu (Đại lý)"
            avatarIcon='tabler-file-invoice'
            avatarColor='info'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <CardStatHorizontal
            stats="$15,200"
            title="Công nợ phải trả (NCC)"
            avatarIcon='tabler-building-bank'
            avatarColor='warning'
          />
        </Grid2>

        {/* Revenue & Cost Chart */}
        <Grid2 size={{ xs: 12 }}>
          <Card>
            <CardHeader 
              title='Biểu đồ Doanh thu & Chi phí' 
              subheader='Thống kê tổng quan tài chính theo từng tháng trong năm'
              action={
                <TextField 
                  select 
                  size='small' 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)}
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

        {/* Regions / Countries Pie Chart */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader 
              title='Cấu trúc theo Vùng / Quốc gia' 
              subheader='Tỷ trọng doanh thu theo khu vực địa lý'
            />
            <CardContent className='flex justify-center'>
              <AppReactApexCharts type='donut' height={300} options={pieOptionsRegions} series={pieSeriesRegions} />
            </CardContent>
          </Card>
        </Grid2>

        {/* Agents Pie Chart */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader 
              title='Cấu trúc theo Đại lý' 
              subheader='Tỷ trọng giao dịch theo Downstream'
            />
            <CardContent className='flex justify-center'>
              <AppReactApexCharts type='donut' height={300} options={pieOptionsAgents} series={pieSeriesAgents} />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default AdminDashboard
