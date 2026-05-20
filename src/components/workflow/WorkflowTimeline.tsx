'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'

interface TimelineStep {
  title: string
  subtitle: string
  time: string
  status: 'completed' | 'current' | 'pending' | 'rejected'
  actor?: string
}

interface WorkflowTimelineProps {
  steps: TimelineStep[]
}

const WorkflowTimeline = ({ steps }: WorkflowTimelineProps) => {
  return (
    <Box className='flex flex-col gap-0'>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        let dotColor = 'grey.300'
        let textColor = 'text.secondary'
        let icon = 'tabler-circle'

        if (step.status === 'completed') {
          dotColor = 'success.main'
          textColor = 'text.primary'
          icon = 'tabler-check'
        } else if (step.status === 'current') {
          dotColor = 'primary.main'
          textColor = 'primary.main'
          icon = 'tabler-rotate-clockwise'
        } else if (step.status === 'rejected') {
          dotColor = 'error.main'
          textColor = 'error.main'
          icon = 'tabler-x'
        }

        return (
          <Box key={index} className='flex gap-4'>
            <Box className='flex flex-col items-center'>
              <Avatar 
                sx={{ 
                  width: 28, 
                  height: 28, 
                  bgcolor: step.status === 'pending' ? 'transparent' : dotColor, 
                  border: step.status === 'pending' ? '2px solid' : 'none',
                  borderColor: 'divider',
                  color: step.status === 'pending' ? 'text.disabled' : 'white',
                  fontSize: '1rem'
                }}
              >
                <i className={icon} />
              </Avatar>
              {!isLast && (
                <Box sx={{ width: 2, flexGrow: 1, bgcolor: step.status === 'completed' ? 'success.light' : 'divider', my: 1 }} />
              )}
            </Box>
            <Box className='pb-8'>
              <Box className='flex items-center gap-2'>
                <Typography variant='body2' className='font-bold' sx={{ color: textColor }}>{step.title}</Typography>
                <Typography variant='caption' className='text-slate-400 font-mono'>{step.time}</Typography>
              </Box>
              <Typography variant='caption' className='block mt-0.5'>{step.subtitle}</Typography>
              {step.actor && (
                <Box className='flex items-center gap-1.5 mt-2'>
                   <Avatar sx={{ width: 18, height: 18, fontSize: '0.6rem' }}>{step.actor[0]}</Avatar>
                   <Typography variant='caption' className='font-medium text-slate-600'>{step.actor}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default WorkflowTimeline
