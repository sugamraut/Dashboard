import { configureStore } from "@reduxjs/toolkit";
import auth from './auth/LoginSlice'
import district from './districts/DistrictsSlice'
import city from "./cities/CitiesSlice"
import branch from "./branchSlice/BranchSlice"
import User from "./user/userSlice"
// import Account from "./Account/AccountSlice"
import accountTypes from "./Account/AccountSlice"
import Permissions from "../store/Permission/permissionSlice";






const store = configureStore({
    reducer:{
      auth:auth,
      district:district,
      city:city,
      branch:branch,
      User:User,
      accountTypes:accountTypes,
      permissions:Permissions,
    }
})
export default store

export type AppDispatch=typeof store.dispatch
export type RootState=ReturnType<typeof store.getState>




