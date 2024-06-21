import { createSlice } from '@reduxjs/toolkit'

export const fileSlice = createSlice({
  name: 'file',
  initialState: {
    value: undefined,
  },
  reducers: {
    add: (state, action) => {
      state.value = action.payload
    },
    remove: (state) => {
      state.value = undefined
    }
  }
})

// Action creators are generated for each case reducer function
export const { add, remove } = fileSlice.actions

export default fileSlice.reducer