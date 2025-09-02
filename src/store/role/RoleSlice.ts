import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import API, { getAuthHeader } from "../../http";
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
>("role/fetch", async ({ page, rowsPerPage } = {}, { rejectWithValue }) => {
  try {
    const response = await API.get(`/api/v1/roles`, {
      params: { page, rowsPerPage },
      headers: {
        ...getAuthHeader(),
      },
    });
    return {
      data: response.data.data,
      metaData: response.data.metaData,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "failed to fetch roles");
  }
});

export const fetchAllRole = createAsyncThunk<Role[]>(
  "fetch/Allrole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/role/all", {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data.data as Role[];
    } catch (error: any) {
      return rejectWithValue(error.message || "failed to fetch all the data");
    }
  }
);

export const createRole = createAsyncThunk<
  Role,
  { name: string; displayName: string; permissions: string[] },
  { rejectValue: string }
>("roles/create", async (data, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/v1/roles", data, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data as Role;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create role"
    );
  }
});

export const updateRole = createAsyncThunk<
  Role,
  { userId: number; data: Partial<Role> },
  { rejectValue: string }
>("roles/update", async ({ userId, data }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/api/v1/roles/${userId}`, data, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data as Role;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update role"
    );
  }
});

export const deletedRole = createAsyncThunk<
  void,
  { userId: number },
  { rejectValue: string }
>("roles/delete", async ({ userId }, { rejectWithValue }) => {
  try {
    await API.delete(`/api/v1/roles/${userId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete role"
    );
  }
});

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
      })
      .addCase(fetchAllRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRole.fulfilled, (state, action) => {
        state.loading = false;
        state.fullList = action.payload;
      })
      .addCase(fetchAllRole.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })

      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.loading = false;
        state.list.push(action.payload);
        state.fullList.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.loading = false;
        const updated = action.payload;

        state.list = state.list.map((role) =>
          role.id === updated.id ? updated : role
        );
        state.fullList = state.fullList.map((role) =>
          role.id === updated.id ? updated : role
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update role";
      })
      .addCase(deletedRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletedRole.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const id = action.payload;
        state.list = state.list.filter((role) => role.id !== id);
        state.fullList = state.fullList.filter((role) => role.id !== id);
      })
      .addCase(deletedRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete role";
      });
  },
});

export default rolesSlice.reducer;
