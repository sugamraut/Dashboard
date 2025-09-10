import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { Log } from "../../globals/typeDeclaration";

import type {
  FetchParams,
  MetaData,
  PaginatedResponse,
} from "../../globals/api_service/api_services";
import { ScannedLogService } from "../../globals/api_service/service";

interface LogsState {
  data: Log[];
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
  PaginatedResponse<Log>,
  FetchParams | undefined,
  { rejectValue: string }
>("scannedLog/fetchLogs", async (params, thunkAPI) => {
  try {
    const filters = params?.filters
      ? { ...params.filters, type: 1 }
      : { type: 1 };

    const queryParams = {
      page: params?.page,
      rowsPerPage: params?.rowsPerPage,
      sortBy: params?.sortBy || null,
      sortOrder: params?.sortOrder || "desc",
      query: params?.query || "",
      filters: JSON.stringify(filters),
    };

    const response = await ScannedLogService.get("", queryParams);
    return response as PaginatedResponse<Log>;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch logs");
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
