import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ActivityLog, ActivityUser } from "../../globals/typeDeclaration";

import { toast } from "react-toastify";
import type {
  FetchParams,
  MetaData,
  PaginatedResponse,
} from "../../globals/api_service/api_services";
import { ActivityService } from "../../globals/api_service/service";

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

// export const fetchActivityLog = createAsyncThunk<
//   PaginatedResponse<ActivityLog>,
//   FetchParams,
//   { rejectValue: string }
// >("ActivityLog/fetch", async (params, thunkAPI) => {
//   try {
//     const response =await ActivityService.get("/",params)
//     // return{
//     //   data:response.data,
//     //   metaData:response.metaData
//     // }
//     return response.data
//   } catch (error:any) {
//     return thunkAPI.rejectWithValue(
//       (toast.error(error.message)&&  error.response?.data?.message)||error.message||"something went wrong"
//     )
//   }
// })
export const fetchActivityLog = createAsyncThunk<
  PaginatedResponse<ActivityLog>,
  FetchParams | undefined,
  { rejectValue: string }
>("ActivityLog/fetch", async (params, thunkAPI) => {
  try {
    const filters = params?.filters
      ? { ...params.filters }
      : null;

    const queryParams = {
      page: params?.page,
      rowsPerPage: params?.rowsPerPage,
      sortBy: params?.sortBy || null,
      sortOrder: params?.sortOrder || "desc",
      query: params?.query || "",
      filters: JSON.stringify(filters),
    };

    const response = await ActivityService.get("", queryParams);
    return response ;
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
        state.metaData = action.payload.metaData;
      });
  },
});

export default ActivityLogSlice.reducer;
