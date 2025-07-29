// src/store/cities/CitiesSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import { Status, type StatusType } from "../../globals/status";
import type { AppDispatch } from "../store";

export interface City {
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
  districtId: number;
  code: string | null;
  district: string;
  state:string;
}

interface CityState {
  fullList: City[] | null;
  list: City[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
  totalCount: number;
}

const initialState: CityState = {
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
      states,
      action: PayloadAction<{ data: City[]; metaData: { total: number } }>
    ) {
      states.list= action.payload.data;
      states.totalCount = action.payload.metaData.total;
      states.loading = false;
      states.status=Status.Success;
      states.error=null
    },
    setFullList(states, action: PayloadAction<City[]>) {
      states.fullList = action.payload;
    },
    setCityStatus(states, action: PayloadAction<StatusType>) {
      states.status = action.payload;
      states.loading = action.payload === Status.Loading;
    },
    setCityError(states, action: PayloadAction<string>) {
      states.error = action.payload;
      states.status = Status.Error;
      states.loading = false;
    },
  },
});

export const { setCity, setFullList, setCityError, setCityStatus } = citySlice.actions;

export default citySlice.reducer;

export function fetchAllCitiesAsync() {
  return async (dispatch: AppDispatch) => {
    dispatch(setCityStatus(Status.Loading));
    try {
      const response = await axios.get(`${server_Url}/api/v1/cities/all`);
      const data: City[] = response.data.data;
      dispatch(setFullList(data));
      dispatch(setCity({ data, metaData: { total: data.length } }));
      dispatch(setCityStatus(Status.Success));
    } catch (err: any) {
      dispatch(setCityError(err.message || "Failed to fetch all cities"));
    }
  };
}


export function fetchCityByDistrictIdAsync(districtId: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setCityStatus(Status.Loading));
    try {
      const response = await axios.get(`${server_Url}/api/v1/cities`, {
        params: {
          page: 1,
          rowsPerPage: 25,
          filters: JSON.stringify({ districtId }),
        },
      });
      console.log(response)
      const { data, metaData } = response.data;
      dispatch(setCity({ data, metaData }));
      dispatch(setCityStatus(Status.Success));
      console.log(setCity);
    } catch (error: any) {
      dispatch(setCityError(error.message || "Failed to fetch cities by district"));
    }
  };
}
