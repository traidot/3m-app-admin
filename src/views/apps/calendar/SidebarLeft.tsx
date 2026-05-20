// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// Third-party imports
import classnames from 'classnames'

// Types Imports
import type { SidebarLeftProps, CalendarFiltersType } from '@/types/apps/calendarTypes'
import type { ThemeColor } from '@core/types'

// Styled Component Imports
import dynamic from 'next/dynamic'

const AppReactDatepicker = dynamic(() => import('@/libs/styles/AppReactDatepicker'), {
  ssr: false,
  loading: () => null,
})

// Slice Imports
import { filterAllCalendarLabels, filterCalendarLabel, selectedEvent } from '@/redux-store/slices/calendar'

const SidebarLeft = (props: SidebarLeftProps) => {
  // Props
  const {
    mdAbove,
    leftSidebarOpen,
    calendarStore,
    calendarsColor,
    jobs = [],
    interviews = [],
    showAllJobs = false,
    onShowAllJobsChange,
    calendarApi,
    dispatch,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    onJobDetailClick
  } = props

  // Count interviews per job
  const interviewCounts = interviews.reduce((acc, interview) => {
    if (interview.job_id) {
      acc[interview.job_id] = (acc[interview.job_id] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Vars - Use jobs if available, otherwise fallback to calendarsColor
  const filtersToRender = jobs.length > 0
    ? jobs.map(job => ({
        key: job.id,
        label: job.title,
        color: calendarsColor[job.id] || 'primary',
        interviewCount: interviewCounts[job.id] || 0
      }))
    : calendarsColor
      ? Object.entries(calendarsColor).map(([key, value]) => ({
          key,
          label: key,
          color: value,
          interviewCount: 0
        }))
      : []

  const renderFilters = filtersToRender.length
    ? filtersToRender.map(({ key, label, color, interviewCount }) => {
        return (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <FormControlLabel
              className='mbe-0'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{label}</span>
                  {interviewCount > 0 && (
                    <Badge
                      badgeContent={interviewCount}
                      color={color as ThemeColor}
                      sx={{
                        '& .MuiBadge-badge': {
                          right: -8,
                          top: -8,
                          minWidth: 18,
                          height: 18,
                          fontSize: '0.6rem',
                          fontWeight: 500
                        }
                      }}
                    >
                      <Box sx={{ width: 8, height: 8 }} />
                    </Badge>
                  )}
                </Box>
              }
              control={
                <Checkbox
                  color={color as ThemeColor}
                  checked={calendarStore.selectedCalendars.indexOf(key as CalendarFiltersType) > -1}
                  onChange={() => dispatch(filterCalendarLabel(key as CalendarFiltersType))}
                />
              }
            />
            {onJobDetailClick && (
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  onJobDetailClick(key)
                }}
                sx={{ 
                  ml: 'auto',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
                title='Xem chi tiết vị trí tuyển dụng'
              >
                <i className='tabler-eye text-sm' />
              </IconButton>
            )}
          </Box>
        )
      })
    : null

  const handleSidebarToggleSidebar = () => {
    dispatch(selectedEvent(null))
    handleAddEventSidebarToggle()
  }

  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={mdAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true,
        keepMounted: true // Better open performance on mobile.
      }}
      className={classnames('block', { static: mdAbove, absolute: !mdAbove })}
      PaperProps={{
        className: classnames('items-start is-[280px] shadow-none rounded rounded-se-none rounded-ee-none', {
          static: mdAbove,
          absolute: !mdAbove
        })
      }}
      sx={{
        zIndex: 3,
        '& .MuiDrawer-paper': {
          zIndex: mdAbove ? 2 : 'drawer'
        },
        '& .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute'
        }
      }}
    >
      <div className='is-full p-6'>
        <Button
          fullWidth
          variant='contained'
          onClick={handleSidebarToggleSidebar}
          startIcon={<i className='tabler-plus' />}
        >
          Thêm lịch phỏng vấn
        </Button>
      </div>
      <Divider className='is-full' />
      <AppReactDatepicker
        inline
        onChange={date => calendarApi?.gotoDate(date)}
        boxProps={{
          className: 'flex justify-center is-full',
          sx: { '& .react-datepicker': { boxShadow: 'none !important', border: 'none !important' } }
        }}
      />
      <Divider className='is-full' />
      
      {onShowAllJobsChange && (
        <div className='is-full p-6 pbe-6'>
          <FormControlLabel
            label='Hiển thị toàn bộ vị trí tuyển dụng (đã đóng và đã huỷ)'
            control={
              <Checkbox
                color='secondary'
                checked={showAllJobs}
                onChange={e => onShowAllJobsChange(e.target.checked)}
              />
            }
          />
        </div>
      )}
      <Divider className='is-full' />

      <div className='flex flex-col p-6 is-full'>
        <Typography variant='h5' className='mbe-4'>
          Vị trí tuyển dụng
        </Typography>
        
        {filtersToRender.length > 0 && (
          <>
            <FormControlLabel
              className='mbe-2 font-bold'
              label='Chọn tất cả'
              control={
                <Checkbox
                  color='secondary'
                  checked={calendarStore.selectedCalendars.length === filtersToRender.length && filtersToRender.length > 0}
                  onChange={e => dispatch(filterAllCalendarLabels({
                    checked: e.target.checked,
                    availableCalendars: filtersToRender.map(f => f.key as CalendarFiltersType)
                  }))}
                />
              }
            />
            <Divider className='is-full' />
            {renderFilters}
          </>
        )}
      </div>
    </Drawer>
  )
}

export default SidebarLeft

