import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  ActivityLog,
  ActivityResponse,
  ActivityUser,
  MetaData,
} from "../../globals/typeDeclaration";
import API from "../../http";

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

interface FetchLogsParams {
  page?: number;
  rowsPerPage?: number;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc";
  query?: string;
  filters?: Record<string, any>;
}

export const fetchActivityLog = createAsyncThunk<
  ActivityResponse,
  FetchLogsParams
>("ActivityLog/fetch", async (params, { rejectWithValue }) => {
  try {
    const response = await API.get(`/api/v1/logs`, {
      params: {
        page: params.page ?? 1,
        rowsPerPage: params.rowsPerPage ?? 25, 
        sortBy: params.sortBy ?? null,
        sortOrder: params.sortOrder ?? "desc",
        query: params.query ?? "",
        filters: JSON.stringify(params.filters ?? {}),
      },
    });

    return response.data as ActivityResponse;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error.message || "Unknown error"
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
        state.error = action.payload as string;
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.metaData = action.payload.metaData;

      
        const firstLogUser = action.payload.data?.[0]?.user;
        if (firstLogUser) {
          state.user = {
            name: firstLogUser.name,
            username: firstLogUser.username,
          };
        } else {
          state.user = null;
        }
      });
  },
});

export default ActivityLogSlice.reducer;
