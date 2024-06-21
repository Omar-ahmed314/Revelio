import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './slices'

export default configureStore({
  reducer: {
    file: fileReducer
  },
})