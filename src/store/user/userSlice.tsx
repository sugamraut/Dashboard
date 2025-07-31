import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import { Status, type StatusType } from "../../globals/status";
import type { AppDispatch } from "../store";
import { setError } from "../auth/LoginSlice";

export interface User {
  id: number;
  name: string;
  username: string;
  mobilenumber: string;
  email: string;
}

interface UserState {
  fullList: User[] | null;
  list: User[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
  totalCount: number;
}

const initialState: UserState = {
  fullList: null,
  list: null,
  loading: false,
  error: null,
  status: Status.Loading,
  totalCount: 0,
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
  },
});

export const { setUser, setFullList, setUserStatus } = UserSlice.actions;
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

export function fetchUserById(Userid:number) {
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
      dispatch(setUserStatus(Status.Success))
    } catch (error:any) {
   const message= error?.message||"failed to fetch branch by id"
   dispatch(setError(message))
    }
  };
}
