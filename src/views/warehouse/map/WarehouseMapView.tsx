'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import PageHeader from '@/components/layout/shared/PageHeader'

const WarehouseMapView = () => {
  // Simulate a warehouse grid (Rows x Columns)
  const rows = ['Row 1', 'Row 2', 'Row 3', 'Row 4', 'Row 5']
  const aisles = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <>
      <PageHeader
        title='Visual Warehouse Topology'
        description='Interactive floor plan with real-time zone occupancy and bin level heatmaps'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Warehouse', href: '/warehouse/zones' }, { label: 'Topology Map' }]}
        actions={
          <Stack direction='row' spacing={2}>
             <Button variant='tonal' startIcon={<i className='tabler-filter' />}>Filter by Category</Button>
             <Button variant='contained' startIcon={<i className='tabler-maximize' />}>Fullscreen</Button>
          </Stack>
        }
      />

      <Card className='mt-6 mb-6 overflow-hidden'>
        <Box className='p-4 border-be flex justify-between items-center bg-slate-50'>
          <Typography variant='subtitle2' className='font-bold uppercase tracking-wider'>Main Distribution Center - Floor Plan</Typography>
          <Stack direction='row' spacing={4}>
            <Box className='flex items-center gap-1'><Box className='w-3 h-3 bg-success rounded' /> <Typography variant='caption'>Available</Typography></Box>
            <Box className='flex items-center gap-1'><Box className='w-3 h-3 bg-warning rounded' /> <Typography variant='caption'>Partial</Typography></Box>
            <Box className='flex items-center gap-1'><Box className='w-3 h-3 bg-error rounded' /> <Typography variant='caption'>Full Capacity</Typography></Box>
            <Box className='flex items-center gap-1'><Box className='w-3 h-3 bg-slate-300 rounded' /> <Typography variant='caption'>Reserved</Typography></Box>
          </Stack>
        </Box>
        <CardContent className='overflow-x-auto bg-slate-100 p-8'>
           <Box className='flex flex-col gap-8 min-w-[800px]'>
             {rows.map((rowName, rIndex) => (
               <Box key={rowName} className='flex gap-4 items-center'>
                 <Typography variant='caption' className='w-[60px] font-bold text-slate-400'>{rowName}</Typography>
                 <Box className='flex-grow flex gap-2'>
                   {aisles.map((aisle, aIndex) => {
                     // Random occupancy for demo
                     const occupancy = Math.random()
                     const color = occupancy > 0.8 ? 'error' : occupancy > 0.4 ? 'warning' : 'success'
                     
                     return (
                       <Tooltip title={`Bay ${aisle}-${rIndex + 1} | Occupancy: ${Math.round(occupancy * 100)}%`} key={aisle}>
                         <Box 
                           sx={{ 
                             width: 100, 
                             height: 60, 
                             bgcolor: `${color}.main`, 
                             borderRadius: 1,
                             cursor: 'pointer',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             transition: 'all 0.2s',
                             '&:hover': { transform: 'scale(1.05)', boxShadow: 4, zIndex: 10 },
                             boxShadow: 1
                           }}
                         >
                           <Typography variant='caption' className='text-white font-bold'>{aisle}{rIndex + 1}</Typography>
                         </Box>
                       </Tooltip>
                     )
                   })}
                 </Box>
               </Box>
             ))}
           </Box>
           
           {/* Obstacles / Loading Docks */}
           <Box className='mt-12 flex justify-between'>
             <Box className='w-[300px] h-[40px] border-2 border-dashed border-slate-400 rounded flex items-center justify-center'>
               <Typography variant='caption' className='text-slate-400 font-bold uppercase tracking-widest'>Main Loading Dock - North</Typography>
             </Box>
             <Box className='w-[300px] h-[40px] border-2 border-dashed border-slate-400 rounded flex items-center justify-center'>
               <Typography variant='caption' className='text-slate-400 font-bold uppercase tracking-widest'>Pallet Staging Area</Typography>
             </Box>
           </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default WarehouseMapView
