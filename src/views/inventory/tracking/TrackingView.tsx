'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import PageHeader from '@/components/layout/shared/PageHeader'

const TrackingView = () => {
  const assets = [
    { sn: 'SN-ARA-10042', item: 'LED Monitor 24"', batch: 'BCH-2026-04', location: 'Zone A-12', status: 'In Stock' },
    { sn: 'SN-ARA-10043', item: 'LED Monitor 24"', batch: 'BCH-2026-04', location: 'Zone A-12', status: 'Reserved' },
    { sn: 'SN-ARA-10099', item: 'High-back Ergonomic Chair', batch: 'BCH-2026-05', location: 'Section B-1', status: 'In Stock' },
    { sn: 'SN-ARA-20055', item: 'Server Rack 42U', batch: 'BCH-2026-01', location: 'Cold Zone-QC', status: 'Under Inspection' }
  ]

  return (
    <>
      <PageHeader
        title='Serial & Batch Tracking'
        description='Identify and track individual high-value items or sensitive batches'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Inventory' }, { label: 'Tracking' }]}
      />

      <Card className='mt-6 mb-6 shadow-md'>
        <CardContent className='flex flex-col gap-1.5'>
          <Typography variant='caption' className='uppercase font-bold text-slate-500'>Rapid Lookup</Typography>
          <Box className='flex items-center gap-4'>
            <TextField 
              size='small' 
              placeholder='Scan Serial Number / Batch ID...' 
              fullWidth 
              InputProps={{ 
                startAdornment: <i className='tabler-scan mr-2 text-xl text-slate-400' />,
                className: 'bg-slate-50'
              }}
            />
            <Button variant='contained' startIcon={<i className='tabler-search' />} sx={{ height: 40 }}>Lookup</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <Box className='p-6 border-be flex items-center justify-between'>
           <Typography variant='h6' className='font-bold text-slate-800'>Granular Stock Registry</Typography>
           <Chip label='Displaying 4 active units' color='primary' variant='tonal' size='small' className='font-bold' />
        </Box>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50 border-be'>
              <tr className='text-left text-slate-600'>
                <th className='p-4 text-[11px] uppercase font-bold'>Serial / Batch</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Product Mapping</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Geographic Location</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Status</th>
                <th className='p-4 text-[11px] uppercase font-bold'>Audit</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => (
                <tr key={i} className='border-be hover:bg-slate-50 transition-colors'>
                  <td className='p-4'>
                    <Typography variant='body2' className='font-black font-mono text-primary'>{asset.sn}</Typography>
                    <Typography variant='caption' className='text-slate-500 font-medium tracking-tighter'>{asset.batch}</Typography>
                  </td>
                  <td className='p-4'>
                     <Typography variant='body2' className='font-bold text-slate-800'>{asset.item}</Typography>
                  </td>
                  <td className='p-4'>
                     <Box className='flex items-center gap-2'>
                        <i className='tabler-map-pin text-slate-400' />
                        <Typography variant='body2' className='font-medium'>{asset.location}</Typography>
                     </Box>
                  </td>
                  <td className='p-4'>
                    <Chip 
                      label={asset.status} 
                      size='small' 
                      variant='tonal' 
                      className='font-bold'
                      color={asset.status === 'In Stock' ? 'success' : asset.status === 'Reserved' ? 'warning' : 'info'} 
                    />
                  </td>
                  <td className='p-4'>
                    <Button 
                      size='small' 
                      variant='tonal' 
                      color='secondary'
                      startIcon={<i className='tabler-history' />}
                      className='font-medium'
                    >
                      History
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default TrackingView
