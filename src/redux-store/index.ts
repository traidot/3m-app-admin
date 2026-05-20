// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// Slice Imports
import calendarReducer from './slices/calendar'

// Dummy reducer để tránh lỗi "Store does not have a valid reducer"
const dummySlice = createSlice({
  name: 'dummy',
  initialState: {},
  reducers: {},
})

// Redux store configuration
export const store = configureStore({
  reducer: {
    dummy: dummySlice.reducer,
    calendarReducer, // Calendar reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
