'use client'

import { useState, useEffect, useMemo } from 'react'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import dynamic from 'next/dynamic'

import PageHeader from '@/components/layout/shared/PageHeader'

// Type Imports
import type { ApexOptions } from 'apexcharts'

// Dynamically import ApexCharts to avoid SSR issues
const AppReactApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const AnalyticsView = () => {
  const theme = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const primaryColor = '#7367f0'
  const successColor = '#28c76f'
  const warningColor = '#ff9f43'
  const errorColor = '#ea5455'
  const dividerColor = '#e2e8f0'

  // Line Chart Options
  const lineChartOptions: ApexOptions = useMemo(() => ({
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    colors: [primaryColor],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { show: true } },
    grid: { borderColor: dividerColor, padding: { top: -20 } },
    tooltip: { shared: true }
  }), [primaryColor, dividerColor])

  const lineChartSeries = [{ name: 'Spend Amount ($k)', data: [120, 160, 150, 220, 190, 250, 280] }]

  // Donut Chart Options
  const donutChartOptions: ApexOptions = useMemo(() => ({
    labels: ['Electronics', 'Raw Materials', 'Office Assets', 'Maintenance'],
    colors: [primaryColor, successColor, warningColor, errorColor],
    stroke: { width: 0 },
    legend: { show: true, position: 'bottom' },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { fontSize: '0.9rem' },
            value: { fontSize: '1.2rem', fontWeight: 600 },
            total: {
              show: true,
              label: 'Total Spend',
              fontSize: '0.8rem',
              formatter: () => '$1.3M'
            }
          }
        }
      }
    }
  }), [primaryColor, successColor, warningColor, errorColor])

  const donutChartSeries = [45, 25, 20, 10]

  // Heatmap Options (for Vendor Performance Matrix)
  const heatmapOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    dataLabels: { enabled: false },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 0, to: 30, color: '#f8f7fa', name: 'Critical' },
            { from: 31, to: 60, color: '#fcb97d', name: 'Warning' },
            { from: 61, to: 100, color: '#7367f0', name: 'Optimal' }
          ]
        }
      }
    },
    xaxis: { categories: ['Tech Solutions', 'Global Office', 'FastLogistics', 'Stationery Co', 'BuildCorp'] }
  }), [])

  const generateData = (count: number, { min, max }: { min: number, max: number }) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  }

  const heatmapSeries = [
    { name: 'Quality Index', data: generateData(5, { min: 40, max: 95 }) },
    { name: 'Lead Time Reliability', data: generateData(5, { min: 40, max: 95 }) },
    { name: 'Price Compliance', data: generateData(5, { min: 40, max: 95 }) }
  ]

  if (!isMounted) return null

  return (
    <>
      <PageHeader
        title='Spend Analytics'
        description='Detailed insights into procurement expenditure and vendor performance benchmarks'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Strategic Intelligence' }, { label: 'Spending Analytics', href: '/analytics' }]}
      />

      <Grid2 container spacing={6} className='mt-6'>
        {/* Trend Chart */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader 
              title='Procurement Spend Trend' 
              subheader='Total expenditure across all procurement categories'
            />
            <CardContent>
              <AppReactApexCharts type='line' height={350} options={lineChartOptions} series={lineChartSeries} />
            </CardContent>
          </Card>
        </Grid2>

        {/* Categories Chart */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title='Category Spend Distribution' subheader='Expenditure by material group' />
            <CardContent>
              <AppReactApexCharts type='donut' height={350} options={donutChartOptions} series={donutChartSeries} />
            </CardContent>
          </Card>
        </Grid2>

        {/* Vendor Matrix Section */}
        <Grid2 size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Vendor Performance Matrix' subheader='Supplier reliability scores across key procurement KPIs' />
            <CardContent>
              <AppReactApexCharts type='heatmap' height={300} options={heatmapOptions} series={heatmapSeries} />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default AnalyticsView
