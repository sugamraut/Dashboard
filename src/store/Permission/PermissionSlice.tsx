import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Permission } from "../../globals/typeDeclaration";

import type {
  FetchParams,
  MetaData,
  PaginatedResponse,
} from "../../globals/Api Service/API_Services";
import { PermissionService } from "../../globals/Api Service/service";

export interface PermissionsState {
  data: Permission[];
  fulllist: Permission[] | null;
  metaData: MetaData | null;
  groupedPermissions: Permission[];
  ActionData: Permission[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: PermissionsState = {
  data: [],
  fulllist: [],
  metaData: null,
  groupedPermissions: [],
  loading: false,
  error: null,
  ActionData: [],
};

export const fetchPermissions = createAsyncThunk<
  PaginatedResponse<Permission>,
  FetchParams,
  { rejectValue: string }
>("permissions/fetchPermissions", async (params, thunkAPI) => {
  try {
    const response = await PermissionService.fetchPaginated(params);

    const sortedData = response.data.sort(
      (a: { id: number }, b: { id: number }) => a.id - b.id
    );

    return {
      data: sortedData,
      metaData: response.metaData,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
});

export const fetchAllPermissions = createAsyncThunk<
  Permission[],
  void,
  { rejectValue: string }
>("permissions/fetchAll", async (_, thunkAPI) => {
  try {
    return await PermissionService.fetchAll();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Failed to fetch all permissions"
    );
  }
});

export const fetchPermissionsByGroup = createAsyncThunk<
  Permission[],
  void,
  { rejectValue: string }
>("permissions/fetchByGroup", async (_, thunkAPI) => {
  try {
    return await PermissionService.fetchGrouped();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Failed to fetch grouped permissions"
    );
  }
});

export const addPermission = createAsyncThunk<
  Permission,
  Permission,
  { rejectValue: string }
>("permissions/add", async (newPermission, thunkAPI) => {
  try {
    return await PermissionService.create(newPermission);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Failed to add permission"
    );
  }
});

export const updatePermission = createAsyncThunk<
  Permission,
  Permission,
  { rejectValue: string }
>("permissions/update", async (updatedPermission, thunkAPI) => {
  try {
    return await PermissionService.update(updatedPermission);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Failed to update permission"
    );
  }
});

export const deletePermission = createAsyncThunk<
  Permission,
  Permission,
  { rejectValue: string }
>("permissions/delete", async (permissionToDelete, thunkAPI) => {
  try {
    return await PermissionService.remove(permissionToDelete);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Failed to delete permission"
    );
  }
});

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.metaData = action.payload.metaData;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch permissions";
      })

      .addCase(fetchPermissionsByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsByGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groupedPermissions = action.payload;
      })
      .addCase(fetchPermissionsByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch grouped permissions";
      })

      .addCase(addPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add permission";
      })

      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update permission";
      })

      .addCase(deletePermission.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload.id);
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete permission";
      })

      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.fulllist = action.payload;
        state.ActionData = action.payload;
      });
  },
});

export default permissionsSlice.reducer;
