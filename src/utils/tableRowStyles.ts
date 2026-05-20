import type { SxProps, Theme } from '@mui/material/styles'

/**
 * Tạo sx props cho table row với hover effect
 * @param isSelected - Row có được chọn không
 * @param cursor - Cursor style (default: 'default', 'pointer' khi có modifier key)
 * @returns SxProps object cho table row
 */
export const getTableRowSx = (isSelected: boolean, cursor: 'default' | 'pointer' = 'default'): SxProps<Theme> => {
  return {
    cursor,
    bgcolor: isSelected ? 'rgb(var(--mui-palette-primary-mainChannel) / 0.12)' : 'transparent',
    transition: 'background-color 0.2s',
    '&:hover': {
      bgcolor: isSelected ? 'rgb(var(--mui-palette-primary-mainChannel) / 0.12)' : 'action.hover'
    }
  }
}

