import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { MetaData } from "../../globals/typeDeclaration";
import API from "../../http";

interface Setting {
  id: number;
  name: string;
  description: string;
  value: string;
}

interface settingState {
  data: Setting[];
  metaData: MetaData | null;
  total: number;
  loading: boolean;
  error: string | null;
}
const initialState: settingState = {
  data: [],
  total: 0,
  metaData: null,
  loading: false,
  error: null,
};

interface FetchLogsParams {
  page?: number;
  rowPerPage?: number;
  sortBy?: string | null;
  sortOrder?: "asc" | "dec";
  query?: string;
  filters?: Record<string, any>;
}

export const fetchsetting = createAsyncThunk<settingState, FetchLogsParams>(
  "fetch/setting",
  async (params, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/v1/settings`, {
        params: {
          page: params.page ?? 1,
          rowPerPage: params.rowPerPage ?? 25,
          sortBy: params.sortBy ?? null,
          sortOrder: params.sortOrder ?? "dec",
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

const SettingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchsetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchsetting.fulfilled, (state, action) => {
        (state.loading = false), (state.data = action.payload.data);
        state.metaData = action.payload.metaData;
        state.error = null;
        state.total = action.payload.total;
        
      });
  },
});

export default SettingSlice.reducer;
