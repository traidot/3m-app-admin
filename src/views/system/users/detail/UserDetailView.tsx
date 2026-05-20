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
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import PageHeader from '@/components/layout/shared/PageHeader'

const UserDetailView = ({ id }: { id: string }) => {
  const userData = {
    id: id || '1',
    name: 'Admin User',
    role: 'Administrator',
    email: 'admin@ims.com',
    status: 'Active',
    lastLogin: '2026-04-20 10:30 AM',
    permissions: [
       { module: 'Procurement', access: 'Full Access' },
       { module: 'Logistics', access: 'Full Access' },
       { module: 'Inventory', access: 'Full Access' },
       { module: 'System', access: 'Admin' }
    ]
  }

  return (
    <>
      <PageHeader
        title='User Identity & Security'
        description='Manage account access, role-based permissions, and security logs'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'System Engine' }, { label: 'Users & Roles', href: '/system/users' }, { label: 'Profile' }]}
        actions={
            <Box className='flex gap-2'>
              <Button variant='tonal' color='error'>Revoke Access</Button>
              <Button variant='contained' color='primary' startIcon={<i className='tabler-shield-lock' />}>Edit Permissions</Button>
            </Box>
          }
      />

      <Grid2 container spacing={6} className='mt-6'>
         <Grid2 size={{ xs: 12, md: 4 }}>
            <Card className='shadow-md border-t-4 border-t-primary'>
                <CardContent className='flex flex-col items-center p-8 gap-4'>
                    <Avatar sx={{ width: 100, height: 100, fontSize: '2.5rem', bgcolor: 'primary.light', color: 'primary.main' }}>A</Avatar>
                    <Box className='text-center'>
                        <Typography variant='h5' className='font-bold'>{userData.name}</Typography>
                        <Typography variant='body2' className='text-slate-500'>{userData.email}</Typography>
                    </Box>
                    <Chip label={userData.role} color='error' variant='tonal' className='font-bold' />
                    
                    <Divider className='w-full my-4' />
                    
                    <Stack spacing={4} className='w-full'>
                        <Box className='flex flex-col gap-1'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Account Status</Typography>
                            <Box className='flex items-center justify-between'>
                                <Typography variant='body2' className='font-bold text-success'>{userData.status}</Typography>
                                <Switch defaultChecked size='small' />
                            </Box>
                        </Box>
                        <Box className='flex flex-col gap-1'>
                            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Last Session</Typography>
                            <Typography variant='body2' className='font-bold text-slate-800'>{userData.lastLogin}</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
         </Grid2>

         <Grid2 size={{ xs: 12, md: 8 }}>
            <Card>
                <CardHeader title='Role-Based Access Matrix' subheader='Granular control over specific modules and operations' />
                <CardContent className='p-0'>
                    <table className='w-full'>
                        <thead className='bg-slate-50 border-be'>
                            <tr className='text-left'>
                                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>System Module</th>
                                <th className='p-4 text-[11px] uppercase font-bold text-slate-600'>Effective Permission</th>
                                <th className='p-4 text-center text-[11px] uppercase font-bold text-slate-600'>Override</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.permissions.map((perm, i) => (
                                <tr key={i} className='border-be last:border-0 hover:bg-slate-50'>
                                    <td className='p-4 text-sm font-bold'>{perm.module}</td>
                                    <td className='p-4'><Chip label={perm.access} size='small' variant='tonal' color='primary' className='font-medium' /></td>
                                    <td className='p-4 text-center'><Button size='small' variant='text'>Adjust</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card className='mt-6'>
                <CardHeader title='Security Settings' />
                <CardContent className='flex flex-col gap-4'>
                    <FormControlLabel control={<Switch defaultChecked />} label={<Typography variant='body2' className='font-medium'>Require Multi-Factor Authentication (MFA)</Typography>} />
                    <FormControlLabel control={<Switch defaultChecked />} label={<Typography variant='body2' className='font-medium'>Force Password Rotation every 90 days</Typography>} />
                    <FormControlLabel control={<Switch />} label={<Typography variant='body2' className='font-medium'>Allow API access with bearer tokens</Typography>} />
                </CardContent>
            </Card>
         </Grid2>
      </Grid2>
    </>
  )
}

export default UserDetailView
