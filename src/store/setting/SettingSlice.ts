import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { MetaData, Setting } from "../../globals/typeDeclaration";
import API, { getAuthHeader } from "../../http";
import { Status, type StatusType } from "../../globals/status";

interface settingState {
  data: Setting[];
  list: Setting[] | null;
  metaData: MetaData | null;
  total: number;
  loading: boolean;
  error: string | null;
  status: StatusType;
}

const initialState: settingState = {
  data: [],
  list: null,
  total: 0,
  metaData: null,
  loading: false,
  error: null,
  status: Status.Loading,
};

interface FetchLogsParams {
  page?: number;
  rowPerPage?: number;
  sortBy?: string | null;
  sortOrder?: "asc" | "dec";
  query?: string;
  filters?: Record<string, any>;
}

interface FetchSettingResponse {
  data: Setting[];
  metaData: MetaData;
  total: number;
}

export const fetchsetting = createAsyncThunk<
  FetchSettingResponse,
  FetchLogsParams,
  { rejectValue: string }
>("setting/fetch", async (FetchLogsParams, { rejectWithValue }) => {
  try {
    const response = await API.get("api/v1/settings", {
      params: {
        page: FetchLogsParams.page ?? 1,
        rowPerPage: 25,
        sortBy: FetchLogsParams.sortBy ?? null,
        sortOrder: FetchLogsParams.sortOrder ?? "dec",
        query: FetchLogsParams.query ?? "",
        filters: JSON.stringify(FetchLogsParams.filters ?? {}),
      },
      headers: {
        ...getAuthHeader(),
      },
    });

    return response.data as FetchSettingResponse;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchSettingById = createAsyncThunk<
  Setting,
  string,
  { rejectValue: string }
>("setting/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await API.get(`api/v1/settings/${id}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data.data as Setting;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Fetch failed"
    );
  }
});

export const createSetting = createAsyncThunk<
  Setting,
  Setting,
  { rejectValue: string }
>("setting/create", async (settingData, { rejectWithValue }) => {
  try {
    const response = await API.post("api/v1/settings", settingData, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data as Setting;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to create setting"
    );
  }
});

export const updateSetting = createAsyncThunk<
  Setting,
  { id: string; updatedData: Partial<Setting> },
  { rejectValue: string }
>("setting/update", async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await API.put(`api/v1/settings/${id}`, updatedData,{
      headers:{
        ...getAuthHeader()
      }
    });

    return response.data as Setting;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Update failed"
    );
  }
});


const SettingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchsetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsetting.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.metaData = action.payload.metaData;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchsetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch settings";
      })

      .addCase(fetchSettingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettingById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = [action.payload];
      })
      .addCase(fetchSettingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch setting by ID";
      })

      .addCase(createSetting.pending, (state) => {
        state.loading = true;
        state.status = Status.Loading;
        state.error = null;
      })
      .addCase(createSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.status = Status.Success;
        const newSetting = action.payload;
        state.data.push(newSetting);
        state.total += 1;
      })
      .addCase(createSetting.rejected, (state, action) => {
        state.loading = false;
        state.status = Status.Error;
        state.error = action.payload || "Failed to create setting";
      })

      .addCase(updateSetting.pending, (state) => {
        state.loading = true;
        state.status = Status.Loading;
        state.error = null;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.status = Status.Success;

        const updatedSetting = action.payload;
        const index = state.data.findIndex(
          (item) => String(item.id) === String(updatedSetting.id)
        );
        if (index !== -1) {
          state.data.splice(index, 1, updatedSetting);
        }
      })

      .addCase(updateSetting.rejected, (state, action) => {
        state.loading = false;
        state.status = Status.Error;
        state.error = action.payload || "Failed to update setting";
      });
  },
});

export default SettingSlice.reducer;
