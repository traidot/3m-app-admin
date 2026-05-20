'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'

import PageHeader from '@/components/layout/shared/PageHeader'

const StaffPerformanceView = () => {
  const leaderboard = [
    { name: 'Mike Johnson', role: 'Picker', picks: 1250, accuracy: 99.8, avatar: 'M' },
    { name: 'Sarah Lee', role: 'Packer', picks: 980, accuracy: 99.5, avatar: 'S' },
    { name: 'David Kim', role: 'Receiver', picks: 850, accuracy: 98.2, avatar: 'D' }
  ]

  return (
    <>
      <PageHeader
        title='Workforce Performance'
        description='Optimize warehouse labor productivity and order fulfillment accuracy'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Workforce' }, { label: 'Efficiency' }]}
      />

      <Grid2 container spacing={6} className='mt-6'>
        {leaderboard.map((staff, i) => (
          <Grid2 size={{ xs: 12, md: 4 }} key={i}>
            <Card>
              <CardContent className='flex flex-col items-center p-6'>
                <Avatar sx={{ width: 60, height: 60, mb: 4, bgcolor: 'primary.main' }}>{staff.avatar}</Avatar>
                <Typography variant='h6'>{staff.name}</Typography>
                <Typography variant='caption' className='mb-4'>{staff.role}</Typography>
                
                <Box className='w-full'>
                  <Box className='flex justify-between mb-1'>
                    <Typography variant='caption'>Tasks Completed</Typography>
                    <Typography variant='body2' className='font-bold'>{staff.picks}</Typography>
                  </Box>
                  <LinearProgress variant='determinate' value={90} className='mb-4' sx={{ height: 6, borderRadius: 3 }} />
                  
                  <Box className='flex justify-between'>
                    <Typography variant='caption'>Accuracy Rate</Typography>
                    <Typography variant='body2' className='font-bold' color='success.main'>{staff.accuracy}%</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}

        <Grid2 size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Operational Efficiency Trend' subheader='Picking speed vs volume' />
            <CardContent>
              <Box className='h-[200px] bg-slate-50 flex items-center justify-center rounded border-dashed border-2'>
                <Typography variant='body2' color='text.secondary'>[Productivity Heatmap Visualization Placeholder]</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default StaffPerformanceView
