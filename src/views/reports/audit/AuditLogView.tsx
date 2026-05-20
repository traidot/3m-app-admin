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

import PageHeader from '@/components/layout/shared/PageHeader'

const AuditLogView = () => {
  const logs = [
    { id: 1, time: '2026-04-16 14:22:15', user: 'admin_david', action: 'Create Purchase Order PO-001', module: 'Procurement', ip: '192.168.1.45', status: 'Success' },
    { id: 2, time: '2026-04-16 13:05:10', user: 'mgr_sarah', action: 'Delete Inventory Item #1002', module: 'Inventory', ip: '192.168.1.12', status: 'Success' },
    { id: 3, time: '2026-04-16 11:45:00', user: 'staff_mike', action: 'Change System Settings', module: 'System', ip: '10.0.0.5', status: 'Failure' },
    { id: 4, time: '2026-04-16 09:12:33', user: 'System', action: 'Automatic Stock Synchronization', module: 'Database', ip: 'Localhost', status: 'Success' }
  ]

  return (
    <>
      <PageHeader
        title='System Audit Logs'
        description='Traceable history of all administrative and operational actions for security compliance'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Procurement Reports', href: '/reports' }, { label: 'Audit Trail' }]}
        actions={<Button variant='outlined' startIcon={<i className='tabler-download' />}>Export Full Log</Button>}
      />

      <Card className='mt-6'>
        <CardContent className='flex flex-wrap gap-6 items-end p-6'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Global Search</Typography>
            <TextField size='small' placeholder='Search logs...' sx={{ width: 250 }} />
          </Box>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Module</Typography>
            <TextField select size='small' defaultValue='All' sx={{ width: 150 }}>
              <MenuItem value='All'>All Modules</MenuItem>
              <MenuItem value='Inventory'>Inventory</MenuItem>
              <MenuItem value='System'>System</MenuItem>
              <MenuItem value='Procurement'>Procurement</MenuItem>
            </TextField>
          </Box>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Status</Typography>
            <TextField select size='small' defaultValue='All' sx={{ width: 120 }}>
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='Success'>Success</MenuItem>
              <MenuItem value='Failure'>Failure</MenuItem>
            </TextField>
          </Box>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50 border-be'>
              <tr className='text-left'>
                <th className='p-4 text-xs uppercase'>Timestamp</th>
                <th className='p-4 text-xs uppercase'>User</th>
                <th className='p-4 text-xs uppercase'>Action</th>
                <th className='p-4 text-xs uppercase'>Module</th>
                <th className='p-4 text-xs uppercase'>IP Address</th>
                <th className='p-4 text-xs uppercase'>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className='border-be hover:bg-slate-50'>
                  <td className='p-4 text-sm text-slate-500'>{log.time}</td>
                  <td className='p-4 text-sm font-bold'>{log.user}</td>
                  <td className='p-4 text-sm'>{log.action}</td>
                  <td className='p-4'><Chip label={log.module} size='small' variant='tonal' color='secondary' /></td>
                  <td className='p-4 text-xs font-mono text-slate-400'>{log.ip}</td>
                  <td className='p-4'>
                    <Chip 
                      label={log.status} 
                      size='small' 
                      color={log.status === 'Success' ? 'success' : 'error'} 
                      variant='outlined' 
                    />
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

export default AuditLogView
