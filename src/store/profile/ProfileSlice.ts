import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserProfile } from "../../globals/typeDeclaration";

import { ProfileService } from "../../globals/Api Service/service";
import { toast } from "react-toastify";
import API from "../../http";

interface UserState {
  loading: boolean;
  error: string | null;
  data: UserProfile[] | null;
  list: UserProfile[] | null;
  success: boolean;
}

const initialState: UserState = {
  loading: false,
  error: null,
  data: [],
  success: false,
  list: [],
};

export const fetchProfile = createAsyncThunk<
  // PaginatedResponse<UserProfile>,
  UserProfile[],
  void,
  { rejectValue: string }
>("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    // return await ProfileService.get("/");
    const response =await API.get("/users/profile");
    console.log("file",response.data)
    return response.data??[]
  } catch (error: any) {
    toast.error(error.response?.data?.message||"failed to fetch profile")
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

export const updateProfile = createAsyncThunk<
  UserProfile,
  UserProfile,
  { rejectValue: string }
>("user/updateProfile", async (UpdateProfile, { rejectWithValue }) => {
  try {
    return await ProfileService.update(UpdateProfile);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Profile update failed"
    );
  }
});

const userSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.data = action.payload;
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload];
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default userSlice.reducer;
