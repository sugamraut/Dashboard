import { configureStore } from "@reduxjs/toolkit";
import auth from './auth/LoginSlice'
import distric from './districts/DistrictsSlice'

const store=configureStore({
    reducer:{
      auth:auth,
      distric:distric,
    }
})
export default store

export type AppDispatch=typeof store.dispatch
export type RootState=ReturnType<typeof store.getState>

