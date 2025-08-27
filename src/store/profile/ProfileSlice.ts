import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import API from "../../http";
import type { UserProfile } from "../../globals/typeDeclaration";


interface UserState {
  loading: boolean;
  error: string | null;
  data: UserProfile | null;
  list: UserProfile[] | null;
  success: boolean;
}

const initialState: UserState = {
  loading: false,
  error: null,
  data: null,
  success: false,
  list: [],
};

export const fetchProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get("/api/v1/users/profile");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

export const updateProfile = createAsyncThunk<
  UserProfile,
  UserProfile,
  { rejectValue: string }
>("user/updateProfile", async (formData, { rejectWithValue }) => {
  try {
    const response = await API.put("/api/v1/users/profile", formData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Profile update failed"
    );
  }
});

const userSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<UserProfile >) => {
          state.loading = false;
          state.list= [action.payload];
          state.data = action.payload;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.loading = false;
          state.data = action.payload;
          state.success = true;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// export const { clearProfileStatus } = userSlice.actions;
export default userSlice.reducer;
