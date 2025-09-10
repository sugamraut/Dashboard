import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API, { getAuthHeader } from "../../http";
import { toast } from "react-toastify";
import type { AccountType } from "../../globals/typeDeclaration";
import { AccountService } from "../../globals/api_service/service";
import type {
  PaginatedResponse,
  FetchParams,
  MetaData,
} from "../../globals/api_service/api_services";

export interface UploadedFile {
  imageUrl: string;
  fileKey: string;
  originalName: string;
  id: number;
  createdDate: string;
  updatedDate: string;
  isDeleted: number;
  filePath: string;
}

interface AccountTypesState {
  metaData: MetaData | null;
  data: AccountType[];
  total: number;
  loading: boolean;
  error: string | null;
  selected: AccountType | null;
  uploadedFiles?: UploadedFile[];
}

const initialState: AccountTypesState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
  selected: null,
  uploadedFiles: [],
  metaData: null,
};

// export const fetchAccountTypes = createAsyncThunk<
//   // AccountTypeResponse,
//   PaginatedResponse <AccountType>,
//   FetchParams,
//   { rejectValue: string }
// >("accountTypes/fetchAll", async (params, thunkAPI) => {
//   const token = getAuthHeader();
//   if (!token) {
//     toast.error("No auth token found");
//   }
//   try {
//     const response = await AccountService.fetchPaginated(params);

//     return {
//       data:response.data,
//       metaData:response.metaData
//     }
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(
//       error.response?.data?.message || error.message || "Something went wrong"
//     );
//   }
// });
export const fetchAccountTypes = createAsyncThunk<
  // AccountTypeResponse,
  PaginatedResponse<AccountType>,
  FetchParams,
  { rejectValue: string }
>("accountTypes/fetchAll", async (params, thunkAPI) => {
  try {
    const response = await AccountService.get("/", params);
    return {
      data: response.data,
      metaData: response.metaData,
    };
  } catch (error:any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch permissions"
    );
  }
});

export const fetchAccountTypeById = createAsyncThunk<
  AccountType,
  number,
  { rejectValue: string }
>("accountTypes/fetchById", async (id, { rejectWithValue }) => {
  try {
    const resp = await API.get(`/account-types/${id}`);
    return resp.data.data as AccountType;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch account type");
  }
});

export const updateAccountType = createAsyncThunk<
  AccountType,
  AccountType & { file?: File },
  { rejectValue: string }
>("accountTypes/update", async (accountType, { rejectWithValue, dispatch }) => {
  try {
    let imageFileId = accountType.imageUrl;

    if (accountType.file) {
      const uploaded = await dispatch(uploadFile(accountType.file)).unwrap();
      imageFileId = String(uploaded.id);
    }

    const payload = {
      ...accountType,
      imageUrl: imageFileId,
    };

    const resp = await API.put(`/account-types/${accountType.id}`, payload, {
      headers: {
        ...getAuthHeader(),
      },
    });

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
    const response = await API.delete(`/account-types/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete account type");
  }
});

export const uploadFile = createAsyncThunk<
  UploadedFile,
  File,
  { rejectValue: string }
>("accountTypes/uploadFile", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const resp = await API.post(`/file-upload/ACCOUNT-TYPE`, formData, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeader() },
    });
    return resp.data as UploadedFile;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to upload file");
  }
});

export const createAccountTypeWithUpload = createAsyncThunk<
  AccountType,
  Partial<AccountType> & { file?: File },
  { rejectValue: string }
>(
  "accountTypes/createWithUpload",
  async (accountType, { rejectWithValue, dispatch }) => {
    try {
      if (!accountType.file) {
        return rejectWithValue("No file provided for upload");
      }

      const uploaded = await dispatch(uploadFile(accountType.file)).unwrap();

      const resp = await API.post(
        `/account-types`,
        {
          ...accountType,
          imageUrl: String(uploaded.id),
        },
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      return resp.data.data as AccountType;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to create account type"
      );
    }
  }
);

const accountTypesSlice = createSlice({
  name: "accountTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAccountTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.metaData = action.payload.metaData;
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

      .addCase(createAccountTypeWithUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccountTypeWithUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createAccountTypeWithUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default accountTypesSlice.reducer;
