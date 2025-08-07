import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { server_Url } from '../../globals/config';


export interface Permission {
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
  sortBy: string;
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
  loading: boolean;
  error: string | null;
}


const initialState: PermissionsState = {
  data: [],
  metaData: null,
  loading: false,
  error: null,
};

export const fetchPermissions = createAsyncThunk<
  PermissionsResponse,
  FetchPermissionParams
>(
  'permissions/fetchPermissions',
  async (params, thunkAPI) => {
    try {
      const token = localStorage.getItem('jwt');

      const {
        page = 1,
        rowsPerPage = 25,
        sortBy = null,
        sortOrder = 'desc',
        query = '',
        filters = {},
      } = params;

      const response = await axios.get<PermissionsResponse>(
        `${server_Url}/api/v1/permissions`,
        {
          params: {
            page,
            rowsPerPage,
            sortBy,
            sortOrder,
            query,
            filters: JSON.stringify(filters),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  const sortedData=response.data.data.sort(
    (a:{id:number},b:{id:number})=> a.id-b.id
  )
       return {
        data: sortedData,
        metaData: response.data.metaData,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);

export const updatePermission = createAsyncThunk<
  Permission,
  {id:number,
    rejectValue: string;
  }
>("permissions/update", async (permissionData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("jwt");

    const response = await axios.put<Permission>(
      `${server_Url}/api/v1/permissions/${permissionData.id}`,
      permissionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Update failed"
    );
  }
});



const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action: PayloadAction<PermissionsResponse>) => {
        state.loading = false;
        state.data = action.payload.data;
        state.metaData = action.payload.metaData;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePermission.fulfilled, (state, action: PayloadAction<Permission>) => {
      const index = state.data.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    })
    .addCase(updatePermission.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});


export default permissionsSlice.reducer;
