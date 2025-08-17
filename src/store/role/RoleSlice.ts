import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import API from "../../http";
import type { Role } from "../../globals/typeDeclaration";
import { Status, type StatusType } from "../../globals/status";

// interface FetchRolesParams {
//   page?: number;
//   rowsPerPage?: number;
//   sortBy: string;
//   sortOrder: "asc" | "dec";
// }

export interface RolesState {
  length: number;
  list: Role[];
  fullList: Role[];
  loading: boolean;
  error: string | null;
  totalcount: number;
  status: StatusType;
}

const initialState: RolesState = {
  list: [],
  fullList: [],
  loading: false,
  error: null,
  totalcount: 0,
  status: Status.Loading,
  length: 0,
};

export const fetchRoles = createAsyncThunk<
  { data: Role[]; metaData: { total: number } },
  { page?: number; rowsPerPage?: number },
  { rejectValue: string }
>(
  "role/fetch",
  async ({ page, rowsPerPage } = {}, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/v1/roles`, {
        params: { page, rowsPerPage },
      });
      return {
        data: response.data.data,
        metaData: response.data.metaData,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "failed to fetch roles");
    }
  }
);


const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = Status.Success;
        state.loading = false;
        state.list = action.payload.data;
        state.totalcount = action.payload.metaData.total;
      })
      .addCase(fetchRoles.rejected, (state, action: PayloadAction<any>) => {
        state.status = Status.Error;
        state.loading = false;
        state.error = action.payload || "faied to load the roles ";
      });
  },
});

export default rolesSlice.reducer;
