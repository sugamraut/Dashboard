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
  fullList: City[] | null;
  list: City[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
  totalCount: number;
}

const initialState: CityState = {
  data: null,
  fullList: null,
  list: null,
  loading: false,
  error: null,
  status: Status.Loading,
  totalCount: 0,
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCity(
      state,
      action: PayloadAction<{ data: City[]; metaData: { total: number } }>
    ) {
      state.list = action.payload.data;
      state.totalCount = action.payload.metaData.total;
      state.loading = false;
      state.status = Status.Success;
      state.error = null;
    },
    setFullList(state, action: PayloadAction<City[]>) {
      state.fullList = action.payload;
    },
    setCityById(state, action: PayloadAction<City[]>) {
      state.list = action.payload;
      state.totalCount = action.payload.length;
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

export const {
  setCity,
  setFullList,
  setCityById,
  setCityError,
  setCityStatus,
} = citySlice.actions;

export default citySlice.reducer;


export function fetchCityByDistrictIdAsync(districtId: number) {
  return async function fetchCityByDistrictThunk(dispatch: AppDispatch) {
    dispatch(setCityStatus(Status.Loading));
    try {
      const response = await axios.get(`${server_Url}/api/v1/cities`, {
        params: {
          page: 1,
          rowsPerPage: 25,
          filters: JSON.stringify({ districtId }),
        },
      });

      if (response.status === 200 || response.status === 201) {
        const { data, metaData } = response.data;
        dispatch(setCity({ data, metaData }));
        dispatch(setCityStatus(Status.Success));
      } else {
        dispatch(
          setCityError("Failed to fetch district cities: " + response.status)
        );
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      dispatch(setCityError(message));
    }
  };
}


export function fetchAllCitiesAsync() {
  return async function fetchAllCitiesThunk(dispatch: AppDispatch) {
    dispatch(setCityStatus(Status.Loading));
    try {
      const response = await axios.get(`${server_Url}/api/v1/cities/all`);
      if (response.status === 200) {
        const data = response.data.data;
        const metaData = response.data.metaData || { total: data.length }; 
        dispatch(setFullList(data));
        dispatch(setCity({ data, metaData }));
        dispatch(setCityStatus(Status.Success));
      } else {
        dispatch(setCityError("Failed to fetch cities"));
      }
    } catch (err: any) {
      dispatch(setCityError(err.message));
    }
  };
}
