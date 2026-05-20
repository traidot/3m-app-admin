'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'

import PageHeader from '@/components/layout/shared/PageHeader'

const StocktakingDetailView = ({ id }: { id: string }) => {
  return (
    <>
      <PageHeader
        title={`Audit Session: ${id}`}
        description='Detailed reconciliation report and physical inventory counting results'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Inventory', href: '/inventory/stocktaking' },
          { label: 'Audit Detail' }
        ]}
        actions={
          <Button variant='contained' color='success' startIcon={<i className='tabler-check' />}>
            Finalize Reconciliation
          </Button>
        }
      />

      <Alert severity='warning' className='mt-6 mb-6'>
        Discrepancies found in 3 line items. Please investigate before finalizing.
      </Alert>

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-l-4 border-l-warning shadow-sm'>
            <CardContent className='p-6'>
              <Typography variant='subtitle2' className='uppercase font-bold text-slate-400 mb-6'>Audit Context</Typography>
              <Stack spacing={5}>
                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Lead Auditor</Typography>
                  <Box className='flex items-center gap-2'>
                     <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>AD</Avatar>
                     <Typography variant='body2' className='font-bold text-slate-800'>Administrator (System)</Typography>
                  </Box>
                </Box>
                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Counting Method</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>Blind Blind / QR Scan</Typography>
                </Box>
                <Divider />
                <Box className='flex flex-col gap-1'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Reconciliation Variance</Typography>
                  <Typography variant='h6' color='error' className='font-black font-mono tracking-tighter'>-$145.20</Typography>
                  <Typography variant='caption' className='text-slate-400 font-medium italic'>Net inventory shrinkage detected</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant='h6' className='mb-4'>Reconciliation Table</Typography>
              <table className='w-full'>
                <thead className='bg-slate-50 border-be'>
                  <tr className='text-left'>
                    <th className='p-3 text-xs uppercase'>Product</th>
                    <th className='p-3 text-xs uppercase'>System</th>
                    <th className='p-3 text-xs uppercase'>Physical</th>
                    <th className='p-3 text-xs uppercase'>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Wireless Mouse M1', sys: 125, phys: 122, diff: -3 },
                    { name: 'Mechanical Keyboard K3', sys: 40, phys: 41, diff: 1 },
                    { name: 'Ergonomic Chair', sys: 15, phys: 15, diff: 0 }
                  ].map((item, i) => (
                    <tr key={i} className='border-be'>
                      <td className='p-3'><Typography variant='body2' className='font-medium'>{item.name}</Typography></td>
                      <td className='p-3 text-sm'>{item.sys}</td>
                      <td className='p-3 text-sm'>{item.phys}</td>
                      <td className='p-3'>
                        <Chip 
                          label={item.diff} 
                          size='small' 
                          color={item.diff === 0 ? 'success' : 'error'} 
                          variant={item.diff === 0 ? 'tonal' : 'filled'} 
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

export default StocktakingDetailView
