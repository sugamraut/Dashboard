import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  ActivityLog,
  ActivityUser,
} from "../../globals/typeDeclaration";

import { toast } from "react-toastify";
import type {
  FetchParams,
  MetaData,
  PaginatedResponse,
} from "../../globals/Api Service/API_Services";
import { ActivityService } from "../../globals/Api Service/service";

interface ActivityStatus {
  data: ActivityLog[];
  total: number;
  metaData: MetaData | null;
  loading: boolean;
  error: string | null;
  user: ActivityUser | null;
}

const initialState: ActivityStatus = {
  data: [],
  total: 0,
  metaData: null,
  loading: false,
  error: null,
  user: null,
};

export const fetchActivityLog = createAsyncThunk<
  PaginatedResponse<ActivityLog>,
  FetchParams,
  { rejectValue: string }
>("ActivityLog/fetch", async (params, thunkAPI) => {
  try {
    const response = await ActivityService.fetchPaginated(params);
    return {
      data: response.data,
      metaData: response.metaData,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      (toast.error(error.message) && error.response?.data?.message) ||
        error.message ||
        "something went wrong"
    );
  }
});

const ActivityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch logs";
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        // state.total = action.payload.total;
        state.metaData = action.payload.metaData;
      });
  },
});

export default ActivityLogSlice.reducer;
