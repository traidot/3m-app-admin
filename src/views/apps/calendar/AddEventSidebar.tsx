// React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid2'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Autocomplete from '@mui/material/Autocomplete'

// Type Imports
import type { AddEventSidebarType, AddEventType } from '@/types/apps/calendarTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// API Imports
import { axiosGet, axiosPost, axiosPut, axiosDelete } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api.config'

// Toast Imports
import { toast } from 'react-toastify'

// Styled Component Imports
import dynamic from 'next/dynamic'

const AppReactDatepicker = dynamic(() => import('@/libs/styles/AppReactDatepicker'), {
  ssr: false,
  loading: () => null,
})

// Date Picker Imports
import { registerLocale } from 'react-datepicker'
import { vi } from 'date-fns/locale/vi'

registerLocale('vi', vi)

// Slice Imports
import { addEvent, deleteEvent, updateEvent, selectedEvent, filterEvents, setEvents } from '@/redux-store/slices/calendar'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  candidateId: string
  interviewDate: Date | null
  durationMinutes: number
  interviewType: string
  location: string
  interviewerIds: string[]
}

// Vars
const defaultState: DefaultStateType = {
  candidateId: '',
  interviewDate: null,
  durationMinutes: 30,
  interviewType: 'onsite',
  location: '',
  interviewerIds: []
}

const AddEventSidebar = (props: AddEventSidebarType) => {
  // Props
  const { calendarStore, dispatch, addEventSidebarOpen, handleAddEventSidebarToggle } = props

  // States
  const [values, setValues] = useState<DefaultStateType>(defaultState)
  const [candidates, setCandidates] = useState<Array<{ id: string; name: string }>>([])
  const [users, setUsers] = useState<Array<{ id: string; name: string; email?: string }>>([])
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [saving, setSaving] = useState(false)

  // Hooks
  const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ 
    defaultValues: { 
      candidateId: ''
    } 
  })

  // Fetch candidates
  const fetchCandidates = useCallback(async () => {
    try {
      setLoadingCandidates(true)
      const response = await axiosGet(`${API_ENDPOINTS.RECRUIT.CANDIDATES}?limit=1000`)
      if (response.success && response.data) {
        const candidatesData = Array.isArray(response.data) ? response.data : (response.data.data || [])
        setCandidates(candidatesData.map((c: any) => ({ id: c.id, name: c.name })))
      }
    } catch (error) {
      console.error('[AddEventSidebar] Error fetching candidates:', error)
    } finally {
      setLoadingCandidates(false)
    }
  }, [])

  // Fetch users for interviewers
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true)
      const response = await axiosGet(`${API_ENDPOINTS.SYSTEM.USERS}?limit=1000`)
      if (response.success && response.data) {
        const usersData = Array.isArray(response.data) ? response.data : (response.data.data || [])
        setUsers(usersData.map((u: any) => ({
          id: u.id,
          name: u.name || u.email || u.id,
          email: u.email
        })))
      }
    } catch (error) {
      console.error('[AddEventSidebar] Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  // Fetch data on mount
  useEffect(() => {
    if (addEventSidebarOpen) {
      fetchCandidates()
      fetchUsers()
    }
  }, [addEventSidebarOpen, fetchCandidates, fetchUsers])

  const resetToStoredValues = useCallback(() => {
    if (calendarStore.selectedEvent !== null) {
      const event = calendarStore.selectedEvent
      const extendedProps = event.extendedProps || {}

      setValue('candidateId', extendedProps.candidateId || '')
      setValues({
        candidateId: extendedProps.candidateId || '',
        interviewDate: event.start ? new Date(event.start) : null,
        durationMinutes: extendedProps.durationMinutes || 30,
        interviewType: extendedProps.interviewType || 'onsite',
        location: extendedProps.location || '',
        interviewerIds: extendedProps.interviewerIds || []
      })
    }
  }, [setValue, calendarStore.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('candidateId', '')
    setValues(defaultState)
  }, [setValue])

  const handleSidebarClose = () => {
    setValues(defaultState)
    clearErrors()
    dispatch(selectedEvent(null))
    handleAddEventSidebarToggle()
  }

  const onSubmit = async (data: { candidateId: string }) => {
    if (!data.candidateId || !values.interviewDate) {
      toast.error('Vui lòng chọn ứng viên và ngày phỏng vấn')
      return
    }

    try {
      setSaving(true)

      const isUpdate = calendarStore.selectedEvent && calendarStore.selectedEvent.extendedProps?.interviewId

      let interviewData: any = {
        candidateId: data.candidateId,
        interviewType: values.interviewType || 'onsite',
        interviewDate: values.interviewDate.toISOString(),
        durationMinutes: values.durationMinutes || 30,
        location: values.location.trim() || undefined,
        interviewerIds: values.interviewerIds.length > 0 ? values.interviewerIds : undefined,
        status: 'scheduled'
      }

      if (isUpdate) {
        // Update existing interview - keep existing round
        await axiosPut(
          API_ENDPOINTS.RECRUIT.INTERVIEW_BY_ID(calendarStore.selectedEvent.extendedProps.interviewId),
          interviewData
        )
        toast.success('Cập nhật lịch phỏng vấn thành công')
      } else {
        // Create new interview - calculate next round
        const interviewsResponse = await axiosGet(`${API_ENDPOINTS.RECRUIT.INTERVIEWS}?candidateId=${data.candidateId}&limit=1000`)
        
        let nextRound = 1
        if (interviewsResponse.success && interviewsResponse.data) {
          const interviewsData = Array.isArray(interviewsResponse.data) 
            ? interviewsResponse.data 
            : (interviewsResponse.data.data || [])
          if (interviewsData.length > 0) {
            nextRound = Math.max(...interviewsData.map((i: any) => i.interview_round || 0)) + 1
          }
        }

        interviewData.interviewRound = nextRound
        await axiosPost(API_ENDPOINTS.RECRUIT.INTERVIEWS, interviewData)
        toast.success('Tạo mới lịch phỏng vấn thành công')
      }

      // Refresh interviews to update calendar
      const refreshResponse = await axiosGet(`${API_ENDPOINTS.RECRUIT.INTERVIEWS}?limit=1000`)
      if (refreshResponse.success && refreshResponse.data) {
        const { convertInterviewsToEvents } = await import('@/hooks/useRecruitInterviews')
        const interviewsData = Array.isArray(refreshResponse.data) 
          ? refreshResponse.data 
          : (refreshResponse.data.data || [])
        const events = convertInterviewsToEvents(interviewsData, [])
        dispatch(setEvents(events))
        dispatch(filterEvents())
      }
      
      // Trigger parent refresh if needed
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('interviews-updated'))
      }

      handleSidebarClose()
    } catch (error: any) {
      console.error('[AddEventSidebar] Error saving interview:', error)
      toast.error(error?.message || 'Lưu lịch phỏng vấn thất bại')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteButtonClick = async () => {
    if (calendarStore.selectedEvent && calendarStore.selectedEvent.extendedProps?.interviewId) {
      try {
        setSaving(true)
        await axiosDelete(API_ENDPOINTS.RECRUIT.INTERVIEW_BY_ID(calendarStore.selectedEvent.extendedProps.interviewId))
        toast.success('Xóa lịch phỏng vấn thành công')
        
        // Refresh interviews to update calendar
        const refreshResponse = await axiosGet(`${API_ENDPOINTS.RECRUIT.INTERVIEWS}?limit=1000`)
        if (refreshResponse.success && refreshResponse.data) {
          const { convertInterviewsToEvents } = await import('@/hooks/useRecruitInterviews')
          const interviewsData = Array.isArray(refreshResponse.data) 
            ? refreshResponse.data 
            : (refreshResponse.data.data || [])
          const events = convertInterviewsToEvents(interviewsData, [])
          dispatch(setEvents(events))
          dispatch(filterEvents())
        }
        
        handleSidebarClose()
      } catch (error: any) {
        console.error('[AddEventSidebar] Error deleting interview:', error)
        toast.error(error?.message || 'Xóa lịch phỏng vấn thất bại')
      } finally {
        setSaving(false)
      }
    }
  }

  const RenderSidebarFooter = () => {
    const isUpdate = calendarStore.selectedEvent !== null && calendarStore.selectedEvent.extendedProps?.interviewId

    return (
      <div className='flex gap-4'>
        <Button type='submit' variant='contained' disabled={saving}>
          {saving ? 'Đang lưu...' : (isUpdate ? 'Cập nhật' : 'Tạo mới')}
        </Button>
        <Button 
          variant='outlined' 
          color='secondary' 
          onClick={isUpdate ? resetToStoredValues : resetToEmptyValues}
          disabled={saving}
        >
          Đặt lại
        </Button>
      </div>
    )
  }

  const ScrollWrapper = isBelowSmScreen ? 'div' : PerfectScrollbar

  useEffect(() => {
    if (calendarStore.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, calendarStore.selectedEvent])

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', 400] } }}
    >
      <Box className='flex justify-between items-center sidebar-header plb-5 pli-6 border-be'>
        <Typography variant='h5'>
          {calendarStore.selectedEvent && calendarStore.selectedEvent.extendedProps?.interviewId 
            ? 'Cập nhật lịch phỏng vấn' 
            : 'Tạo mới lịch phỏng vấn'}
        </Typography>
        {calendarStore.selectedEvent && calendarStore.selectedEvent.extendedProps?.interviewId ? (
          <Box className='flex items-center' sx={{ gap: 1 }}>
            <IconButton size='small' onClick={handleDeleteButtonClick} disabled={saving}>
              <i className='tabler-trash text-2xl text-textPrimary' />
            </IconButton>
            <IconButton size='small' onClick={handleSidebarClose} disabled={saving}>
              <i className='tabler-x text-2xl text-textPrimary' />
            </IconButton>
          </Box>
        ) : (
          <IconButton size='small' onClick={handleSidebarClose} disabled={saving}>
            <i className='tabler-x text-2xl text-textPrimary' />
          </IconButton>
        )}
      </Box>
      <ScrollWrapper
        {...(isBelowSmScreen
          ? { className: 'bs-full overflow-y-auto overflow-x-hidden' }
          : { options: { wheelPropagation: false, suppressScrollX: true } })}
      >
        <Box className='sidebar-body plb-5 pli-6'>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col gap-6'>
            {/* Combobox: Họ và tên ứng viên */}
            <Controller
              name='candidateId'
              control={control}
              rules={{ required: 'Vui lòng chọn ứng viên' }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  options={candidates}
                  getOptionLabel={(option) => option.name || ''}
                  value={candidates.find(c => c.id === value) || null}
                  onChange={(_, newValue) => onChange(newValue?.id || '')}
                  loading={loadingCandidates}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label='Họ và tên ứng viên'
                      error={!!errors.candidateId}
                      helperText={errors.candidateId?.message}
                      required
                    />
                  )}
                />
              )}
            />

            {/* Ngày và giờ phỏng vấn */}
            <AppReactDatepicker
              selected={values.interviewDate}
              onChange={(date: Date | null) => {
                if (date) {
                  // Set default time to 9 AM if not set
                  const defaultDate = new Date(date)
                  if (defaultDate.getHours() === 0 && defaultDate.getMinutes() === 0) {
                    defaultDate.setHours(9, 0, 0, 0)
                  }
                  setValues({ ...values, interviewDate: defaultDate })
                } else {
                  setValues({ ...values, interviewDate: null })
                }
              }}
              showTimeSelect
              timeFormat='HH:mm'
              dateFormat='dd/MM/yyyy HH:mm'
              minDate={new Date()}
              placeholderText='Chọn ngày và giờ phỏng vấn'
              customInput={<CustomTextField label='Ngày và giờ phỏng vấn' fullWidth required />}
              locale='vi'
            />

            {/* Thời lượng */}
            <CustomTextField
              fullWidth
              label='Thời lượng (phút)'
              type='number'
              value={values.durationMinutes}
              onChange={e => setValues({ ...values, durationMinutes: Number(e.target.value) || 30 })}
              inputProps={{ min: 1 }}
            />

            {/* Loại phỏng vấn */}
            <CustomTextField
              fullWidth
              select
              label='Loại phỏng vấn'
              value={values.interviewType}
              onChange={e => setValues({ ...values, interviewType: e.target.value })}
            >
              <MenuItem value='onsite'>Trực tiếp</MenuItem>
              <MenuItem value='online'>Online</MenuItem>
              <MenuItem value='phone'>Điện thoại</MenuItem>
            </CustomTextField>

            {/* Địa điểm */}
            <CustomTextField
              fullWidth
              label='Địa điểm'
              value={values.location}
              onChange={e => setValues({ ...values, location: e.target.value })}
              placeholder='Nhập địa điểm phỏng vấn'
            />

            {/* Người phỏng vấn (combobox, chọn nhiều) */}
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name || option.email || option.id}
              value={users.filter(u => values.interviewerIds.includes(u.id))}
              onChange={(_, newValue) => {
                setValues({ ...values, interviewerIds: newValue.map(u => u.id) })
              }}
              loading={loadingUsers}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label='Người phỏng vấn'
                />
              )}
            />

            <div className='flex items-center'>
              <RenderSidebarFooter />
            </div>
          </form>
        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default AddEventSidebar

