import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import API from "../../http";

export interface Permission {
  label: string | undefined;
  id: number;
  name: string;
  guardName: string;
  group: string;
  displayName: string;
  displayNameNp: string;
}

export interface MetaData {
  page: number;
  rowsPerPage: number;
  sortBy: number;
  sortOrder: string;
  total: number;
}

export interface PermissionsResponse {
  data: Permission[];
  metaData: MetaData;
}

interface FetchPermissionParams {
  page?: number;
  rowsPerPage?: number;
  sortBy?: string | null;
  sortOrder?: string;
  query?: string;
  filters?: Record<string, any>;
}

interface PermissionsState {
  data: Permission[];
  metaData: MetaData | null;
  groupedPermissions: Permission[];
   extraGroupsData: Permission[];
  loading: boolean;
  error: string | null;
}

const initialState: PermissionsState = {
  data: [],
  metaData: null,
  groupedPermissions: [],
  loading: false,
  error: null,
  extraGroupsData: []
};

export const fetchPermissions = createAsyncThunk<
  PermissionsResponse,
  FetchPermissionParams,
  { rejectValue: string }
>("permissions/fetchPermissions", async (params, thunkAPI) => {
  try {
    const {
      page = 1,
      rowsPerPage = 25,
      sortBy = null,
      sortOrder = "desc",
      query = "",
      filters = {},
    } = params;

    const response = await API.get(`/api/v1/permissions`, {
      params: {
        page,
        rowsPerPage,
        sortBy,
        sortOrder,
        query,
        filters: JSON.stringify(filters),
      },
    });

    const sortedData = response.data.data.sort(
      (a: { id: number }, b: { id: number }) => a.id - b.id
    );

    return {
      data: sortedData,
      metaData: response.data.metaData,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
});

export const updatePermission = createAsyncThunk<
  Permission,
  Permission,
  { rejectValue: string }
>("permissions/update", async (permissionData, { rejectWithValue }) => {
  try {
    const response = await API.put(
      `/api/v1/permissions/${permissionData.id}`,
      permissionData
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Update failed"
    );
  }
});

export const fetchPermissionsByGroup = createAsyncThunk<
  Permission[],
  void,
  { rejectValue: string }
>("permissions/fetchByGroup", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get(`/api/v1/permissions/groups`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch grouped permissions"
    );
  }
});

export const addPermission = createAsyncThunk<
  Permission,
  Permission,
  { rejectValue: string }
>("permissions/add", async (newPermission, { rejectWithValue }) => {
  try {
    const response = await API.post(`/api/v1/permissions`, newPermission);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to add permission"
    );
  }
});

export const fetchAllPermissions = createAsyncThunk<
  Permission[],
  void,
  { rejectValue: string }
>("permissions/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get(`/api/v1/permissions/all`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch all permissions"
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
      .addCase(
        fetchPermissions.fulfilled,
        (state, action: PayloadAction<PermissionsResponse>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.metaData = action.payload.metaData;
        }
      )
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch permissions";
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

      .addCase(fetchPermissionsByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPermissionsByGroup.fulfilled,
        (state, action: PayloadAction<Permission[]>) => {
          state.loading = false;
          state.groupedPermissions = action.payload;
        }
      )
      .addCase(fetchPermissionsByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch by group";
      })

      .addCase(addPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add permission";
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.extraGroupsData = action.payload;
      });
  },
});

export default permissionsSlice.reducer;
