'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'

const reportTypes = [
  {
    title: 'Spend Analysis Report',
    desc: 'Total expenditure breakdown by category, vendor, and department.',
    icon: 'tabler-calculator',
    color: 'primary'
  },
  {
    title: 'Buying History Log',
    desc: 'Consolidated report of all completed POs and service contracts.',
    icon: 'tabler-history',
    color: 'info'
  },
  {
    title: 'Vendor Performance',
    desc: 'Analysis of lead times, delivery accuracy, and quality ratings.',
    icon: 'tabler-chart-line',
    color: 'success'
  },
  {
    title: 'PO Fulfillment Status',
    desc: 'Track received vs ordered quantities across all open POs.',
    icon: 'tabler-checkup-list',
    color: 'warning'
  },
  {
    title: 'Invoice & Payment Registry',
    desc: 'Monitoring supplier invoices and scheduled payment dates.',
    icon: 'tabler-receipt-2',
    color: 'error'
  },
  {
    title: 'Strategic Sourcing Audit',
    desc: 'Audit trail of RFQs, price negotiations, and bidding results.',
    icon: 'tabler-shield-lock',
    color: 'secondary'
  }
]

const ReportsView = () => {
  return (
    <>
      <PageHeader
        title='Procurement Intelligence'
        description='Generate deep insights and export structured reports for strategic buying decisions'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Reports', href: '/3m/reports' }]}
      />

      <Grid2 container spacing={6} className='mt-6'>
        {reportTypes.map((report, index) => (
          <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={index}>
            <Card className='h-full hover:shadow-md transition-shadow'>
              <CardContent className='flex flex-col h-full'>
                <Box className='flex items-start gap-4 mb-auto'>
                  <Avatar 
                    variant='rounded' 
                    sx={{ width: 44, height: 44, bgcolor: `${report.color}.light`, color: `${report.color}.main`, fontWeight: 'bold' }}
                  >
                    <i className={`${report.icon} text-2xl`} />
                  </Avatar>
                  <div className='flex flex-col gap-1'>
                    <Typography variant='body1' className='font-bold text-slate-900 leading-tight'>{report.title}</Typography>
                    <Typography variant='body2' className='text-slate-600 leading-normal mt-1'>
                      {report.desc}
                    </Typography>
                  </div>
                </Box>
                <Box className='flex items-center gap-3 mt-6'>
                  <Button variant='tonal' size='small' className='font-medium' startIcon={<i className='tabler-file-download' />}>
                    Export
                  </Button>
                  <Button variant='tonal' size='small' color='secondary' className='font-medium' startIcon={<i className='tabler-printer' />}>
                    Print
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}

        {/* System Activity Logs */}
        <Grid2 size={{ xs: 12 }}>
          <Card>
            <Box className='p-6 flex items-center justify-between border-be'>
              <Typography variant='h6' className='font-semibold'>Recent Procurement Operations History</Typography>
              <Button component={Link} href='/3m/reports/audit' size='small' variant='tonal' color='secondary' className='font-medium'>Full Audit Trail</Button>
            </Box>
            <CardContent className='p-0'>
              {[
                { time: '12:45 PM', user: 'Procurement-01', module: 'PO Ops', action: 'Created Purchase Order #PO-2026-045 for "Office Gear"', color: 'primary' },
                { time: '11:20 AM', user: 'MGR-APPR', module: 'Approval', action: 'Approved RFQ #RFQ-882 for "Server Infrastructure"', color: 'success' },
                { time: '10:05 AM', user: 'Warehouse', module: 'Logistics', action: 'Received 150/150 units for Receipt #GR-441', color: 'info' },
                { time: '09:30 AM', user: 'System', module: 'Analysis', action: 'Vendor performance ratings updated for Q1', color: 'secondary' }
              ].map((log, i) => (
                <Box key={i} className='flex flex-wrap md:flex-nowrap items-center gap-4 p-4 border-be last:border-0 hover:bg-slate-50 transition-colors'>
                  <Box className='flex flex-col min-w-[100px]'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-400'>Timestamp</Typography>
                    <Typography variant='body2' className='font-medium text-slate-700'>{log.time}</Typography>
                  </Box>
                  <Box className='flex flex-col min-w-[120px]'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-400'>Module</Typography>
                    <Chip label={log.module} size='small' variant='tonal' color={log.color as any} className='font-bold mt-1' />
                  </Box>
                  <Box className='flex flex-col flex-grow'>
                    <Typography variant='caption' className='uppercase font-bold text-slate-400'>Actor / Operation Summary</Typography>
                    <Typography variant='body2' className='mt-1 text-slate-800'>
                      <span className='font-bold text-primary'>{log.user}</span>: {log.action}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default ReportsView
