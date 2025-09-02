import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  ActivityLog,
  ActivityResponse,
  ActivityUser,
  MetaData,
} from "../../globals/typeDeclaration";
import API, { getAuthHeader } from "../../http";
import { toast } from "react-toastify";

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
  FetchLogsParams,
  { rejectValue: string }
>(
  "ActivityLog/fetch",
  async (
    {
      page = 1,
      rowsPerPage = 25,
      sortBy = null,
      sortOrder = "desc",
      query = "",
      filters = {},
    },
    { rejectWithValue }
  ) => {
    const token = getAuthHeader();
    if(!token){
      toast.error("No auth token found")
    }
    try {
      const response = await API.get(`/api/v1/logs`, {
        params: {
          page,
          rowsPerPage,
          sortBy,
          sortOrder,
          query,
          filters: JSON.stringify(filters),
        },
        headers:{
          ...getAuthHeader()
        }
      });

      return response.data as ActivityResponse;
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || error.message || "Unknown error";
      return rejectWithValue(errorMessage);
    }
  }
);

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
        state.total = action.payload.total;
        state.metaData = action.payload.metaData;

      });
  },
});

export default ActivityLogSlice.reducer;
