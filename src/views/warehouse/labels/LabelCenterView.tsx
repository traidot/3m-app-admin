'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

import PageHeader from '@/components/layout/shared/PageHeader'

const LabelCenterView = () => {
  return (
    <>
      <PageHeader
        title='Label Hub'
        description='Generate and print industry-standard barcodes, QR codes, and DHL/LogiCore shipping labels'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Warehouse' }, { label: 'Label Center' }]}
      />

      <Grid2 container spacing={6} className='mt-6'>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title='Print Configuration' />
            <CardContent>
              <Box className='flex flex-col gap-5'>
                <Box className='flex flex-col gap-1.5'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Label Type</Typography>
                  <TextField select fullWidth size='small' defaultValue='Item'>
                    <MenuItem value='Item'>Item ID Barcode</MenuItem>
                    <MenuItem value='Location'>Location QR Code</MenuItem>
                    <MenuItem value='Shipping'>Shipping Manifest</MenuItem>
                  </TextField>
                </Box>
                <Box className='flex flex-col gap-1.5'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Template</Typography>
                  <TextField select fullWidth size='small' defaultValue='Standard'>
                    <MenuItem value='Standard'>4x6 Standard (Zebra)</MenuItem>
                    <MenuItem value='Small'>2x1 Product Label</MenuItem>
                    <MenuItem value='Detailed'>Extended Asset Tag</MenuItem>
                  </TextField>
                </Box>
                <Box className='flex flex-col gap-1.5'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Print Quantity</Typography>
                  <TextField type='number' fullWidth size='small' defaultValue={50} />
                </Box>
                <Button variant='contained' fullWidth startIcon={<i className='tabler-printer' />} className='mt-2'>
                  Generate & Send to Printer
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title='Label Preview' subheader='Visual verification before physical print' />
            <CardContent>
              <Box className='h-[300px] border rounded flex flex-col items-center justify-center p-6 bg-slate-50'>
                <Box className='p-6 bg-white border-2 border-black rounded shadow-lg text-center'>
                  <Typography variant='h5' className='font-bold mb-2'>ITEM-ARA-1002</Typography>
                  <Box className='h-[80px] w-[200px] bg-black mb-2 flex items-center justify-center'>
                    <Typography variant='caption' color='white'>[Simulated Barcode]</Typography>
                  </Box>
                  <Typography variant='body2'>Wireless Mouse M1 - Black</Typography>
                  <Typography variant='caption' color='text.secondary'>LogiCore IMS Unified Label System</Typography>
                </Box>
                <Typography variant='caption' className='mt-4' color='text.secondary'>
                  Printer status: <strong className='text-success'>Online (Warehouse-Main-Zebra)</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default LabelCenterView
