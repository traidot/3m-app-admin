'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import PageHeader from '@/components/layout/shared/PageHeader'

const ZoneDetailView = ({ id }: { id: string }) => {
  const bins = [
    { id: 'A1-01', status: 'Full', items: 12 },
    { id: 'A1-02', status: 'Partial', items: 5 },
    { id: 'A1-03', status: 'Empty', items: 0 },
    { id: 'A1-04', status: 'Full', items: 20 },
    { id: 'A2-01', status: 'Empty', items: 0 },
    { id: 'A2-02', status: 'Full', items: 15 },
    { id: 'A3-01', status: 'Partial', items: 2 }
  ]

  return (
    <>
      <PageHeader
        title={`Zone Structure: ${decodeURIComponent(id)}`}
        description='Detailed bin hierarchy and storage level monitoring'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Warehouse', href: '/warehouse/zones' },
          { label: 'Zone Detail' }
        ]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-plus' />}>
            Add New Bin
          </Button>
        }
      />

      <Card className='mt-6 mb-6 shadow-sm'>
        <CardContent className='flex flex-wrap gap-6 items-end p-6'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Bin Locator</Typography>
            <TextField 
                size='small' 
                placeholder='Bin ID, Material SKU...' 
                sx={{ width: 260 }} 
                slotProps={{ input: { startAdornment: <i className='tabler-search text-slate-400 me-2' /> } }}
            />
          </Box>
          <Box className='flex gap-3 mb-1'>
            <Chip label='Capacity: 84%' variant='tonal' color='info' size='small' className='font-bold' />
            <Chip label='12 Critical Shortages' variant='tonal' color='error' size='small' className='font-bold' />
          </Box>
        </CardContent>
      </Card>

      <Grid2 container spacing={4}>
        {bins.map((bin) => {
          const colorMap = {
            Full: { main: 'error.main', light: 'error.lighter', border: '#fee2e2' },
            Partial: { main: 'warning.main', light: 'warning.lighter', border: '#fef3c7' },
            Empty: { main: 'success.main', light: 'success.lighter', border: '#dcfce7' }
          }
          const theme = colorMap[bin.status as keyof typeof colorMap]

          return (
            <Grid2 size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={bin.id}>
              <Card sx={{ 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.border,
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }
              }}>
                <Box sx={{ height: 4, bgcolor: theme.main }} />
                <CardContent className='flex flex-col items-center p-5'>
                  <Typography variant='h6' className='font-black text-slate-800 mb-1 tracking-tight'>{bin.id}</Typography>
                  <Chip 
                    label={bin.status} 
                    size='small' 
                    color={bin.status === 'Full' ? 'error' : bin.status === 'Empty' ? 'success' : 'warning'} 
                    variant='tonal'
                    className='mb-3 font-bold'
                    sx={{ height: 20, fontSize: '0.65rem', textTransform: 'uppercase' }}
                  />
                  <Box className='flex items-baseline gap-1 mt-1'>
                     <Typography variant='h5' className='font-black'>{bin.items}</Typography>
                     <Typography variant='caption' className='font-bold text-slate-400'>SKUs</Typography>
                  </Box>
                  <Button size='small' variant='text' fullWidth className='mt-3 font-bold' color='secondary' sx={{ fontSize: '0.7rem' }}>
                    Quick View
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          )
        })}
      </Grid2>
    </>
  )
}

export default ZoneDetailView
