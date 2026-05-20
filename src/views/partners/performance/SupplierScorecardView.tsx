import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierScorecardView = () => {
  const suppliers = [
    { name: 'Tech Solutions Inc', category: 'IT Hardware', delivery: 98, quality: 95, cost: 88, overall: 94, trend: 'up' },
    { name: 'Global Office Systems', category: 'Furniture', delivery: 82, quality: 90, cost: 95, overall: 89, trend: 'down' },
    { name: 'Phuc Long Tea & Coffee', category: 'Beverage', delivery: 95, quality: 98, cost: 90, overall: 94, trend: 'stable' },
    { name: 'Lavazza Vietnam', category: 'Beverage', delivery: 75, quality: 99, cost: 70, overall: 81, trend: 'up' }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success'
    if (score >= 80) return 'warning'
    return 'error'
  }

  return (
    <>
      <PageHeader
        title='Strategic Supplier Scorecard'
        description='Performance analytics and risk assessment of the core supply chain network'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Supplier Hub' }, { label: 'Vendor Performance' }]}
      />

      <Grid2 container spacing={6} className='mt-6'>
        <Grid2 size={{ xs: 12 }}>
            <Card>
                <CardHeader 
                    title='Supplier Performance Matrix' 
                    subheader='Bi-weekly updated metrics based on late deliveries, QC rejections, and pricing compliance'
                />
                <CardContent className='p-0'>
                    <TableContainer>
                        <Table>
                            <TableHead className='bg-slate-50 border-be'>
                                <TableRow>
                                    <th className='p-4 text-left text-[11px] uppercase font-bold text-slate-600'>Supplier Entity</th>
                                    <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Delivery OTD</th>
                                    <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Quality Index</th>
                                    <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Cost Stability</th>
                                    <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Overall Grade</th>
                                    <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Trend</th>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {suppliers.map((sup, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell className='p-4'>
                                            <Box className='flex items-center gap-3'>
                                                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold' }}>{sup.name[0]}</Avatar>
                                                <Box>
                                                    <Typography variant='body2' className='font-bold text-slate-800'>{sup.name}</Typography>
                                                    <Typography variant='caption' className='text-slate-500'>{sup.category}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Box className='w-[100px] mx-auto'>
                                                <Typography variant='caption' className='font-bold'>{sup.delivery}%</Typography>
                                                <LinearProgress variant='determinate' value={sup.delivery} color={getScoreColor(sup.delivery)} sx={{ height: 4, borderRadius: 2 }} />
                                            </Box>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Box className='w-[100px] mx-auto'>
                                                <Typography variant='caption' className='font-bold'>{sup.quality}%</Typography>
                                                <LinearProgress variant='determinate' value={sup.quality} color={getScoreColor(sup.quality)} sx={{ height: 4, borderRadius: 2 }} />
                                            </Box>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Box className='w-[100px] mx-auto'>
                                                <Typography variant='caption' className='font-bold'>{sup.cost}%</Typography>
                                                <LinearProgress variant='determinate' value={sup.cost} color={getScoreColor(sup.cost)} sx={{ height: 4, borderRadius: 2 }} />
                                            </Box>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Chip 
                                                label={sup.overall >= 90 ? 'A+' : sup.overall >= 80 ? 'B' : 'C'} 
                                                color={getScoreColor(sup.overall)} 
                                                size='small' 
                                                variant='tonal' 
                                                className='font-black'
                                            />
                                        </TableCell>
                                        <TableCell align='center'>
                                            {sup.trend === 'up' ? (
                                                <i className='tabler-trending-up text-success' />
                                            ) : sup.trend === 'down' ? (
                                                <i className='tabler-trending-down text-error' />
                                            ) : (
                                                <i className='tabler-minus text-slate-400' />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
            <Card className='h-full'>
                <CardHeader title='Supplier Risk Heatmap' subheader='Identification of potential supply chain bottlenecks' />
                <CardContent className='flex flex-col gap-4'>
                    <Box className='p-4 border border-error/20 bg-error/5 rounded flex items-center justify-between'>
                       <Box>
                           <Typography variant='body2' className='font-bold'>Lavazza Vietnam</Typography>
                           <Typography variant='caption'>Geo-political risk & Freight delays</Typography>
                       </Box>
                       <Chip label='Critical Risk' color='error' size='small' className='font-bold' />
                    </Box>
                    <Box className='p-4 border border-warning/20 bg-warning/5 rounded flex items-center justify-between'>
                       <Box>
                           <Typography variant='body2' className='font-bold'>Global Office Systems</Typography>
                           <Typography variant='caption'>Raw material shortages</Typography>
                       </Box>
                       <Chip label='Moderate Risk' color='warning' size='small' className='font-bold' />
                    </Box>
                </CardContent>
            </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
            <Card className='h-full'>
                <CardHeader title='Strategic Recommendations' />
                <CardContent>
                    <ul className='flex flex-col gap-4 list-none p-0 m-0'>
                        <li className='flex gap-3'>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light', fontSize: '0.75rem' }}>1</Avatar>
                            <Typography variant='body2'>Consolidate IT hardware spend with <strong>Tech Solutions Inc</strong> to leverage volume discounts.</Typography>
                        </li>
                        <li className='flex gap-3'>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light', fontSize: '0.75rem' }}>2</Avatar>
                            <Typography variant='body2'>Diversify beverage sourcing to mitigate <strong>Lavazza</strong> delivery volatility.</Typography>
                        </li>
                        <li className='flex gap-3'>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light', fontSize: '0.75rem' }}>3</Avatar>
                            <Typography variant='body2'>Initiate contract renegotiation with <strong>Global Office</strong> due to declining delivery performance.</Typography>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default SupplierScorecardView
