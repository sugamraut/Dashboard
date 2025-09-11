import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { Status, type StatusType } from "../../globals/status";

import axios from "axios";
import type {
  FetchParams,
  PaginatedResponse,
} from "../../globals/api_service/api_services";
import type { OnlineAccount } from "../../globals/typeDeclaration";
import { OnlineAccountService } from "../../globals/api_service/service";

interface CreateblacklistStatus {
  firstname: string;
  middleName: string;
  lastName: string;
  nationality: string;
  dob: string;
  citizenshipNumber: string;
}

interface OnlineAccountStatus {
  data: OnlineAccount[] | null;
  list: OnlineAccount[] | null;
  item: CreateblacklistStatus[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
    totalCount: number;
}

const initialState: OnlineAccountStatus = {
  data: [],
  list: [],
  item: [],
  loading: false,
  error: null,
  status: Status.Loading,
  totalCount: 0
};

export const fetchOnlineAccount = createAsyncThunk<
  PaginatedResponse<OnlineAccount>,
  // Partial<FetchParams> | undefined,
  FetchParams,
  { rejectValue: string }
>("fetch/onlineaccount", async (params = {}, { rejectWithValue }) => {
  try {

    const response =await OnlineAccountService.get("/",params)
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch the OnlineAccount"
    );
  }
});

export const CreateOnlineRequest = createAsyncThunk<
  OnlineAccount,
  OnlineAccount,
  { rejectValue: string }
>("post.blacklist", async (newonlinedata, { rejectWithValue }) => {
  try {
    return await OnlineAccountService.create(newonlinedata);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "failed to up");
  }
});

export const fetchSanctionList = createAsyncThunk<
  CreateblacklistStatus[],
  void,
  { rejectValue: string }
>("sanctionList/create", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post("/partner-api/screening/sanction-list");

    return response.data.data as CreateblacklistStatus[];
  } catch (err: any) {
    const message =
      err.response?.data?.message ??
      err.message ??
      "Failed to fetch sanction list";
    return rejectWithValue(message);
  }
});

const OnlineAccountSlice = createSlice({
  name: "onlineAccount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchOnlineAccount.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = Status.Error;
          state.loading = false;
          state.error = action.payload || "faied to load roles";
        }
      )
      .addCase(fetchOnlineAccount.pending, (state) => {
        state.status = Status.Loading;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnlineAccount.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.data = action.payload.data;
        state.totalCount = action.payload.metaData.total;
        state.loading = false;
      })

      .addCase(CreateOnlineRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateOnlineRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(CreateOnlineRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.list?.push(action.payload);
        state.error = null;
      });
    builder
      .addCase(fetchSanctionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSanctionList.fulfilled,
        (state, action: PayloadAction<CreateblacklistStatus[]>) => {
          state.loading = false;
          state.item = action.payload;
        }
      )
      .addCase(fetchSanctionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default OnlineAccountSlice.reducer;
