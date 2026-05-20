'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Avatar from '@mui/material/Avatar'

import PageHeader from '@/components/layout/shared/PageHeader'

const OutboundDetailView = ({ id }: { id: string }) => {
  const steps = ['Order Placed', 'Picking', 'Packing', 'Shipped']

  return (
    <>
      <PageHeader
        title={`Outbound Order: ${id}`}
        description='Customer shipment preparation and fulfillment tracking'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Operations', href: '/operations/outbound' },
          { label: 'Outbound Detail' }
        ]}
        actions={
          <Button variant='contained' color='primary' startIcon={<i className='tabler-package-export' />}>
            Generate Packing List
          </Button>
        }
      />

      <Card className='mt-6 mb-6 p-8 shadow-sm border-t-2 border-t-primary'>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel 
                StepIconProps={{ sx: { '&.Mui-active': { color: 'primary.main' }, '&.Mui-completed': { color: 'success.main' } } }}
              >
                <Typography variant='caption' className='font-bold uppercase tracking-wider'>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      <Grid2 container spacing={6}>
        {/* Customer Info */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='shadow-sm'>
            <CardContent className='p-6'>
              <Typography variant='subtitle2' className='uppercase font-bold text-slate-400 mb-6'>Ship-to Party</Typography>
              <Stack spacing={5}>
                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Recipient Entity</Typography>
                  <Box className='flex items-center gap-2'>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.main', fontSize: '0.9rem', fontWeight: 'bold' }}>RH</Avatar>
                    <Typography variant='body1' className='font-bold text-slate-800'>Retail Hub Inc.</Typography>
                  </Box>
                </Box>
                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Full Logistics Address</Typography>
                  <Box className='flex gap-2 items-start'>
                    <i className='tabler-map-pin text-slate-400 mt-1' />
                    <Typography variant='body2' className='font-medium text-slate-600 leading-relaxed'>456 Commercial Rd, West District, City 1002, Building B, Floor 2</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Customer Requested Date</Typography>
                  <Box className='flex items-center gap-2 text-primary'>
                    <i className='tabler-calendar-event' />
                    <Typography variant='body1' className='font-black font-mono'>2026-04-16</Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Picking List */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant='h6' className='mb-4'>Picking Progress</Typography>
              <table className='w-full'>
                <thead>
                  <tr className='text-left border-be bg-slate-50'>
                    <th className='p-3 text-xs uppercase'>Item</th>
                    <th className='p-3 text-xs uppercase'>Location</th>
                    <th className='p-3 text-xs uppercase'>Needed</th>
                    <th className='p-3 text-xs uppercase'>Picked</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Wireless Mouse M1', loc: 'Aisle 1-B-4', needed: 10, picked: 10 },
                    { name: 'Office Chair Ergonomic', loc: 'Aisle 4-A-1', needed: 2, picked: 0 }
                  ].map((item, i) => (
                    <tr key={i} className='border-be'>
                      <td className='p-3'><Typography variant='body2' className='font-medium'>{item.name}</Typography></td>
                      <td className='p-3 text-sm'>{item.loc}</td>
                      <td className='p-3 text-sm'>{item.needed}</td>
                      <td className='p-3'>
                        <Chip 
                          label={item.picked === item.needed ? 'Complete' : 'Pending'} 
                          color={item.picked === item.needed ? 'success' : 'warning'} 
                          variant='tonal' 
                          size='small' 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default OutboundDetailView
