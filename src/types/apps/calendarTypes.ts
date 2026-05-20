// Third-party Imports
import type { Dispatch } from '@reduxjs/toolkit'
import type { EventInput } from '@fullcalendar/core'

// Type Imports
import type { ThemeColor } from '@core/types'

export type CalendarFiltersType = 'Personal' | 'Business' | 'Family' | 'Holiday' | 'ETC' | string

export type CalendarColors = {
  ETC?: ThemeColor
  Family?: ThemeColor
  Holiday?: ThemeColor
  Personal?: ThemeColor
  Business?: ThemeColor
  [key: string]: ThemeColor | undefined
}

export type CalendarType = {
  events: EventInput[]
  filteredEvents: EventInput[]
  selectedEvent: null | any
  selectedCalendars: CalendarFiltersType[]
}

export type AddEventType = Omit<EventInput, 'id'>

export type SidebarLeftProps = {
  mdAbove: boolean
  calendarApi: any
  calendarStore: CalendarType
  leftSidebarOpen: boolean
  dispatch: Dispatch
  calendarsColor: CalendarColors
  jobs?: Array<{ id: string; title: string }>
  interviews?: Array<{ id: string; job_id?: string | null }>
  showAllJobs?: boolean
  onShowAllJobsChange?: (value: boolean) => void
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  onJobDetailClick?: (jobId: string) => void
}

export type AddEventSidebarType = {
  calendarStore: CalendarType
  calendarApi: any
  dispatch: Dispatch
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
}

