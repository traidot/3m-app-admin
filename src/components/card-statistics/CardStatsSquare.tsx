// MUI imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Types Imports
import type { CardStatsSquareProps } from '@/types/pages/widgetTypes'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const CardStatsSquare = (props: CardStatsSquareProps) => {
  // Props
  const { avatarColor, avatarIcon, stats, statsTitle, avatarVariant, avatarSize, avatarSkin } = props

  // Convert avatarSize to number if it's a string
  const size = typeof avatarSize === 'string' ? parseInt(avatarSize, 10) : avatarSize

  return (
    <Card>
      <CardContent className='flex flex-col items-center gap-2'>
        <CustomAvatar color={avatarColor} skin={avatarSkin} variant={avatarVariant} size={size}>
          <i className={avatarIcon} />
        </CustomAvatar>
        <div className='flex flex-col items-center gap-1'>
          <Typography variant='h5'>{stats}</Typography>
          <Typography color='text.secondary'>{statsTitle}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardStatsSquare
