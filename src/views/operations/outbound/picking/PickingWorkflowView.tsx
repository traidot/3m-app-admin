'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'

import PageHeader from '@/components/layout/shared/PageHeader'

const PickingWorkflowView = ({ id }: { id: string }) => {
  const [pickedCount, setPickedCount] = useState(2)
  const totalItems = 5

  return (
    <>
      <PageHeader
        title={`Work Order: ${id}`}
        description='Real-time picking guidance and item verification'
        breadcrumbs={[
          { label: 'Outbound', href: '/operations/outbound' },
          { label: 'Picking Workflow' }
        ]}
        actions={
          <Button variant='contained' color='error' startIcon={<i className='tabler-ban' />}>
            Suspend Order
          </Button>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
        {/* Progress Tracker */}
        <Grid2 size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box className='flex justify-between items-center mb-2'>
                <Typography variant='h6'>Picking Progress</Typography>
                <Typography variant='h6' color='primary'>{pickedCount} / {totalItems} items</Typography>
              </Box>
              <LinearProgress 
                variant='determinate' 
                value={(pickedCount / totalItems) * 100} 
                sx={{ height: 12, borderRadius: 6 }} 
              />
            </CardContent>
          </Card>
        </Grid2>

        {/* Current Target Item */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
            <Box className='p-6 bg-primary text-white'>
              <Typography variant='caption' className='text-white/80 uppercase'>Current Task</Typography>
              <Typography variant='h4' className='text-white font-bold'>Aisle 4 - Shelf B - Slot 12</Typography>
            </Box>
            <CardContent>
              <Stack direction='row' spacing={6} alignItems='center'>
                <Box className='bg-slate-100 p-8 rounded-lg'>
                  <i className='tabler-package text-5xl text-slate-400' />
                </Box>
                <Box className='flex-grow'>
                  <Typography variant='h5' className='font-bold mb-1'>Logitech MX Master 3S</Typography>
                  <Typography variant='body1' color='text.secondary' className='mb-4'>SKU: MOU-LG-1022</Typography>
                  <Chip label='High Accuracy Required' color='warning' variant='tonal' size='small' />
                </Box>
                <Box className='text-center'>
                  <Typography variant='caption' display='block'>Needed</Typography>
                  <Typography variant='h2' className='font-bold'>3</Typography>
                </Box>
              </Stack>
              
              <Divider className='my-6' />
              
              <Box className='flex gap-4'>
                <TextField 
                  fullWidth 
                  placeholder='Scan Serial or SKU...' 
                  autoFocus 
                  slotProps={{ input: { startAdornment: <i className='tabler-qrcode mr-2 text-slate-400' /> } }}
                />
                <Button variant='contained' size='large' onClick={() => setPickedCount(p => Math.min(p + 1, totalItems))}>
                  Manual Confirm
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Picking Queue */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title='Remaining Items' />
            <CardContent>
              <Stack spacing={4}>
                {[
                  { name: 'USB-C Cable', loc: 'A5-S1', qty: 10, status: 'Next' },
                  { name: 'Monitor Stand', loc: 'A8-S2', qty: 1, status: 'Pending' }
                ].map((item, i) => (
                  <Box key={i} className='flex justify-between items-center opacity-70'>
                    <Box>
                      <Typography variant='body2' className='font-medium'>{item.name}</Typography>
                      <Typography variant='caption'>{item.loc}</Typography>
                    </Box>
                    <Box className='text-right'>
                      <Typography variant='body2' className='font-bold'>x{item.qty}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Completion CTA */}
      {pickedCount === totalItems && (
        <Box className='mt-8 flex justify-center'>
          <Button variant='contained' color='success' size='large' sx={{ py: 4, px: 8, fontSize: '1.2rem' }}>
            Finalize Picking & Generate Label
          </Button>
        </Box>
      )}
    </>
  )
}

export default PickingWorkflowView
