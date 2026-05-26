'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { useTheme } from '@mui/material/styles'

import PageHeader from '@/components/layout/shared/PageHeader'
import CardStatHorizontal from '@/components/card-statistics/Horizontal'

// Dynamic import of ApexCharts to prevent SSR window issues
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const AgentDashboard = () => {
  const theme = useTheme()
  const [timeRange, setTimeRange] = useState('30days')

  const primaryColor = '#7367f0'
  const successColor = '#28c76f'
  const warningColor = '#ff9f43'
  const errorColor = '#ea5455'
  const infoColor = '#00cfe8'
  const secondaryColor = '#a8aaae'

  // Mock charts settings & data
  const revenueChartOptions: any = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: [primaryColor, successColor],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '35%',
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toLocaleString()} đ`
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

  const revenueChartSeries = [
    { name: 'Doanh thu bán lẻ', data: [38000000, 42000000, 51000000, 48000000, 66600000, 0] },
    { name: 'Lợi nhuận ròng', data: [9500000, 10500000, 12750000, 12000000, 16650000, 0] }
  ]

  const pieOptionsCountries: any = {
    chart: { type: 'donut' },
    labels: ['Nhật Bản', 'Hàn Quốc', 'Thái Lan', 'Châu Âu', 'Mỹ & Khác'],
    colors: [primaryColor, infoColor, successColor, warningColor, secondaryColor],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { position: 'bottom' }
  }
  const pieSeriesCountries = [35, 25, 20, 12, 8]

  const pieOptionsDurations: any = {
    chart: { type: 'donut' },
    labels: ['Gói ngắn ngày (<7 ngày)', 'Gói trung bình (7-15 ngày)', 'Gói dài ngày (>15 ngày)'],
    colors: [primaryColor, warningColor, errorColor],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { position: 'bottom' }
  }
  const pieSeriesDurations = [55, 30, 15]

  // Top eSIM products sold by agent
  const topPackages = [
    {
      name: 'ESA-JP-5G (Softbank)',
      country: 'Nhật Bản',
      flag: '🇯🇵',
      capacity: '10 GB (Total)',
      salesCount: 245,
      revenue: 58800000,
      profit: 14700000
    },
    {
      name: 'GMW-KR-5G (SKT)',
      country: 'Hàn Quốc',
      flag: '🇰🇷',
      capacity: '2 GB / Ngày',
      salesCount: 184,
      revenue: 40480000,
      profit: 10120000
    },
    {
      name: 'AIS-TH-PRO (AIS)',
      country: 'Thái Lan',
      flag: '🇹🇭',
      capacity: '15 GB (Total)',
      salesCount: 152,
      revenue: 27360000,
      profit: 6840000
    },
    {
      name: 'EUR-ROAM-30 (Vodafone)',
      country: 'Châu Âu (30 nước)',
      flag: '🇪🇺',
      capacity: '20 GB (Total)',
      salesCount: 95,
      revenue: 33250000,
      profit: 8312500
    },
    {
      name: 'T-USA-PRO (T-Mobile)',
      country: 'Mỹ',
      flag: '🇺🇸',
      capacity: 'Không giới hạn',
      salesCount: 78,
      revenue: 31200000,
      profit: 7800000
    }
  ]

  // Recent order timeline activity
  const recentOrders = [
    {
      id: 'ORD-2026-9912',
      customer: 'Nguyễn Văn Hùng',
      packageName: 'ESA-JP-5G',
      flag: '🇯🇵',
      date: 'Vừa xong',
      amount: 240000,
      status: 'success'
    },
    {
      id: 'ORD-2026-9908',
      customer: 'Trần Thị Thuỷ',
      packageName: 'GMW-KR-5G',
      flag: '🇰🇷',
      date: '10 phút trước',
      amount: 220000,
      status: 'success'
    },
    {
      id: 'ORD-2026-9895',
      customer: 'Phạm Minh Hoàng',
      packageName: 'EUR-ROAM-30',
      flag: '🇪🇺',
      date: '1 giờ trước',
      amount: 350000,
      status: 'pending'
    },
    {
      id: 'ORD-2026-9884',
      customer: 'Hoàng Anh Tuấn',
      packageName: 'T-USA-PRO',
      flag: '🇺🇸',
      date: '3 giờ trước',
      amount: 400000,
      status: 'failed'
    }
  ]

  return (
    <>
      <PageHeader
        title="Bảng điều khiển Đại lý"
        description="Giám sát doanh thu, chi phí, lợi nhuận và phân tích khách hàng đại lý"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bảng điều khiển' }]}
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* ROW 1: Statistics Cards */}
        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <CardStatHorizontal
            stats="245,600,000 đ"
            title="Doanh thu"
            avatarIcon='tabler-currency-dollar'
            avatarColor='success'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <CardStatHorizontal
            stats="184,200,000 đ"
            title="Chi phí"
            avatarIcon='tabler-credit-card'
            avatarColor='error'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <CardStatHorizontal
            stats="61,400,000 đ"
            title="Lãi"
            avatarIcon='tabler-trending-up'
            avatarColor='primary'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <CardStatHorizontal
            stats="842 đơn"
            title="Số lượng đơn"
            avatarIcon='tabler-device-mobile'
            avatarColor='warning'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
          <CardStatHorizontal
            stats="156 khách"
            title="Số lượng khách hàng"
            avatarIcon='tabler-users'
            avatarColor='info'
          />
        </Grid2>

        {/* ROW 2: Monthly Business Performance Bar Chart */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Card className="bs-full">
            <CardHeader
              title="Biểu đồ hiệu suất doanh thu & lợi nhuận"
              subheader="Theo dõi biên lợi nhuận ròng thực tế theo từng tháng"
              action={
                <TextField
                  select
                  size="small"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="7days">7 ngày qua</MenuItem>
                  <MenuItem value="30days">30 ngày qua</MenuItem>
                  <MenuItem value="6months">6 tháng đầu năm</MenuItem>
                </TextField>
              }
            />
            <CardContent>
              <AppReactApexCharts type="bar" height={320} options={revenueChartOptions} series={revenueChartSeries} />
            </CardContent>
          </Card>
        </Grid2>

        {/* ROW 2: Destination Countries Donut Chart */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card className="bs-full">
            <CardHeader
              title="Tỷ trọng theo Vùng quốc gia"
              subheader="Phân bổ thị phần khách du lịch của đại lý"
            />
            <CardContent className="flex justify-center flex-col items-center gap-4">
              <AppReactApexCharts type="donut" height={220} options={pieOptionsCountries} series={pieSeriesCountries} />
              <Typography variant="caption" color="text.secondary" align="center" className="px-4">
                Điểm đến tại Nhật Bản và Hàn Quốc chiếm hơn 60% tổng lượng eSIM cấp phát.
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* ROW 3: Top Selling Table */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardHeader
              title="Gói eSIM bán chạy nhất"
              subheader="Xếp hạng 5 sản phẩm mang lại doanh thu tốt nhất"
            />
            <TableContainer>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Gói eSIM</TableCell>
                    <TableCell>Quốc gia</TableCell>
                    <TableCell>Dung lượng</TableCell>
                    <TableCell align="right">Lượt bán</TableCell>
                    <TableCell align="right">Doanh thu</TableCell>
                    <TableCell align="right">Lợi nhuận đại lý</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPackages.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <span>{row.flag}</span>
                          <Typography variant="body2">{row.country}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{row.capacity}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{row.salesCount}</TableCell>
                      <TableCell align="right">{row.revenue.toLocaleString()} đ</TableCell>
                      <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 600 }}>
                        {row.profit.toLocaleString()} đ
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid2>

        {/* ROW 3: eSIM Durations Share Donut & Recent Activity */}
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Card className="bs-full">
            <CardHeader
              title="Đơn hàng gần đây"
              subheader="Theo dõi trạng thái giao dịch thời gian thực"
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {recentOrders.map((order, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar sx={{ bgcolor: 'action.selected', color: 'text.primary', width: 38, height: 38 }}>
                        {order.flag}
                      </Avatar>
                      <div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {order.packageName} - {order.customer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.date} • {order.id}
                        </Typography>
                      </div>
                    </Box>
                    <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {order.amount.toLocaleString()} đ
                      </Typography>
                      <Chip
                        label={
                          order.status === 'success' ? 'Thành công' :
                          order.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'
                        }
                        color={
                          order.status === 'success' ? 'success' :
                          order.status === 'pending' ? 'warning' : 'error'
                        }
                        size="small"
                        variant="tonal"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default AgentDashboard
