import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import { Status, type StatusType } from "../../globals/status";
import type { AppDispatch } from "../store";

export interface City {
  state: string;
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
  districtId: number;
  code: string;
  district: string;
}

interface CityState {
  data: City[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
}

const initialState: CityState = {
  data: null,
  loading: false,
  error: null,
  status: Status.Loading,
};


const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCity(state, action: PayloadAction<City[]>) {
      state.data = action.payload;
      state.status = Status.Success;
      state.loading = false;
      state.error = null;
    },
    setCityStatus(state, action: PayloadAction<StatusType>) {
      state.status = action.payload;
      state.loading = action.payload === Status.Loading;
    },
    setCityError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = Status.Error;
      state.loading = false;
    },
  },
});

export const { setCity, setCityStatus, setCityError } = citySlice.actions;
export default citySlice.reducer;


export function fetchCityAsync() {
  return async function fetchCityThunk(dispatch: AppDispatch) {
    dispatch(setCityStatus(Status.Loading));
    try {
      const response = await axios.get(`${server_Url}/api/v1/cities/all`);
      if (response.status === 200 || response.status === 201) {
        dispatch(setCity(response.data.data)); 
        dispatch(setCityStatus(Status.Success));
      } else {
        dispatch(setCityError("Failed to fetch cities: " + response.status));
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      dispatch(setCityError(message));
    }
  };
}
