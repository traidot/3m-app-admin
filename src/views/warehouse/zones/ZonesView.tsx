'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import { useState } from 'react'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'
import AddZoneDialog from './AddZoneDialog'

const ZonesView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const zones = [
    { name: 'Zone A - Electronics', capacity: 85, bins: 120, lead: 'Alice Brown', color: 'primary' },
    { name: 'Zone B - Furniture', capacity: 40, bins: 45, lead: 'Bob Smith', color: 'success' },
    { name: 'Zone C - Cold Storage', capacity: 92, bins: 80, lead: 'Charlie Davis', color: 'info' },
    { name: 'Zone D - Hazardous', capacity: 15, bins: 20, lead: 'Diana Prince', color: 'error' }
  ]

  return (
    <>
      <PageHeader
        title='Storage & Fulfillment Zones'
        description='Configure and monitor incoming material storage locations'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Master Data & Assets' }, { label: 'Storage Layout', href: '/warehouse/zones' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setIsDialogOpen(true)}>Add New Zone</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
        {zones.map((zone, i) => (
          <Grid2 size={{ xs: 12, md: 6 }} key={i}>
            <Card>
              <CardHeader 
                title={zone.name}
                action={<Chip label={`Capacity: ${zone.capacity}%`} color={zone.capacity > 90 ? 'error' : 'primary'} variant='tonal' size='small' />}
              />
              <CardContent>
                <Box className='mb-4'>
                  <LinearProgress variant='determinate' value={zone.capacity} color={zone.color as any} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Grid2 container spacing={4}>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' className='uppercase font-bold text-slate-500'>Total Bins</Typography>
                    <Typography variant='body1' className='font-bold text-slate-800'>{zone.bins}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' className='uppercase font-bold text-slate-500'>Zone Lead</Typography>
                    <Typography variant='body1' className='font-bold text-slate-800'>{zone.lead}</Typography>
                  </Grid2>
                </Grid2>
                <Box className='mt-6 flex gap-2'>
                  <Button 
                    variant='outlined' 
                    fullWidth 
                    size='small'
                    component={Link}
                    href={`/3m/warehouse/zones/${encodeURIComponent(zone.name)}`}
                  >
                    Manage Bins
                  </Button>
                  <Button variant='outlined' fullWidth size='small'>View Stock Map</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      <AddZoneDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default ZonesView
