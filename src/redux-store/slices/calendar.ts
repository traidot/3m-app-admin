// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { EventInput } from '@fullcalendar/core'

// Type Imports
import type { CalendarFiltersType, CalendarType } from '@/types/apps/calendarTypes'

const initialState: CalendarType = {
  events: [],
  filteredEvents: [],
  selectedEvent: null,
  selectedCalendars: []
}

const filterEventsUsingCheckbox = (events: EventInput[], selectedCalendars: CalendarFiltersType[]) => {
  return events.filter(event => selectedCalendars.includes(event.extendedProps?.calendar as CalendarFiltersType))
}

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState: initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventInput[]>) => {
      state.events = action.payload
      state.filteredEvents = action.payload
    },

    filterEvents: state => {
      state.filteredEvents = filterEventsUsingCheckbox(state.events, state.selectedCalendars)
    },

    addEvent: (state, action) => {
      const newEvent = { ...action.payload, id: `${parseInt(state.events[state.events.length - 1]?.id ?? '0') + 1}` }

      state.events.push(newEvent)
      state.filteredEvents = filterEventsUsingCheckbox(state.events, state.selectedCalendars)
    },

    updateEvent: (state, action: PayloadAction<EventInput>) => {
      state.events = state.events.map(event => {
        if (action.payload._def && event.id === action.payload._def.publicId) {
          return {
            id: event.id,
            url: action.payload._def.url,
            title: action.payload._def.title,
            allDay: action.payload._def.allDay,
            end: action.payload._instance.range.end,
            start: action.payload._instance.range.start,
            extendedProps: action.payload._def.extendedProps
          }
        } else if (event.id === action.payload.id) {
          return action.payload
        } else {
          return event
        }
      })
      state.filteredEvents = filterEventsUsingCheckbox(state.events, state.selectedCalendars)
    },

    deleteEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload)
      state.filteredEvents = filterEventsUsingCheckbox(state.events, state.selectedCalendars)
    },

    selectedEvent: (state, action) => {
      state.selectedEvent = action.payload
    },

    filterCalendarLabel: (state, action) => {
      const index = state.selectedCalendars.indexOf(action.payload)

      if (index !== -1) {
        state.selectedCalendars.splice(index, 1)
      } else {
        state.selectedCalendars.push(action.payload)
      }

      state.filteredEvents = filterEventsUsingCheckbox(state.events, state.selectedCalendars)
    },

    filterAllCalendarLabels: (state, action: PayloadAction<{ checked: boolean; availableCalendars: CalendarFiltersType[] }>) => {
      if (action.payload.availableCalendars.length > 0) {
        state.selectedCalendars = action.payload.checked ? [...action.payload.availableCalendars] : []
      } else {
        // Fallback to default if no available calendars provided
        state.selectedCalendars = action.payload.checked ? ['Personal', 'Business', 'Family', 'Holiday', 'ETC'] : []
      }
      state.filteredEvents = filterEventsUsingCheckbox(state.events, state.selectedCalendars)
    },

    setAvailableCalendars: (state, action: PayloadAction<CalendarFiltersType[]>) => {
      // When available calendars are set, if selectedCalendars is empty, select all
      if (state.selectedCalendars.length === 0 && action.payload.length > 0) {
        state.selectedCalendars = [...action.payload]
        state.filteredEvents = filterEventsUsingCheckbox(state.events, state.selectedCalendars)
      }
    }
  }
})

export const {
  setEvents,
  filterEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  selectedEvent,
  filterCalendarLabel,
  filterAllCalendarLabels,
  setAvailableCalendars
} = calendarSlice.actions

export default calendarSlice.reducer

