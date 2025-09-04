import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Setting } from "../../globals/typeDeclaration";
import API, { getAuthHeader } from "../../http";
import { Status, type StatusType } from "../../globals/status";
import type {
  FetchParams,
  MetaData,
  PaginatedResponse,
} from "../../globals/Api Service/API_Services";
import { SettingService } from "../../globals/Api Service/service";

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

export const fetchsetting = createAsyncThunk<
  PaginatedResponse<Setting>,
  FetchParams,
  { rejectValue: string }
>("setting/fetch", async (params, { rejectWithValue }) => {
  try {
    const response = await SettingService.fetchPaginated(params);
    return {
      data: response.data,
      metaData: response.metaData,
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchSettingById = createAsyncThunk(
  "setting/fetchById",
  async (settingId: number, { rejectWithValue }) => {
    try {
      return await SettingService.getById(settingId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Fetch failed"
      );
    }
  }
);

export const createSetting = createAsyncThunk<
  Setting,
  Setting,
  { rejectValue: string }
>("setting/create", async (settingData, { rejectWithValue }) => {
  try {
    const response = await API.post("/settings", settingData, {
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
    const response = await API.put(`/settings/${id}`, updatedData, {
      headers: {
        ...getAuthHeader(),
      },
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
        state.error = action.payload as string;
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
