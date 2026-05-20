// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Type Imports
import type { CardStatsHorizontalWithAvatarProps } from '@/types/pages/widgetTypes'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

const HorizontalWithAvatar = (props: CardStatsHorizontalWithAvatarProps) => {
  // Props
  const { stats, title, avatarIcon, avatarColor, avatarVariant, avatarSkin, avatarSize } = props

  // Convert avatarSize to number if it's a string
  const size = typeof avatarSize === 'string' ? parseInt(avatarSize, 10) : avatarSize

  return (
    <Card>
      <CardContent className='flex items-center justify-between gap-2'>
        <div className='flex flex-col items-start gap-1'>
          <Typography variant='h5'>{stats}</Typography>
          <Typography variant='body2'>{title}</Typography>
        </div>
        <CustomAvatar variant={avatarVariant} skin={avatarSkin} color={avatarColor} size={size}>
          <i className={avatarIcon} />
        </CustomAvatar>
      </CardContent>
    </Card>
  )
}

export default HorizontalWithAvatar
