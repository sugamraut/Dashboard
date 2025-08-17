import { configureStore } from "@reduxjs/toolkit";
import auth from './auth/LoginSlice'
import district from './districts/DistrictsSlice'
import city from "./cities/CitiesSlice"
import branch from "./branchSlice/BranchSlice"
import User from "./user/userSlice"
// import Account from "./Account/AccountSlice"
import accountTypes from "./account/AccountSlice"
import Permissions from "./Permission/PermissionSlice";
import dashboard from "./dashboard/DashboardSlice";
import roles from "./role/RoleSlice"
import states from "./state/stateSlice"

const store = configureStore({
    reducer:{
      auth:auth,
      district:district,
      city:city,
      branch:branch,
      User:User,
      accountTypes:accountTypes,
      permissions:Permissions,
      dashboard:dashboard,
      roles:roles,
      states:states,
    }
})
export default store

export type AppDispatch=typeof store.dispatch
export type RootState=ReturnType<typeof store.getState>




