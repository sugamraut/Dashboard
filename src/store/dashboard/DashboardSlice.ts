import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { dashboardData } from "../../globals/typeDeclaration";
import { dashboardService } from "../../globals/Api Service/service";
import type { FetchParams } from "../../globals/Api Service/API_Services";

interface dashboardState {
  list: dashboardData[];
  loading: boolean;
  error: string | null;
}

const initialState: dashboardState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchdashboarddata = createAsyncThunk<
  dashboardData[],
  Partial<FetchParams> | undefined,
  { rejectValue: string }
>("fetch/dashboard", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await dashboardService.fetchPaginated(params);
    return response.data ?? [];
  } catch (error: any) {
    return rejectWithValue(
      error.message || "failed to fetch the dashboard data"
    );
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchdashboarddata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdashboarddata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "unknown error";
      })
      .addCase(fetchdashboarddata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
