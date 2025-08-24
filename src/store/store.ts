import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/LoginSlice";
import district from "./districts/DistrictsSlice";
import city from "./cities/CitiesSlice";
import branch from "./branch/BranchSlice";
import User from "./user/UserSlice";
// import Account from "./Account/AccountSlice"
import accountTypes from "./account/AccountSlice";
import Permissions from "./Permission/PermissionSlice";
import dashboard from "./dashboard/DashboardSlice";
import roles from "./role/RoleSlice";
import states from "./state/StateSlice";
import profile from "./profile/ProfileSlice";
import scannedLog from "./scannedlog/ScannedSlice";
import activityLog from "./activitylogs/ActivitySlice";
import setting from "./setting/SettingSlice";

const store = configureStore({
  reducer: {
    auth: auth,
    district: district,
    city: city,
    branch: branch,
    User: User,
    accountTypes: accountTypes,
    permissions: Permissions,
    dashboard: dashboard,
    roles: roles,
    states: states,
    profile: profile,
    scannedLog: scannedLog,
    activityLog: activityLog,
    setting: setting,
  },
});
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
