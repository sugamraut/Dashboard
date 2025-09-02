import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import { Status, type StatusType } from "../../globals/status";
import type { City } from "../../globals/typeDeclaration";
import API, { getAuthHeader } from "../../http";

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

export const fetchAllCities = createAsyncThunk<
  City[],
  void,
  { rejectValue: string }
>("city/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${server_Url}/api/v1/cities/all`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch all cities");
  }
});

export const fetchCityBypaginated = createAsyncThunk<
  { data: City[]; metaData: { total: number } },
  { districtId?: number; page: number; rowsPerPage: number; search?: string },
  { rejectValue: string }
>(
  "city/fetchcitybypaginated",
  async ({ districtId, page, rowsPerPage, search }, { rejectWithValue }) => {
    try {
      const filters: Record<string, any> = {};
      if (districtId) filters.districtId = districtId;
      if (search) filters.name = search;

      const response = await API.get(`/api/v1/cities`, {
        params: {
          page,
          rowsPerPage,
          filters: JSON.stringify(filters),
        },
        headers: {
          ...getAuthHeader(),
        },
      });

      return {
        data: response.data.data as City[],
        metaData: response.data.metaData,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch cities");
    }
  }
);

export const updatecity = createAsyncThunk<City, City, { rejectValue: string }>(
  "city/update",
  async (city, { rejectWithValue }) => {
    try {
      const response = await API.put(`/api/v1/cities/${city.id}`, city, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data.data as City;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update city");
    }
  }
);

export const createCity = createAsyncThunk<City, City, { rejectValue: string }>(
  "city/create",
  async (city, { rejectWithValue }) => {
    try {
      const response = await API.post(`/api/v1/cities`, city, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data.data as City;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create city");
    }
  }
);

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
      })
      .addCase(fetchAllCities.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload || "Failed to fetch cities";
      })

      .addCase(fetchCityBypaginated.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityBypaginated.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.totalCount = action.payload.metaData.total;
        state.status = Status.Success;
        state.loading = false;
      })
      .addCase(fetchCityBypaginated.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload || "Failed to fetch cities by district";
      })

      .addCase(updatecity.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(updatecity.fulfilled, (state, action) => {
        state.loading = false;
        state.status = Status.Success;

        const updatedCity = action.payload;
        if (!updatedCity) return;

        if (state.list) {
          const index = state.list.findIndex(
            (item) => item.id === updatedCity.id
          );
          if (index !== -1) {
            state.list[index] = updatedCity;
          } else {
            state.list.push(updatedCity);
          }
        }

        if (state.fullList) {
          const fullIndex = state.fullList.findIndex(
            (item) => item.id === updatedCity.id
          );
          if (fullIndex !== -1) {
            state.fullList[fullIndex] = updatedCity;
          }
        }
      })
      .addCase(updatecity.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload || "Failed to update city";
      })
      .addCase(createCity.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.loading = false;
        state.status = Status.Success;

        const newCity = action.payload;
        if (state.list) {
          state.list.push(newCity);
        } else {
          state.list = [newCity];
        }

        if (state.fullList) {
          state.fullList.push(newCity);
        } else {
          state.fullList = [newCity];
        }

        state.totalCount += 1;
      })
      .addCase(createCity.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload || "Failed to create city";
      });
  },
});

export const { setFullList } = citySlice.actions;
export default citySlice.reducer;
