import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { LogsResponse, MetaData } from "../../globals/typeDeclaration";
import API from "../../http";

interface LogsState {
  data: LogsResponse["data"];
  total: number;
  metaData: MetaData | null;
  loading: boolean;
  error: string | null;
}

const initialState: LogsState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
  metaData: null,
};

interface FetchLogsParams {
  page?: number;
  rowsPerPage?: number;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc";
  query?: string;
  filters?: Record<string, any>;
}

export const fetchLogs = createAsyncThunk<LogsResponse, FetchLogsParams>(
  "logs/fetchLogs",
  async (params, { rejectWithValue }) => {
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const logsSlice = createSlice({
  name: "scannedLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLogs.fulfilled,
        (state, action: PayloadAction<LogsResponse>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.total = action.payload.total;
          state.metaData=action.payload.metaData;
        }
      )
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default logsSlice.reducer;
