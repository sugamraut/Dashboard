import { configureStore } from "@reduxjs/toolkit";
import auth from './auth/LoginSlice'

const store=configureStore({
    reducer:{
      auth:auth,
    }
})
export default store

export type AppDispatch=typeof store.dispatch
export type RootState=ReturnType<typeof store.getState>

