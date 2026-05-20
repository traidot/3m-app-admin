'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierPricingView = () => {
  const priceAgreements = [
    { supplier: 'Tech Solutions Inc', product: 'Dell PowerEdge R750', price: '$8,500', currency: 'USD', validity: '2026-12-31', status: 'Active' },
    { supplier: 'Tech Solutions Inc', product: 'Cisco 9300 Switch', price: '$3,200', currency: 'USD', validity: '2026-12-31', status: 'Active' },
    { supplier: 'Furniture Co', product: 'Executive Office Chair', price: '$400', currency: 'USD', validity: '2026-06-30', status: 'Expiring Soon' },
    { supplier: 'Global Office', product: 'Standard Desk', price: '$250', currency: 'USD', validity: '2026-08-15', status: 'Active' }
  ]

  return (
    <>
      <PageHeader
        title='Contracted Supplier Pricing'
        description='Manage pre-negotiated price lists, currency fluctuations and agreement validity'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Supplier Hub' }, { label: 'Contracted Pricing', href: '/partners/pricing' }]}
        actions={<Button variant='contained' color='primary' startIcon={<i className='tabler-plus' />}>New Price Agreement</Button>}
      />

      <Card className='mt-6 shadow-sm underline-none'>
        <CardContent className='flex flex-wrap gap-6 items-end p-6 bg-slate-50/30'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Filter by Supplier</Typography>
            <TextField 
                select 
                size='small' 
                defaultValue='all'
                sx={{ width: 220 }}
            >
                <MenuItem value='all'>All Strategic Vendors</MenuItem>
                <MenuItem value='tech'>Tech Solutions Inc</MenuItem>
                <MenuItem value='furniture'>Furniture Co</MenuItem>
            </TextField>
          </Box>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Catalog Search</Typography>
            <TextField 
                size='small' 
                placeholder='Search Material SKU...' 
                sx={{ width: 260 }} 
                slotProps={{ input: { startAdornment: <i className='tabler-search text-slate-400 me-2' /> } }}
            />
          </Box>
          <Box className='flex-grow' />
          <Box className='flex gap-2 mb-1'>
            <Chip label='1 Expiring Agreement' color='warning' variant='tonal' className='font-bold' />
          </Box>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-be'>
              <tr className='text-left bg-slate-50'>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Supplier Entity</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Authorized Product</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-right'>Contract Price</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Valid Thru</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-center'>Status</th>
                <th className='p-4 text-[11px] uppercase font-bold text-slate-600 text-right'>Action</th>
              </tr>
            </thead>
            <tbody>
              {priceAgreements.map((row, i) => (
                <tr key={i} className='border-be hover:bg-slate-50/50 transition-colors'>
                  <td className='p-4'>
                    <Box className='flex items-center gap-3'>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 'bold' }}>{row.supplier[0]}</Avatar>
                        <Typography variant='body2' className='font-bold text-slate-800'>{row.supplier}</Typography>
                    </Box>
                  </td>
                  <td className='p-4'>
                    <Typography variant='body2' className='font-medium text-slate-700'>{row.product}</Typography>
                  </td>
                  <td className='p-4 text-right'>
                    <Typography variant='body2' className='font-black text-slate-900'>{row.price} <small className='text-slate-400 font-bold'>{row.currency}</small></Typography>
                  </td>
                  <td className='p-4 text-center'>
                    <Typography variant='body2' className='font-mono font-bold text-slate-600'>{row.validity}</Typography>
                  </td>
                  <td className='p-4 text-center'>
                    <Chip 
                        label={row.status} 
                        size='small' 
                        variant='tonal' 
                        className='font-bold'
                        color={row.status === 'Active' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className='p-4 text-right'>
                    <Button size='small' variant='text' sx={{ minWidth: 0, p: 1 }}><i className='tabler-edit text-slate-400' /></Button>
                    <Button size='small' variant='text' color='error' sx={{ minWidth: 0, p: 1 }}><i className='tabler-trash text-slate-300' /></Button>
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

export default SupplierPricingView
