'use client'

// React Imports
import { useState, useEffect, useCallback } from 'react'

// MUI Imports
import { useMediaQuery } from '@mui/material'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import { useDispatch, useSelector } from 'react-redux'

// Type Imports
import type { CalendarColors, CalendarType } from '@/types/apps/calendarTypes'

// Component Imports
import Calendar from './Calendar'
import SidebarLeft from './SidebarLeft'
import AddEventSidebar from './AddEventSidebar'
// import RecruitJobDetailDrawer from '@/app/(module)/recruit/jobs/RecruitJobDetailDrawer'

// Hook Imports
import { useRecruitInterviews } from '@/hooks/useRecruitInterviews'

// API Imports
import { axiosGet } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api.config'

// Slice Imports
import { setEvents, filterEvents, setAvailableCalendars } from '@/redux-store/slices/calendar'

// Theme colors for jobs (will be assigned cyclically)
// Note: 'secondary' is excluded as it's used for default checkboxes
const jobColors: Array<'primary' | 'error' | 'warning' | 'info' | 'success'> = [
  'primary',
  'error',
  'warning',
  'info',
  'success',
]

const AppCalendar = () => {
  // States
  const [calendarApi, setCalendarApi] = useState<null | any>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false)
  const [jobs, setJobs] = useState<Array<{ id: string; title: string }>>([])
  const [calendarsColor, setCalendarsColor] = useState<CalendarColors>({})
  const [showAllJobs, setShowAllJobs] = useState<boolean>(false)
  const [jobDetailDrawerOpen, setJobDetailDrawerOpen] = useState<boolean>(false)
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<any>(null)
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [positions, setPositions] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [jobRanks, setJobRanks] = useState<Array<{ id: string; code: string; job_family: string; job_rank_level: string }>>([])
  const [locations, setLocations] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [jobTypes, setJobTypes] = useState<Array<{ id: string; code: string; value_vi: string }>>([])
  const [jobStatuses, setJobStatuses] = useState<Array<{ id: string; code: string; value_vi: string }>>([])
  const [jobPriorities, setJobPriorities] = useState<Array<{ id: string; code: string; value_vi: string }>>([])

  // Hooks
  const dispatch = useDispatch()
  const calendarStore = useSelector((state: { calendarReducer: CalendarType }) => state.calendarReducer)
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const { interviews, loading: interviewsLoading, convertToEvents, refetch: refetchInterviews } = useRecruitInterviews()

  // Set sidebar open by default on desktop
  useEffect(() => {
    if (mdAbove) {
      setLeftSidebarOpen(true)
    }
  }, [mdAbove])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)

  // Fetch jobs with interviews for Event Filters
  const fetchJobs = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (showAllJobs) {
        params.append('includeClosed', 'true')
      }

      const response = await axiosGet(`${API_ENDPOINTS.RECRUIT.JOBS}/with-interviews?${params.toString()}`)
      if (response && response.success && response.data) {
        const jobsData = Array.isArray(response.data)
          ? response.data
          : (response.data.data || [])

        if (Array.isArray(jobsData)) {
          const jobList = jobsData.map((j: any) => ({ id: j.id, title: j.title }))
          setJobs(jobList)

          // Create calendarsColor from jobs
          const colorsMap: CalendarColors = {}
          jobsData.forEach((job: any, index: number) => {
            colorsMap[job.id] = jobColors[index % jobColors.length]
          })
          setCalendarsColor(colorsMap)

          // Set available calendars in Redux store
          if (jobList.length > 0) {
            dispatch(setAvailableCalendars(jobList.map(j => j.id)))
          }
        }
      }
    } catch (error) {
      console.error('[CalendarWrapper] Error fetching jobs with interviews:', error)
    }
  }, [showAllJobs, dispatch])

  // Fetch jobs on mount and when showAllJobs changes
  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Load interviews into calendar
  useEffect(() => {
    if (!interviewsLoading && interviews.length > 0) {
      const events = convertToEvents(interviews, jobs)
      dispatch(setEvents(events))
      dispatch(filterEvents())
    }
  }, [interviews, interviewsLoading, convertToEvents, dispatch, jobs])

  // Fetch master data for job detail drawer
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        // Fetch departments
        const departmentsResponse = await axiosGet(`${API_ENDPOINTS.HRM.DEPARTMENTS}?limit=1000`)
        if (departmentsResponse.success && departmentsResponse.data) {
          const departmentsData = Array.isArray(departmentsResponse.data) ? departmentsResponse.data : (departmentsResponse.data.data || [])
          setDepartments(departmentsData
            .filter((d: any) => d.is_active !== false)
            .map((d: any) => ({ id: d.id, name: d.name, code: d.code })))
        }

        // Fetch positions
        const positionsResponse = await axiosGet(`${API_ENDPOINTS.HRM.POSITIONS}?limit=1000`)
        if (positionsResponse.success && positionsResponse.data) {
          const positionsData = Array.isArray(positionsResponse.data) ? positionsResponse.data : (positionsResponse.data.data || [])
          setPositions(positionsData
            .filter((p: any) => p.is_active !== false)
            .map((p: any) => ({ id: p.id, name: p.name, code: p.code })))
        }

        // Fetch job ranks
        const jobRanksResponse = await axiosGet(`${API_ENDPOINTS.HRM.JOB_RANKS}?limit=1000`)
        if (jobRanksResponse.success && jobRanksResponse.data) {
          const jobRanksData = Array.isArray(jobRanksResponse.data) ? jobRanksResponse.data : (jobRanksResponse.data.data || [])
          setJobRanks(jobRanksData
            .filter((jr: any) => jr.is_active !== false)
            .map((jr: any) => ({ 
              id: jr.id, 
              code: jr.code, 
              job_family: jr.job_family,
              job_rank_level: jr.job_rank_level 
            })))
        }

        // Fetch locations
        const locationsResponse = await axiosGet(`${API_ENDPOINTS.HRM.LOCATIONS}?limit=1000`)
        if (locationsResponse.success && locationsResponse.data) {
          const locationsData = Array.isArray(locationsResponse.data) ? locationsResponse.data : (locationsResponse.data.data || [])
          setLocations(locationsData
            .filter((l: any) => l.is_active !== false)
            .map((l: any) => ({ id: l.id, name: l.name, code: l.code })))
        }

        // Fetch job types
        const jobTypeParams = new URLSearchParams({
          module: 'recruit',
          category: 'job_type',
          isActive: 'true',
          sortBy: 'order_by',
          sortOrder: 'asc',
          limit: '100',
        })
        const jobTypeResponse = await axiosGet(`${API_ENDPOINTS.SYSTEM.MASTER_DATA}?${jobTypeParams.toString()}`)
        if (jobTypeResponse.success && jobTypeResponse.data) {
          const jobTypesData = Array.isArray(jobTypeResponse.data) ? jobTypeResponse.data : (jobTypeResponse.data.data || [])
          setJobTypes(jobTypesData.map((item: any) => ({ id: item.id, code: item.code, value_vi: item.value_vi })))
        }

        // Fetch job statuses
        const jobStatusParams = new URLSearchParams({
          module: 'recruit',
          category: 'job_status',
          isActive: 'true',
          sortBy: 'order_by',
          sortOrder: 'asc',
          limit: '100',
        })
        const jobStatusResponse = await axiosGet(`${API_ENDPOINTS.SYSTEM.MASTER_DATA}?${jobStatusParams.toString()}`)
        if (jobStatusResponse.success && jobStatusResponse.data) {
          const jobStatusesData = Array.isArray(jobStatusResponse.data) ? jobStatusResponse.data : (jobStatusResponse.data.data || [])
          setJobStatuses(jobStatusesData.map((item: any) => ({ id: item.id, code: item.code, value_vi: item.value_vi })))
        }

        // Fetch job priorities
        const jobPriorityParams = new URLSearchParams({
          module: 'recruit',
          category: 'job_priority',
          isActive: 'true',
          sortBy: 'order_by',
          sortOrder: 'asc',
          limit: '100',
        })
        const jobPriorityResponse = await axiosGet(`${API_ENDPOINTS.SYSTEM.MASTER_DATA}?${jobPriorityParams.toString()}`)
        if (jobPriorityResponse.success && jobPriorityResponse.data) {
          const jobPrioritiesData = Array.isArray(jobPriorityResponse.data) ? jobPriorityResponse.data : (jobPriorityResponse.data.data || [])
          setJobPriorities(jobPrioritiesData.map((item: any) => ({ id: item.id, code: item.code, value_vi: item.value_vi })))
        }
      } catch (error) {
        console.error('[CalendarWrapper] Error fetching master data:', error)
      }
    }

    fetchMasterData()
  }, [])

  // Handle job detail click
  const handleJobDetailClick = useCallback(async (jobId: string) => {
    try {
      const response = await axiosGet(API_ENDPOINTS.RECRUIT.JOB_BY_ID(jobId))
      if (response.success && response.data) {
        const jobData = response.data?.data || response.data
        setSelectedJobForDetail({
          ...jobData,
          version: 0, // Version field removed but drawer still requires it
          hired_count: jobData.hired_count || 0,
          created_at: jobData.created_at || new Date().toISOString(),
          updated_at: jobData.updated_at || new Date().toISOString()
        })
        setJobDetailDrawerOpen(true)
      }
    } catch (error) {
      console.error('[CalendarWrapper] Error fetching job detail:', error)
    }
  }, [])

  return (
    <>
      <SidebarLeft
        mdAbove={mdAbove}
        dispatch={dispatch}
        calendarApi={calendarApi}
        calendarStore={calendarStore}
        calendarsColor={calendarsColor}
        jobs={jobs}
        interviews={interviews}
        showAllJobs={showAllJobs}
        onShowAllJobsChange={setShowAllJobs}
        leftSidebarOpen={leftSidebarOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        onJobDetailClick={handleJobDetailClick}
      />
      <div className='p-6 pbe-0 flex-grow overflow-visible bg-backgroundPaper rounded'>
        <Calendar
          dispatch={dispatch}
          calendarApi={calendarApi}
          calendarStore={calendarStore}
          setCalendarApi={setCalendarApi}
          calendarsColor={calendarsColor}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          onEventUpdate={refetchInterviews}
        />
      </div>
      <AddEventSidebar
        dispatch={dispatch}
        calendarApi={calendarApi}
        calendarStore={calendarStore}
        addEventSidebarOpen={addEventSidebarOpen}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />

      {/* Job Detail Drawer */}
      {/* <RecruitJobDetailDrawer
        open={jobDetailDrawerOpen}
        onClose={() => {
          setJobDetailDrawerOpen(false)
          setSelectedJobForDetail(null)
        }}
        selectedJob={selectedJobForDetail}
        onEdit={(job) => {
          // Navigate to edit or handle edit
          window.location.href = `/recruit/jobs?edit=${job.id}`
        }}
        departments={departments}
        positions={positions}
        jobRanks={jobRanks}
        locations={locations}
        jobTypes={jobTypes}
        jobStatuses={jobStatuses}
        jobPriorities={jobPriorities}
      /> */}
    </>
  )
}

export default AppCalendar

