import { configureStore } from "@reduxjs/toolkit";
import auth from './auth/LoginSlice'
import district from './districts/DistrictsSlice'
import city from "./cities/CitiesSlice"
import branch from "./branchSlice/BranchSlice"

const store=configureStore({
    reducer:{
      auth:auth,
      district:district,
      city:city,
      branch:branch,

    }
})
export default store

export type AppDispatch=typeof store.dispatch
export type RootState=ReturnType<typeof store.getState>




