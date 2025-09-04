import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { LogsResponse } from "../../globals/typeDeclaration";

import type {
  FetchParams,
  MetaData,
  PaginatedResponse,
} from "../../globals/Api Service/API_Services";
import { ScannedLogService } from "../../globals/Api Service/service";

interface LogsState {
  data: LogsResponse[];
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

export const fetchLogs = createAsyncThunk<
  PaginatedResponse<LogsResponse>,
  FetchParams,
  { rejectValue: string }
>("logs/fetchLogs", async (params, { rejectWithValue }) => {
  try {
    const response = await ScannedLogService.fetchPaginated(params);
    return {
      data: response.data,
      metaData: response.metaData,
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

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
    .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.metaData = action.payload.metaData;
        state.total = action.payload.metaData?.total || 0;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default logsSlice.reducer;
