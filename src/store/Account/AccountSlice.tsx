import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import API from "../../http";

export interface AccountType {
  id: number;
  title: string;
  Details?: string;
  code?: string;
  description?: string;
  details?: string;
  interest?: string;
}

interface FetchParams {
  page: number;
  rowsPerPage: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}
export interface UploadedFile {
  fileKey: string;
  originalName: string;
  id: number;
  createdDate: string;
  updatedDate: string;
  isDeleted: number;
}

interface AccountTypeResponse {
  data: AccountType[];
  total: number;
}

interface AccountTypesState {
  metaData: any;
  data: AccountType[];
  total: number;
  loading: boolean;
  error: string | null;
  selected: AccountType | null;
  uploadedFiles?: UploadedFile[];
}

interface AccountTypesState {
  data: AccountType[];
  total: number;
  loading: boolean;
  error: string | null;
  selected: AccountType | null;
}

const initialState: AccountTypesState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
  selected: null,
  uploadedFiles: [],
  metaData: [],
};

export const fetchAccountTypes = createAsyncThunk<
  AccountTypeResponse,
  FetchParams,
  { rejectValue: string }
>(
  "accountTypes/fetchAll",
  async ({ page, rowsPerPage, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      const resp = await axios.get<AccountTypesState>(
        `${server_Url}/api/v1/account-types`,
        {
          params: { page, rowsPerPage, sortBy, sortOrder },
        }
      );
      const data = resp.data.data ?? [];
      const total = Number(resp.data.metaData?.total ?? 0);
      return { data, total };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch account types");
    }
  }
);

export const fetchAccountTypeById = createAsyncThunk<
  AccountType,
  number,
  { rejectValue: string }
>("accountTypes/fetchById", async (id, { rejectWithValue }) => {
  try {
    const resp = await axios.get(`${server_Url}/api/v1/account-types/${id}`);
    return resp.data.data as AccountType;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch account type");
  }
});

export const updateAccountType = createAsyncThunk<
  AccountType,
  AccountType,
  { rejectValue: string }
>("accountTypes/update", async (accountType, { rejectWithValue }) => {
  try {
    const resp = await axios.put(
      `${server_Url}/api/v1/account-types/${accountType.id}`,
      accountType
    );
    return resp.data.data as AccountType;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update account type");
  }
});

export const deleteAccountType = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("accountTypes/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${server_Url}/api/v1/account-types/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete account type");
  }
});

export const fetchAccountTypeFiles = createAsyncThunk<
  UploadedFile[],
  void,
  { rejectValue: string }
>("accountTypes/fetchFiles", async (_, { rejectWithValue }) => {
  try {
    const resp = await axios.get(
      `${server_Url}/api/v1/file-upload/ACCOUNT-TYPE`
    );
    return resp.data ;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch uploaded files");
  }
});

export const postTheData=createAsyncThunk<AccountType,{rejectValue:string}>(
  "accountType/postfile",async(_,{rejectWithValue})=>{
    try {
      const resp= await API.post("/api/v1/account-types")
      return resp.data;

    } catch (error) {
      
    }
  }
)

const accountTypesSlice = createSlice({
  name: "accountTypes",
  initialState,
  reducers: {
    // clearSelected(state) {
    //   state.selected = null;
    //   state.error = null;
    //   state.loading = false;
    // },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchAccountTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchAccountTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      .addCase(fetchAccountTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(fetchAccountTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchAccountTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      .addCase(updateAccountType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccountType.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.data.findIndex((item) => item.id === updated.id);
        if (index !== -1) {
          state.data[index] = updated;
        } else {
          state.data.push(updated);
        }

        if (state.selected?.id === updated.id) {
          state.selected = updated;
        }
      })
      .addCase(updateAccountType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update account type";
      })

      .addCase(deleteAccountType.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        if (state.selected?.id === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteAccountType.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete account type";
      })
      .addCase(fetchAccountTypeFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountTypeFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFiles = action.payload;
      })
      .addCase(fetchAccountTypeFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch uploaded files";
      });
  },
});

export default accountTypesSlice.reducer;
