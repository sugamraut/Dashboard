import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status, type StatusType } from "../../globals/status";
import type { getDistricts } from "../../globals/typeDeclaration";
import type { AppDispatch } from "../store";
import axios from "axios";
import { server_Url } from "../../globals/config";


interface districtState {
    data: getDistricts | null;
    loading: boolean;
    error: string | null;
    status: StatusType;
}

const initialState: districtState = {
    data: null,
    loading: false,
    error: null,
    status: Status.Loading
}

const districtSlice = createSlice({
    name: "district",
    initialState,
    reducers: {
        setDistrict(state, action: PayloadAction<getDistricts>) {
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
    }
});
export const { setDistrict, setStatus, setError } = districtSlice.actions;
export default districtSlice.reducer;


export function fetchDistrictAsync() {
    return async function fectchDistrictThunk(dispatch: AppDispatch) {
        dispatch(setStatus(Status.Loading));
        try {
            const response = await axios.get(`${server_Url}/api/v1/districts`)
            if (response.status === 200 || response.status === 201) {
                dispatch(setDistrict(response.data))
                dispatch(setStatus(Status.Success))
            } else {
                dispatch(setError("district operation is fail" + response.status))
            }
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "unknown error";
            dispatch(setError(message));

        }
    }
}

