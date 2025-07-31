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
      action: PayloadAction<{ data: DistrictType[]; metaData: { total: number }}>
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
     setDistrictById(state, action:PayloadAction<DistrictType>) {
      state.list = [action.payload];
        state.totalCount = 1; 
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
  setDistrictById,
  updateDistrictInStore,
} = districtSlice.actions;

export default districtSlice.reducer;

const getToken = (): string | null => localStorage.getItem("jwt");

export const fetchDistrictAsync = (
  page = 1,
  rowsPerPage = 25,
  stateId: string | number = "",
  search: string = "",
  id?: number
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.Loading));

    const token = getToken();
    if (!token) {
      dispatch(setError("No auth token found."));
      dispatch(setStatus(Status.Error));
      return;
    }

    try {
      const params: any = {
        page,
        rowsPerPage,
        stateId: stateId || undefined,
      };

      if (id !== undefined) {
        params.id = id;
      } else if (search) {
        params.search = search;
      }

      const response = await axios.get<DistrictType>(
        `${server_Url}/api/v1/districts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      const sortedData = response.data.data.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );

      dispatch(
        setDistrict({
          data: sortedData,
          metaData: response.data.metaData,
        })
      );

      dispatch(setStatus(Status.Success));
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Fetch error";
      dispatch(setError(message));
      dispatch(setStatus(Status.Error));
    }
  };
};


export const updateDistrictAsync = ({
  id,
  data,
}: {
  id: number | string;
  data: Partial<DistrictType>;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.Loading));

    const token = localStorage.getItem("jwt");
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

      console.log("Update success:", response.data);

      dispatch(updateDistrictInStore(response.data));
      dispatch(setStatus(Status.Success));
      return Promise.resolve(response.data);
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
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
export const fetchDistrictsByStateIdAsync = (stateId: number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.Loading));

    try {
      const token = getToken(); 
      const response = await axios.get(`${server_Url}/api/v1/districts/state/${stateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedData = response.data.sort((a: DistrictType, b: DistrictType) => a.id - b.id);

      dispatch(setDistrict({ data: sortedData, metaData: { total: sortedData.length } }));
      dispatch(setStatus(Status.Success));
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Unknown error";
      dispatch(setError(message));
    }
  };
};
  

export const fetchDistrictByIdAsync = (districtId: number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.Loading));

    try {
      const response = await axios.get<DistrictType>(
        `${server_Url}/api/v1/districts/${districtId}`
      );
      dispatch(setDistrictById(response.data));
      dispatch(setStatus(Status.Success));
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Unknown error";
      dispatch(setError(message));
    }
  };
};

