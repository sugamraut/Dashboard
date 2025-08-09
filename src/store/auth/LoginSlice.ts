import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status, type StatusType } from "../../globals/status";
import type { authItem } from "../../globals/typeDeclaration";
import type { AppDispatch } from "../store";
import axios from "axios";
import {server_Url} from "../../globals/config"


interface authState {
    data: authItem | null;
    loading: boolean;
    error: string | null;
    status: StatusType;
    accessToken:string
}

const initialState: authState = {
    data: null,
    loading: false,
    error: null,
    status: Status.Loading,
    accessToken: ""
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<authItem>) {
            state.data = action.payload;
            state.status = Status.Success;
            state.error = null;
            state.loading = false;
        },
        setStatus(state, action: PayloadAction<StatusType>) {
            state.status = action.payload;
            state.loading = action.payload === Status.Loading;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.status = Status.Error;
            state.loading = false;
        },
        setToken(state,action:PayloadAction<string>){
            state.accessToken=action.payload
        }
    },
});

export const { setAuth, setStatus, setError,setToken } = authSlice.actions;

export default authSlice.reducer;

export function fetchAuthAsync(data: { username: string; password: string; }) {
    return async function fetchAuthThunk(dispatch: AppDispatch) {
        dispatch(setStatus(Status.Loading));
        try {
            const response =await axios.post(`${server_Url}/api/v1/auth/login`,data)

            if (response.status === 200 || response.status === 201) {
                dispatch(setToken(response.data.accessToken))
                localStorage.setItem("jwt", response.data.accessToken);
                dispatch(setAuth(response.data));
                dispatch(setStatus(Status.Success))
            } else {
                console.warn("Login failed with status:", response.status);
                dispatch(setError("Login failed with status: " + response.status));
            }
        } catch (error: any) {
            console.error("Login request error:", error);
            const message = error.response?.data?.message || error.message || "Unknown error";
            dispatch(setError(message));
        }
    };
}
