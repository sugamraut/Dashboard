import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { Role } from "../../globals/typeDeclaration";
import { Status, type StatusType } from "../../globals/status";
import type {
  FetchParams,
  PaginatedResponse,
} from "../../globals/Api Service/API_Services";
import { RoleService } from "../../globals/Api Service/service";


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
  PaginatedResponse<Role>,
  FetchParams,
  { rejectValue: string }
>("role/fetch", async (params, { rejectWithValue }) => {
  try {
    // const response = await RoleService.fetchPaginated(params);
    const response = await RoleService.get("/",params)
    return {
      data: response.data,
      metaData: response.metaData,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "failed to fetch roles");
  }
});

export const fetchAllRole = createAsyncThunk<Role[]>(
  "fetch/Allrole",
  async (_, { rejectWithValue }) => {
    try {
      return await RoleService.get("/all");
    } catch (error: any) {
      return rejectWithValue(error.message || "failed to fetch all the data");
    }
  }
);

export const createRole = createAsyncThunk<
  Role,
  // { name: string; displayName: string; permissions: string[] },
  Role,
  { rejectValue: string }
>("roles/create", async (newRole, { rejectWithValue }) => {
  try {
    return await RoleService.create(newRole);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create role"
    );
  }
});


export const updateRole = createAsyncThunk<
  Role,
  Role, 
  { rejectValue: string }
>("roles/update", async (role, { rejectWithValue }) => {
  try {
    return await RoleService.update(role);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update role"
    );
  }
});


export const deletedRole = createAsyncThunk<
  Role,
  number,
  { rejectValue: string }
>("roles/delete", async (RoleDelete, { rejectWithValue }) => {
  try {
    return await RoleService.remove(RoleDelete);
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
