import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API, { getAuthHeader } from "../../http";

interface dashboardData {
  title: string;
  count: number;
  changeValue: number;
  color: any;
}

interface dashboardState {
  list: dashboardData[];
  loading: boolean;
  error: string | null;
}

interface FetchParams {
  page: number;
  rowsPerPage: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}
const initialState: dashboardState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchdashboarddata = createAsyncThunk<
  dashboardData[],
  // FetchParams,
  void,
  { rejectValue: string }
>(
  "fetch/dashboard",
  async (
    // { page, rowsPerPage, sortBy, sortOrder }: FetchParams,
    _,
    { rejectWithValue }
  ) => {
    try {
      const response = await API.get(`/api/v1/dashboard-data`,{
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data.data ?? [];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "failed to fetch the dashoard data"
      );
    }
  }
);

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
