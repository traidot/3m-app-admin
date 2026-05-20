'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import PageHeader from '@/components/layout/shared/PageHeader'

const TasksView = () => {
  const tasks = [
    { id: 'JOB-4412', type: 'Picking', items: 12, assignee: 'Mike J', status: 'In Progress', priority: 'Urgent' },
    { id: 'JOB-4413', type: 'Packing', items: 5, assignee: 'Unassigned', status: 'Pending', priority: 'High' },
    { id: 'JOB-4414', type: 'Receiving', items: 50, assignee: 'David K', status: 'In Progress', priority: 'Normal' },
    { id: 'JOB-4415', type: 'In-Aisle Audit', items: 100, assignee: 'Sarah L', status: 'Completed', priority: 'Low' }
  ]

  return (
    <>
      <PageHeader
        title='Operational Task Management'
        description='Real-time warehouse assignment control and labor distribution'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Workforce Hub' }, { label: 'Tasks' }]}
        actions={<Button variant='contained' startIcon={<i className='tabler-list-plus' />}>Assign New Job</Button>}
      />

      <Card className='mt-6'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-50 border-be'>
              <tr className='text-left'>
                <th className='p-4 text-xs uppercase'>Job ID</th>
                <th className='p-4 text-xs uppercase'>Type</th>
                <th className='p-4 text-xs uppercase'>Assignee</th>
                <th className='p-4 text-xs uppercase'>Priority</th>
                <th className='p-4 text-xs uppercase'>Status</th>
                <th className='p-4 text-xs uppercase'>Control</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className='border-be hover:bg-slate-50'>
                  <td className='p-4 text-sm font-bold'>{task.id}</td>
                  <td className='p-4 text-sm'>
                   <Box className='flex flex-col'>
                    <Typography variant='body2' className='font-medium'>{task.type}</Typography>
                    <Typography variant='caption'>{task.items} items</Typography>
                   </Box>
                  </td>
                  <td className='p-4'>
                    <Box className='flex items-center gap-2'>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>{task.assignee.charAt(0)}</Avatar>
                      <Typography variant='body2' color={task.assignee === 'Unassigned' ? 'error' : 'text.primary'}>
                        {task.assignee}
                      </Typography>
                    </Box>
                  </td>
                  <td className='p-4'>
                    <Chip 
                      label={task.priority} 
                      size='small' 
                      variant='outlined' 
                      color={task.priority === 'Urgent' ? 'error' : task.priority === 'High' ? 'warning' : 'primary'} 
                    />
                  </td>
                  <td className='p-4'>
                    <Chip 
                      label={task.status} 
                      size='small' 
                      color={task.status === 'Completed' ? 'success' : task.status === 'Pending' ? 'secondary' : 'info'} 
                    />
                  </td>
                  <td className='p-4'>
                    <Button variant='tonal' size='small'>Reassign</Button>
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

export default TasksView
