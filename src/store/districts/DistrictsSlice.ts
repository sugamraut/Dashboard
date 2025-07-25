import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import type { getDistricts } from "../../globals/typeDeclaration";
import { Status, type StatusType } from "../../globals/status";
import type { AppDispatch } from "../store";

interface DistrictState {
  data: getDistricts | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
  totalCount: number; 
}

const initialState: DistrictState = {
  data: null,
  loading: false,
  error: null,
  status: Status.Loading,
  totalCount: 0,
};

const districtSlice = createSlice({
  name: "district",
  initialState,
  reducers: {
    setDistrict(state, action: PayloadAction<getDistricts>) {
      state.data = action.payload;
      state.status = Status.Success;
      state.loading = false;
      state.error = null;
    },
    setTotalCount(state, action: PayloadAction<number>) { // ✅ NEW
      state.totalCount = action.payload;
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
  },
});

export const { setDistrict, setStatus, setError, setTotalCount } = districtSlice.actions;
export default districtSlice.reducer;

export function fetchDistrictAsync(page = 1, rowsPerPage = 10, p0: string) {
  return async function fetchDistrictThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.Loading));
    try {
      const response = await axios.get(`${server_Url}/api/v1/districts`, {
        params: {
          page,
          rowsPerPage,
        },
      });

      if (response.status === 200 || response.status === 201) {
        dispatch(setDistrict(response.data.data));
        dispatch(setTotalCount(response.data.metaData.total));
        dispatch(setStatus(Status.Success));
      } else {
        dispatch(setError("Failed to fetch districts: " + response.status));
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      dispatch(setError(message));
    }
  };
}
