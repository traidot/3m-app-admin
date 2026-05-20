'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'

import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'
import AddStocktakingDialog from './AddStocktakingDialog'

const countingSessions = [
  { id: 'STK-260401', date: '2026-04-01', location: 'Main Warehouse', items: 450, status: 'Completed', accuracy: '99.2%' },
  { id: 'STK-260415', date: '2026-04-15', location: 'Section B', items: 120, status: 'In Progress', accuracy: '-' },
]

const StocktakingView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <PageHeader
        title='Stocktaking Management'
        description='Coordinate inventory counting and reconcile discrepancies'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Inventory' }, { label: 'Stocktaking' }]}
      />

      <Box className='flex justify-end mt-4 mb-4'>
        <Button variant='contained' startIcon={<i className='tabler-clipboard-plus' />} onClick={() => setIsDialogOpen(true)}>
          New Counting Session
        </Button>
      </Box>

      <Grid2 container spacing={6}>
        {countingSessions.map((session) => (
          <Grid2 size={{ xs: 12, md: 6 }} key={session.id}>
            <Card>
              <CardContent>
                <Box className='flex justify-between items-start mb-4'>
                  <div>
                    <Typography 
                      variant='h6' 
                      color='primary' 
                      className='font-bold' 
                      component={Link} 
                      href={`/3m/inventory/stocktaking/${session.id}`}
                      
                    >
                      #{session.id}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>Planned Date: {session.date}</Typography>
                  </div>
                  <Chip 
                    label={session.status} 
                    color={session.status === 'Completed' ? 'success' : 'warning'} 
                    variant='tonal'
                    size='small'
                  />
                </Box>
                <Grid2 container spacing={4} className='mb-4'>
                  <Grid2 size={{ xs: 6 }}>
                    <Typography variant='caption' display='block'>Location</Typography>
                    <Typography variant='body2' className='font-medium'>{session.location}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 3 }}>
                    <Typography variant='caption' display='block'>Items</Typography>
                    <Typography variant='body2' className='font-medium'>{session.items}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 3 }}>
                    <Typography variant='caption' display='block'>Accuracy</Typography>
                    <Typography variant='body2' className='font-medium' color={session.accuracy !== '-' ? 'success.main' : 'text.primary'}>
                      {session.accuracy}
                    </Typography>
                  </Grid2>
                </Grid2>
                <Box className='flex gap-2'>
                  <Button variant='outlined' size='small' fullWidth>View Details</Button>
                  {session.status === 'In Progress' && (
                    <Button variant='contained' size='small' fullWidth color='warning'>Continue Counting</Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <AddStocktakingDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default StocktakingView
