'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

import PageHeader from '@/components/layout/shared/PageHeader'

const MaterialDetailView = ({ id }: { id: string }) => {
  const [tabValue, setTabValue] = useState('overview')

  return (
    <>
      <PageHeader
        title={`Material Hub: ${id}`}
        description='Comprehensive profile containing technical specs, logistics data, and supply chain history.'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Master Data & Assets', href: '/inventory/materials' },
          { label: 'Material Record' }
        ]}
        actions={
          <Button variant='contained' color='primary' startIcon={<i className='tabler-edit' />}>
            Edit Specifications
          </Button>
        }
      />

      <Grid2 container spacing={6} className='mt-6'>
        {/* Sidebar Info */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-t-4 border-t-primary shadow-sm'>
            <CardContent className='flex flex-col items-center p-8'>
              <Avatar variant='rounded' sx={{ width: 100, height: 100, mb: 4, bgcolor: 'primary.light', border: '2px solid', borderColor: 'primary.main' }}>
                <i className='tabler-package text-5xl text-primary' />
              </Avatar>
              <Typography variant='h5' className='mb-1 font-bold text-slate-800 text-center'>Wireless Mouse M1</Typography>
              <Typography variant='body2' className='text-slate-500 mb-4 font-medium'>LogiTech Precision Series</Typography>
              <Chip label='In Stock' color='success' variant='tonal' size='small' className='mb-6 font-bold' />
              
              <Divider className='w-full mb-6' />
              
              <Box className='w-full'>
                <Stack spacing={4}>
                    <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Material SKU</Typography>
                        <Typography variant='body1' className='font-bold text-slate-900'>ELC-WM1-BLK</Typography>
                    </Box>
                    <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Global Category</Typography>
                        <Box className='flex items-center gap-2'>
                            <i className='tabler-folder text-primary' />
                            <Typography variant='body2' className='font-bold text-slate-800'>Electronics / Input Devices</Typography>
                        </Box>
                    </Box>
                    <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Barcode / GTIN</Typography>
                        <Typography variant='body2' className='font-mono font-bold text-slate-700'>8934563000011</Typography>
                    </Box>
                </Stack>
              </Box>
            </CardContent>
            <Divider />
            <CardContent className='bg-slate-50/50'>
              <Typography variant='caption' className='uppercase font-bold text-slate-400 mb-4 block'>Inventory Intelligence</Typography>
              <Grid2 container spacing={4}>
                <Grid2 size={{ xs: 6 }}>
                    <Box className='flex flex-col gap-0.5'>
                        <Typography variant='caption' className='font-bold text-slate-500'>On Hand</Typography>
                        <Typography variant='h6' color='primary' className='font-black font-mono tracking-tight'>125 <small className='text-xs'>PCS</small></Typography>
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <Box className='flex flex-col gap-0.5'>
                        <Typography variant='caption' className='font-bold text-slate-500'>Allocated</Typography>
                        <Typography variant='h6' color='warning.main' className='font-black font-mono tracking-tight'>12 <small className='text-xs'>PCS</small></Typography>
                    </Box>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        {/* Dynamic Content Tabs */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <TabContext value={tabValue}>
            <Card className='shadow-sm'>
              <TabList onChange={(e, v) => setTabValue(v)} className='border-be px-6 pt-2' sx={{ minHeight: 48 }}>
                <Tab label='Technical Specs' value='overview' className='font-bold' />
                <Tab label='Sourcing History' value='history' className='font-bold' />
                <Tab label='Storage Config' value='levels' className='font-bold' />
              </TabList>
              <CardContent className='p-8'>
                <TabPanel value='overview' className='p-0'>
                  <Typography variant='subtitle1' className='mb-4 font-bold text-slate-800'>Physical & Technical Characteristics</Typography>
                  <Typography variant='body2' className='mb-8 text-slate-600 leading-loose'>
                    Premium ergonomic wireless mouse with silent clicks and high precision optical sensor (up to 4000 DPI). 
                    Features multi-device pairing via Bluetooth or USB LogiBolt. Rated for 10 million clicks lifespan. 
                    Sustainable plastic components (40% recycled).
                  </Typography>

                  <Grid2 container spacing={8}>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Storage Instruction</Typography>
                        <Typography variant='body2' className='font-bold text-slate-800'>Aisle 1, Shelf B, Bin 402 (Climate Controlled)</Typography>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Procurement UoM</Typography>
                        <Typography variant='body2' className='font-bold text-slate-800'>Standard Box (10 pcs/unit)</Typography>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Inventory Alert Level</Typography>
                        <Chip label='Low Stock at 15 PCS' size='small' color='error' variant='tonal' className='font-bold w-fit' />
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Box className='flex flex-col gap-1.5'>
                        <Typography variant='caption' className='uppercase font-bold text-slate-500'>Valuation (Moving Avg)</Typography>
                        <Typography variant='body1' className='font-black text-slate-900'>$12.50 <small className='text-[10px] text-slate-400 font-medium'>USD</small></Typography>
                      </Box>
                    </Grid2>
                  </Grid2>
                </TabPanel>

                <TabPanel value='history' className='p-0'>
                  <table className='w-full'>
                    <thead>
                      <tr className='text-left border-be'>
                        <th className='p-4 text-xs uppercase font-bold text-slate-500'>Date</th>
                        <th className='p-4 text-xs uppercase font-bold text-slate-500'>Type</th>
                        <th className='p-4 text-xs uppercase font-bold text-slate-500'>Qty</th>
                        <th className='p-4 text-xs uppercase font-bold text-slate-500'>Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '2026-04-15', type: 'Goods Receipt', qty: '+50', ref: 'GR-2026-001' },
                        { date: '2026-04-12', type: 'Purchase Return', qty: '-5', ref: 'RTV-2026-022' },
                        { date: '2026-04-10', type: 'Internal Use', qty: '-10', ref: 'TRF-004' }
                      ].map((log, i) => (
                        <tr key={i} className='border-be hover:bg-slate-50'>
                          <td className='p-4 text-sm'>{log.date}</td>
                          <td className='p-4'><Chip label={log.type} size='small' variant='tonal' color={log.type === 'Goods Receipt' ? 'success' : 'primary'} /></td>
                          <td className='p-4 text-sm font-bold text-slate-900'>{log.qty}</td>
                          <td className='p-4 text-sm text-primary font-medium'>{log.ref}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TabPanel>

                <TabPanel value='levels' className='p-0'>
                   <Box className='p-4 border rounded bg-slate-50'>
                     <Typography variant='body2' className='text-slate-600 italic font-medium'>No secondary storage locations defined for this material.</Typography>
                   </Box>
                </TabPanel>
              </CardContent>
            </Card>
          </TabContext>
        </Grid2>
      </Grid2>
    </>
  )
}

export default MaterialDetailView
