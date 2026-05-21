'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

type Props = {
  title: string
  description?: string
  group?: string
}

const AdminPlaceholder = ({ title, description, group }: Props) => {
  return (
    <Box>
      <Card>
        <CardContent className='flex flex-col gap-3 items-start'>
          {group && <Chip size='small' label={group} color='primary' variant='tonal' />}
          <Typography variant='h4'>{title}</Typography>
          {description && (
            <Typography variant='body1' color='text.secondary'>
              {description}
            </Typography>
          )}
          <Typography variant='caption' color='text.disabled'>
            Màn hình UI demo — chưa wire dữ liệu.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminPlaceholder
