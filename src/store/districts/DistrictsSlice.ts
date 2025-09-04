import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API, { getAuthHeader } from "../../http";
import type { DistrictType } from "../../globals/typeDeclaration";
import { Status, type StatusType } from "../../globals/status";
import type {
  FetchParams,
  PaginatedResponse,
} from "../../globals/Api Service/API_Services";
import { DistrictService } from "../../globals/Api Service/service";

export const fetchDistrictAsync = createAsyncThunk<
  PaginatedResponse<DistrictType>,
  FetchParams,
  { rejectValue: string }
>("district/fetch", async (params, thunkAPI) => {
  try {
    const response = await DistrictService.fetchPaginated(params);

    const sortedData = response.data.sort(
      (a: { id: number }, b: { id: number }) => a.id - b.id
    );

    return {
      data: sortedData,
      metaData: response.metaData,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
});

export const fetchAllDistrictsAsync = createAsyncThunk(
  "district/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await DistrictService.fetchAll();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  }
);

export const fetchDistrictsByStateIdAsync = createAsyncThunk(
  "district/fetchByStateId",
  async (
    { stateId, page, limit }: { stateId: number; page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.get(
        `/districts/state/${stateId}?page=${page}&limit=${limit}`,
        {
          headers: getAuthHeader(),
        }
      );

      const sortedData = response.data.sort(
        (a: DistrictType, b: DistrictType) => a.id - b.id
      );

      return {
        data: sortedData,
        metaData: { total: sortedData.length },
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  }
);

export const fetchDistrictByIdAsync = createAsyncThunk(
  "district/fetchById",
  async (districtId: number, { rejectWithValue }) => {
    try {
      return await DistrictService.getById(districtId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  }
);

export const updateDistrictAsync = createAsyncThunk<
  DistrictType,
  DistrictType,
  { rejectValue: string }
>("district/update", async (updateDistrict, { rejectWithValue }) => {
  try {
    return await DistrictService.update(updateDistrict);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Update error"
    );
  }
});

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
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchDistrictAsync.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistrictAsync.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.totalCount = action.payload.metaData.total;
        state.status = Status.Success;
        state.loading = false;
      })
      .addCase(fetchDistrictAsync.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllDistrictsAsync.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDistrictsAsync.fulfilled, (state, action) => {
        state.fullList = action.payload;
        state.status = Status.Success;
        state.loading = false;
      })
      .addCase(fetchAllDistrictsAsync.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchDistrictsByStateIdAsync.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistrictsByStateIdAsync.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.totalCount = action.payload.metaData.total;
        state.status = Status.Success;
        state.loading = false;
      })
      .addCase(fetchDistrictsByStateIdAsync.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchDistrictByIdAsync.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistrictByIdAsync.fulfilled, (state, action) => {
        state.list = [action.payload];
        state.totalCount = 1;
        state.status = Status.Success;
        state.loading = false;
      })
      .addCase(fetchDistrictByIdAsync.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateDistrictAsync.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDistrictAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((d) => d.id === updated.id);
        if (index !== -1) {
          state.list[index] = updated;
        }
        state.status = Status.Success;
        state.loading = false;
      })
      .addCase(updateDistrictAsync.rejected, (state, action) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default districtSlice.reducer;
