import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import { Status, type StatusType } from "../../globals/status";
import type { City, StateType } from "../../globals/typeDeclaration";


interface CityState {
  fullList: City[] | null;
  list: City[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
  totalCount: number;
  state: StateType;
}

const initialState: CityState = {
  fullList: null,
  list: null,
  loading: false,
  error: null,
  status: Status.Loading,
  totalCount: 0,
  state: {
    id: 0,
    name: "",
    nameNp: "",
    nameCombined: "",
  },
};

export const fetchAllCities = createAsyncThunk<
  City[],
  void,
  { rejectValue: string }
>("city/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${server_Url}/api/v1/cities/all`);
    return response.data.data as City[];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch all cities");
  }
});

export const fetchCityByDistrictId = createAsyncThunk<
  { data: City[]; metaData: { total: number } },
  number,
  { rejectValue: string }
>("city/fetchByDistrict", async (districtId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${server_Url}/api/v1/cities`, {
      params: {
        page: 1,
        rowsPerPage: 25,
        filters: JSON.stringify({ districtId }),
      },
    });

    return {
      data: response.data.data as City[],
      metaData: response.data.metaData,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch cities by district"
    );
  }
});

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setFullList(state, action: PayloadAction<City[]>) {
      state.fullList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCities.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCities.fulfilled, (state, action) => {
        state.fullList = action.payload;
        state.list = action.payload;
        state.totalCount = action.payload.length;
        state.status = Status.Success;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllCities.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload || "Failed to fetch cities";
      });

    builder
      .addCase(fetchCityByDistrictId.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityByDistrictId.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.totalCount = action.payload.metaData.total;
        state.status = Status.Success;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCityByDistrictId.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload || "Failed to fetch cities by district";
      });
  },
});

export const { setFullList } = citySlice.actions;
export default citySlice.reducer;
