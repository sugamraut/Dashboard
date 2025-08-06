import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import { Status, type StatusType } from "../../globals/status";
import type { AppDispatch } from "../store";
import { setError } from "../auth/LoginSlice";
import API from "../../http";

export interface User {
  id: number;
  name: string;
  username: string;
  mobilenumber: string;
  email: string;
  gender?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}

interface UserState {
  fullList: User[] | null;
  list: User[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
  totalCount: number;
  deletedstatus: boolean;
}

const initialState: UserState = {
  fullList: null,
  list: null,
  loading: false,
  error: null,
  status: Status.Loading,
  totalCount: 0,
  deletedstatus: false,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{ data: User[]; metaData: { total: number } }>
    ) {
      state.list = action.payload.data;
      state.totalCount = action.payload.metaData.total;
      state.status = Status.Success;
      state.loading = false;
      state.error = null;
    },
    setFullList(state, action: PayloadAction<User[]>) {
      state.fullList = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = Status.Error;
      state.loading = false;
    },
    setUserStatus(state, action: PayloadAction<StatusType>) {
      state.status = action.payload;
      state.loading = false;
    },
    updateuserdata(state, action: PayloadAction<User>) {
      const update = action.payload;
      const index = state.list?.findIndex((b) => b.id === update.id);
      if (index !== undefined && index !== -1 && state.list) {
        state.list[index] = update;
      }
    },
  },
});

export const { setUser, setFullList, setUserStatus, updateuserdata } =
  UserSlice.actions;
export default UserSlice.reducer;

export function fetchalluser() {
  return async function (dispatch: AppDispatch) {
    dispatch(setUserStatus(Status.Loading));
    try {
      const token = localStorage.getItem("jwt");

      const response = await axios.get(`${server_Url}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rawData = response.data.data;
      const total = response.data.metaData?.total || rawData.length;

      const formattedData: User[] = rawData.map((u: any) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        mobilenumber: u.mobile,
        email: u.email,
      }));

      dispatch(setFullList(formattedData));
      dispatch(setUser({ data: formattedData, metaData: { total } }));
    } catch (error) {
      dispatch(setUserStatus(Status.Error));
      dispatch(setError("Failed to fetch users"));
    }
  };
}

export function fetchUserById(Userid: number) {
  return async function fetchUserByIdThunk(dispatch: AppDispatch) {
    dispatch(setUserStatus(Status.Loading));
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch(setError("Please login..."));
      return Promise.reject("No Token");
    }
    try {
      const response = await axios.get(`${server_Url}/api/v1/users/${Userid}`);
      dispatch(setUser(response.data.data));
      dispatch(setUserStatus(Status.Success));
    } catch (error: any) {
      const message = error?.message || "failed to fetch branch by id";
      dispatch(setError(message));
    }
  };
}

// interface UpdateuserPaload{
//   userId:number;
//   data:Partial<User >
// }
export function updateuserdataThunk(userid: number, data: Partial<User>) {
  return async function (dispatch: AppDispatch) {
    dispatch(setUserStatus(Status.Loading));
    const token = localStorage.getItem("jwt");

    if (!token) {
      dispatch(setError("You need to login"));
      return Promise.reject("User is not logged in");
    }

    try {
      const response = await axios.put<User>(
        `${server_Url}/api/v1/users/${userid}`,
        data,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // const response = await API.patch(`/api/v1/users/${userid}`, data);
      dispatch(updateuserdata(response.data));
      dispatch(setUserStatus(Status.Success));
      return Promise.resolve(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to update user data";
      dispatch(setError(message));
      dispatch(setUserStatus(Status.Error));
      return Promise.reject(message);
    }
  };
}

export function deletedUserdata(userId: number, data: Partial<User>) {
  return async function deletedUserdataThunk(dispatch: AppDispatch) {
    dispatch(setUserStatus(Status.Loading));
    const token = localStorage.getItem("jwt");

    if (!token) {
      dispatch(setError("you need to login"));
      return Promise.reject("User is Not logged in");
    }
    try {
      const response = await axios.delete<User>(
        `${server_Url}/api/v1/users/${userId}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 201) {
        dispatch(setUserStatus(Status.Success));
      }
      else{
        dispatch(setUserStatus(Status.Error))
      }
    } catch (error:any) {
      const message = error?.response?.data?.message||"faile to update user data";
      dispatch(setError(message));
      dispatch(setUserStatus(Status.Error));
      return Promise.reject(message)
    }
  };
}

