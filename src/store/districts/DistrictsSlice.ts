import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import type { DistrictType } from "../../globals/typeDeclaration";
import { Status, type StatusType } from "../../globals/status";
import type { AppDispatch } from "../store";

interface DistrictState {
  fullList: DistrictType[];
  list: DistrictType[];
  loading: boolean;
  error: string | null;
  status: StatusType;
  totalCount: number;
}

const initialState: DistrictState = {
  fullList: [],
  list: [],
  loading: false,
  error: null,
  status: Status.Loading,
  totalCount: 0,
};

const districtSlice = createSlice({
  name: "district",
  initialState,
  reducers: {
    setDistrict(
      state,
      action: PayloadAction<{ data: DistrictType[]; metaData: { total: number } }>
    ) {
      state.list = action.payload.data;
      state.totalCount = action.payload.metaData.total;
      state.status = Status.Success;
      state.loading = false;
      state.error = null;
    },
    setFullList(state, action: PayloadAction<DistrictType[]>) {
      state.fullList = action.payload;
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
    updateDistrictInStore(state, action: PayloadAction<DistrictType>) {
      const updated = action.payload;
      const index = state.list.findIndex((d) => d.id === updated.id);
      if (index !== -1) {
        state.list[index] = updated;
      }
    },
  },
});

export const {
  setDistrict,
  setFullList,
  setStatus,
  setError,
  updateDistrictInStore,
} = districtSlice.actions;

export default districtSlice.reducer;

const getToken = (): string | null => localStorage.getItem("jwt");

export const fetchDistrictAsync = (
  page = 1,
  rowsPerPage = 10,
  Id: string = "",
  search: string = ""
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.Loading));

    const token = getToken();
    if (!token) {
      dispatch(setError("No auth token found."));
      return;
    }

    try {
      const response = await axios.get(`${server_Url}/api/v1/districts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          rowsPerPage,
          id: Id || undefined,
          search: search || undefined,
        },
      });

      const sortedData = response.data.data.sort((a: DistrictType, b: DistrictType) => a.id - b.id);

      dispatch(setDistrict({
        data: sortedData,
        metaData: response.data.metaData,
      }));

      dispatch(setStatus(Status.Success));
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Fetch error";
      dispatch(setError(message));
    }
  };
};



export const updateDistrictAsync = (
  id: number | string,
  data: Partial<DistrictType>
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.Loading));

    const token = getToken();
    if (!token) {
      dispatch(setError("No auth token found."));
      return Promise.reject("No token");
    }

    try {
      const response = await axios.put<DistrictType>(
        `${server_Url}/api/v1/districts/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      dispatch(updateDistrictInStore(response.data));
      dispatch(setStatus(Status.Success));
      return Promise.resolve(response.data);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Update error";
      dispatch(setError(message));
      return Promise.reject(message);
    }
  };
};

export const fetchAllDistrictsAsync = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.Loading));

    try {
      const response = await axios.get(`${server_Url}/api/v1/districts/all`);

      if (response.status === 200 || response.status === 201) {
        dispatch(setFullList(response.data.data));
        dispatch(setStatus(Status.Success));
      } else {
        dispatch(setError("Failed to fetch full district list."));
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      dispatch(setError(message));
    }
  };
};
