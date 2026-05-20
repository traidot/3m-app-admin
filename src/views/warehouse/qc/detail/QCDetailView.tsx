'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'

import PageHeader from '@/components/layout/shared/PageHeader'

const QCDetailView = ({ id }: { id: string }) => {
  const qcData = {
    id: id || 'QA-5502',
    grRef: 'GR-2026-002',
    material: 'Executive Office Chair (Walnut)',
    vendor: 'Furniture Co',
    inspector: 'Sarah Miller',
    date: '2026-04-19',
    result: 'Fail',
    score: 2,
    defects: [
       { category: 'Structural', desc: 'Frame is cracked in 3 units', severity: 'Critical' },
       { category: 'Aesthetic', desc: 'Fabric staining found on 2 units', severity: 'Major' }
    ],
    checks: [
       { task: 'Weight Stress Test', status: 'Failed' },
       { task: 'Fabric Durability', status: 'Passed' },
       { task: 'Dimension Verification', status: 'Passed' }
    ]
  }

  return (
    <>
      <PageHeader
        title={`Inspection Report: ${qcData.id}`}
        description={`Quality audit for ${qcData.material}`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Logistics & Inbound' }, { label: 'Quality Inspection', href: '/warehouse/qc' }, { label: 'Audit Detail' }]}
        actions={
            <Box className='flex gap-2'>
              <Button variant='outlined' color='secondary' startIcon={<i className='tabler-file-download' />}>Export Audit</Button>
              <Button variant='contained' color='error' startIcon={<i className='tabler-truck-return' />}>Escalate to Return (RTV)</Button>
            </Box>
          }
      />

      <Grid2 container spacing={6} className='mt-6'>
         {/* Summary & Score */}
         <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='h-full border-t-4 border-t-error shadow-sm'>
                <CardContent className='flex flex-col items-center p-10 gap-6'>
                    <Typography variant='caption' className='font-black uppercase tracking-widest text-slate-400'>Inspection Integrity Index</Typography>
                    <Box className='relative flex items-center justify-center'>
                         <Box sx={{ width: 150, height: 150, borderRadius: '50%', border: '10px solid', borderColor: 'error.lighter', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant='h1' className='font-black text-error' sx={{ letterSpacing: -2 }}>{qcData.score}<small className='text-lg text-slate-300 font-bold'>/5</small></Typography>
                         </Box>
                    </Box>
                    <Chip label="CRITICAL FAILURE" color='error' variant='tonal' className='font-black tracking-wide' sx={{ height: 32 }} />
                    
                    <Divider className='w-full' />
                    
                    <Stack spacing={5} className='w-full'>
                        <Box className='flex flex-col gap-1.5'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Authorized Inspector</Typography>
                            <Box className='flex items-center gap-3'>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.light', color: 'secondary.main', fontWeight: 'bold', fontSize: '0.8rem' }}>SM</Avatar>
                                <Typography variant='body1' className='font-bold text-slate-800'>{qcData.inspector}</Typography>
                            </Box>
                        </Box>
                        <Box className='flex flex-col gap-1.5'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>GRN Source Link</Typography>
                            <Box className='flex items-center gap-2 text-primary'>
                                <i className='tabler-link' />
                                <Typography variant='body1' className='font-bold font-mono underline cursor-pointer'>{qcData.grRef}</Typography>
                            </Box>
                        </Box>
                        <Box className='flex flex-col gap-1.5'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Validation Date</Typography>
                            <Typography variant='body1' className='font-bold text-slate-800 tracking-tight'>{qcData.date}</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
         </Grid2>

         {/* Detailed Checks */}
         <Grid2 size={{ xs: 12, md: 8 }}>
            <Card className='mb-6'>
               <CardHeader title='Audit Checklist Status' />
               <CardContent className='flex flex-col gap-4'>
                  {qcData.checks.map((check, i) => (
                     <Box key={i} className='flex items-center justify-between p-4 border rounded'>
                        <Typography variant='body2' className='font-bold'>{check.task}</Typography>
                        <Chip 
                           label={check.status} 
                           size='small' 
                           variant='tonal' 
                           color={check.status === 'Passed' ? 'success' : 'error'} 
                           icon={<i className={check.status === 'Passed' ? 'tabler-check' : 'tabler-x'} />}
                        />
                     </Box>
                  ))}
               </CardContent>
            </Card>

            <Card>
               <CardHeader title='Recorded Non-Conformities (NC)' />
               <CardContent className='p-0'>
                  <table className='w-full'>
                     <thead className='bg-slate-50 border-be'>
                        <tr className='text-left'>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Category</th>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Deviation Details</th>
                           <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Severity</th>
                        </tr>
                     </thead>
                     <tbody>
                        {qcData.defects.map((defect, i) => (
                           <tr key={i} className='border-be last:border-0 hover:bg-slate-50'>
                              <td className='p-4 text-sm font-bold'>{defect.category}</td>
                              <td className='p-4 text-sm text-slate-600'>{defect.desc}</td>
                              <td className='p-4'><Chip label={defect.severity} size='small' variant='tonal' color={defect.severity === 'Critical' ? 'error' : 'warning'} className='font-bold' /></td>
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

export default QCDetailView
