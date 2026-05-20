// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party imports
import type { Dispatch } from '@reduxjs/toolkit'
import 'bootstrap-icons/font/bootstrap-icons.css'

// API Imports
import { axiosPut } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api.config'

// Toast Imports
import { toast } from 'react-toastify'

import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions } from '@fullcalendar/core'
import viLocale from '@fullcalendar/core/locales/vi'

// Custom Vietnamese locale with full day/month names
const customViLocale = {
  ...viLocale,
  week: {
    dow: 1, // Monday is the first day of the week
    doy: 4  // The week that contains Jan 4th is the first week of the year
  },
  buttonText: {
    today: 'Hôm nay',
    month: 'Tháng',
    week: 'Tuần',
    day: 'Ngày',
    list: 'Danh sách'
  },
  allDayText: 'Cả ngày',
  moreLinkText: (n: number) => `+${n} thêm`,
  noEventsText: 'Không có sự kiện',
  weekText: 'Tuần',
  dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
  dayNamesShort: ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesMin: ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  monthNamesShort: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
}

// Type Imports
import type { AddEventType, CalendarColors, CalendarType } from '@/types/apps/calendarTypes'

// Slice Imports
import { filterEvents, selectedEvent, updateEvent } from '@/redux-store/slices/calendar'

type CalenderProps = {
  calendarStore: CalendarType
  calendarApi: any
  setCalendarApi: (val: any) => void
  calendarsColor: CalendarColors
  dispatch: Dispatch
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  onEventUpdate?: () => void
}

const blankEvent: AddEventType = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    description: ''
  }
}

const Calendar = (props: CalenderProps) => {
  // Props
  const {
    calendarStore,
    calendarApi,
    setCalendarApi,
    calendarsColor,
    dispatch,
    handleAddEventSidebarToggle,
    handleLeftSidebarToggle,
    onEventUpdate
  } = props

  // Refs
  const calendarRef = useRef()

  // Hooks
  const theme = useTheme()

  // Load saved view from localStorage on mount
  const [initialView, setInitialView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('calendar-view')
      return savedView || 'dayGridMonth'
    }
    return 'dayGridMonth'
  })

  // Compute initial scroll time for timeGrid views (week/day)
  const [initialScrollTime] = useState<string>(() => {
    const now = new Date()
    let hour = now.getHours()

    // Clamp between 7h và 18h để không scroll quá sớm hoặc quá muộn
    if (hour < 7) hour = 7
    if (hour > 18) hour = 18

    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(hour)}:00:00`
  })

  // Save view to localStorage when it changes
  useEffect(() => {
    if (calendarApi) {
      const handleViewChange = () => {
        const currentView = calendarApi.view.type
        if (typeof window !== 'undefined' && currentView) {
          localStorage.setItem('calendar-view', currentView)
        }
      }

      calendarApi.on('viewChange', handleViewChange)

      return () => {
        calendarApi.off('viewChange', handleViewChange)
      }
    }
  }, [calendarApi])


  useEffect(() => {
    if (calendarApi === null) {
      // @ts-ignore
      setCalendarApi(calendarRef.current?.getApi())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Disable title click to prevent href error
  useEffect(() => {
    const disableTitleClick = () => {
      const titleElement = document.querySelector('.fc-toolbar-title') as HTMLElement
      if (titleElement) {
        titleElement.style.pointerEvents = 'none'
        titleElement.style.cursor = 'default'
      }
    }

    // Run after a short delay to ensure calendar is rendered
    const timer = setTimeout(disableTitleClick, 100)
    
    // Also run on calendar updates
    const observer = new MutationObserver(disableTitleClick)
    const calendarContainer = document.querySelector('.fc')
    if (calendarContainer) {
      observer.observe(calendarContainer, { childList: true, subtree: true })
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [calendarStore.filteredEvents])

  // calendarOptions(Props)
  const calendarOptions: CalendarOptions = {
    events: calendarStore.filteredEvents,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    locale: customViLocale,
    initialView: initialView,
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    // Custom title format to ensure capitalized 'Tháng'
    titleFormat: (arg) => {
      try {
        const baseDate = (arg as any).start
          ? new Date((arg as any).start.marker || (arg as any).start)
          : new Date()

        const formatter = new Intl.DateTimeFormat('vi-VN', {
          year: 'numeric',
          month: 'long',
        })

        const rawTitle = formatter.format(baseDate)
        if (!rawTitle) return rawTitle

        // Capitalize first character: 'tháng 7 năm 2027' -> 'Tháng 7 năm 2027'
        return rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1)
      } catch {
        // Fallback to default behavior if Intl fails
        return ''
      }
    },
    // Custom day header text: 'Thứ 2, Thứ 3...' instead of 'Th 2'
    dayHeaderContent: arg => {
      const labels = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
      const dayIndex = arg.date.getDay()
      return labels[dayIndex] || ''
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
      },
      day: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
      }
    },

    // Working hours: 07:00 - 19:00 (vẫn hiển thị tất cả giờ, nhưng đánh dấu business hours)
    businessHours: {
      // Thứ 2 -> Thứ 7
      daysOfWeek: [1, 2, 3, 4, 5, 6],
      startTime: '07:00',
      endTime: '19:00'
    },
    // Hiển thị đường chỉ giờ hiện tại
    nowIndicator: true,
    // Scroll đến khoảng thời gian gần hiện tại ở view tuần/ngày
    scrollTime: initialScrollTime,

    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }: any) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `event-bg-${colorName}`
      ]
    },

    // Custom event content for tooltip
    eventContent: (arg: any) => {
      const { event, view } = arg
      const extendedProps = event.extendedProps || {}
      
      // Format time range
      const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
      }
      const startTime = formatTime(event.start)
      const endTime = formatTime(event.end)
      const timeRange = `${startTime}~${endTime}`
      
      // Get candidate name from extendedProps (real data)
      const candidateName = extendedProps.candidateName
      
      // Tooltip content with full information
      const interviewTypeMap: Record<string, string> = {
        'onsite': 'Trực tiếp',
        'online': 'Online',
        'phone': 'Điện thoại'
      }
      
      const statusMap: Record<string, string> = {
        'scheduled': 'Đã lên lịch',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
      }
      
      const tooltipContent = [
        `Thời gian: ${timeRange}`,
        `Ứng viên: ${candidateName}`,
        extendedProps.location ? `Địa điểm: ${extendedProps.location}` : null,
        extendedProps.interviewType ? `Loại: ${interviewTypeMap[extendedProps.interviewType] || extendedProps.interviewType}` : null,
        extendedProps.status ? `Trạng thái: ${statusMap[extendedProps.status] || extendedProps.status}` : null,
        extendedProps.notes ? `Ghi chú: ${extendedProps.notes}` : null
      ].filter(Boolean).join('\n')
      
      // Check if this is list view
      const isListView = view.type === 'listMonth' || view.type === 'listWeek' || view.type === 'listDay'
      
      // For list view, don't set color (let CSS handle it), for other views use white text on dark background
      const textColorStyle = isListView ? '' : 'color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3);'
      
      // For all views, wrap with tooltip and ensure good contrast
      return {
        html: `<div title="${tooltipContent.replace(/"/g, '&quot;').replace(/\n/g, '&#10;')}" style="cursor: pointer; ${textColorStyle} font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; display: block;">${event.title}</div>`
      }
    },

    eventClick({ event: clickedEvent, jsEvent }: any) {
      jsEvent.preventDefault()

      dispatch(selectedEvent(clickedEvent))
      handleAddEventSidebarToggle()

      // Don't navigate to URL, just show drawer
      // if (clickedEvent.url) {
      //   // Open the URL in a new tab
      //   window.open(clickedEvent.url, '_blank')
      // }

      //* Only grab required field otherwise it goes in infinity loop
      //! Always grab all fields rendered by form (even if it get `undefined`)
      // event.value = grabEventDataFromEventApi(clickedEvent)
      // isAddNewEventSidebarActive.value = true
    },

    customButtons: {
      sidebarToggle: {
        icon: 'tabler tabler-menu-2',
        click() {
          handleLeftSidebarToggle()
        }
      }
    },

    dateClick(info: any) {
      const ev = { ...blankEvent }

      ev.start = info.date
      ev.end = info.date
      ev.allDay = true

      dispatch(selectedEvent(ev))
      handleAddEventSidebarToggle()
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop: async ({ event: droppedEvent }: any) => {
      const extendedProps = droppedEvent.extendedProps || {}
      const interviewId = extendedProps.interviewId

      // Update Redux store immediately for UI feedback
      dispatch(updateEvent(droppedEvent))
      dispatch(filterEvents())

      // If this is a recruit interview, update via API
      if (interviewId) {
        try {
          const startDate = droppedEvent.start
          const endDate = droppedEvent.end || new Date(startDate.getTime() + (extendedProps.durationMinutes || 60) * 60 * 1000)
          const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (60 * 1000))

          await axiosPut(
            API_ENDPOINTS.RECRUIT.INTERVIEW_BY_ID(interviewId),
            {
              interviewDate: startDate.toISOString(),
              durationMinutes: durationMinutes
            }
          )

          // Refresh interviews to get updated data
          if (onEventUpdate) {
            onEventUpdate()
          }

          toast.success('Cập nhật lịch phỏng vấn thành công')
        } catch (error: any) {
          console.error('[Calendar] Error updating interview:', error)
          toast.error(error?.message || 'Không thể cập nhật lịch phỏng vấn')
          
          // Revert the event position on error
          droppedEvent.setStart(droppedEvent.start)
          if (droppedEvent.end) {
            droppedEvent.setEnd(droppedEvent.end)
          }
        }
      }
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize: async ({ event: resizedEvent }: any) => {
      const extendedProps = resizedEvent.extendedProps || {}
      const interviewId = extendedProps.interviewId

      // Update Redux store immediately for UI feedback
      dispatch(updateEvent(resizedEvent))
      dispatch(filterEvents())

      // If this is a recruit interview, update via API
      if (interviewId) {
        try {
          const startDate = resizedEvent.start
          const endDate = resizedEvent.end || new Date(startDate.getTime() + (extendedProps.durationMinutes || 60) * 60 * 1000)
          const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (60 * 1000))

          await axiosPut(
            API_ENDPOINTS.RECRUIT.INTERVIEW_BY_ID(interviewId),
            {
              durationMinutes: durationMinutes
            }
          )

          // Refresh interviews to get updated data
          if (onEventUpdate) {
            onEventUpdate()
          }

          toast.success('Cập nhật thời lượng phỏng vấn thành công')
        } catch (error: any) {
          console.error('[Calendar] Error updating interview duration:', error)
          toast.error(error?.message || 'Không thể cập nhật thời lượng phỏng vấn')
          
          // Revert the event duration on error
          if (resizedEvent.end) {
            resizedEvent.setEnd(resizedEvent.end)
          }
        }
      }
    },

    // @ts-ignore
    ref: calendarRef,

    direction: theme.direction
  }

  return <FullCalendar {...calendarOptions} />
}

export default Calendar

