import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { Status, type StatusType } from "../../globals/status";
import type { UserProfile } from "../../globals/typeDeclaration";

import { UserService } from "../../globals/Api Service/service";

export interface UserState {
  fullList: UserProfile[] | null;
  list: UserProfile[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
  totalCount: number;
  deletedstatus: boolean;
}

const initialState: UserState = {
  fullList: null,
  list: null,
  loading: false,
  error: null,
  status: Status.Idle,
  totalCount: 0,
  deletedstatus: false,
};

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const rawData = await UserService.fetch();
      const total = rawData.length;

      const formattedData: UserProfile[] = rawData.map((u: any) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        mobilenumber: u.mobile,
        email: u.email,
      }));

      return { users: formattedData, total };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId: number, { rejectWithValue }) => {
    try {
      // const response = await API.get(`/users/${userId}`);
      return await UserService.getById(userId);
      // return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);
export const updateUser = createAsyncThunk<
  UserProfile,
  UserProfile,
  { rejectValue: string }
>("users/update", async (Profile, { rejectWithValue }) => {
  try {
    return await UserService.update(Profile);
  } catch (error: any) {
    return rejectWithValue(error.message || "failed to create user");
  }
});

export const deleteUser = createAsyncThunk<UserProfile, UserProfile>(
  "users/delete",
  async (UserDelete, { rejectWithValue }) => {
    try {
      return await UserService.remove(UserDelete);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete user"
      );
    }
  }
);
export const createUser = createAsyncThunk<
  UserProfile,
  UserProfile,
  { rejectValue: string }
>("auth/createUser", async (newUser, { rejectWithValue }) => {
  try {
    return await UserService.create(newUser);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create user"
    );
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.status = Status.Loading;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.status = Status.Success;
        state.list = action.payload.users;
        state.fullList = action.payload.users;
        state.totalCount = action.payload.total;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.status = Status.Error;
        state.error = action.payload as string;
      })

      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (state.list) {
          state.list.push(action.payload);
        } else {
          state.list = [action.payload];
        }
      })

      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.status = Status.Loading;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.status = Status.Success;
        state.list = [action.payload];
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.status = Status.Error;
        state.error = action.payload as string;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.status = Status.Loading;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = Status.Success;
        const updatedUser = action.payload;
        const index = state.list?.findIndex(
          (u: { id: any }) => u.id === updatedUser.id
        );
        if (index !== undefined && index !== -1 && state.list) {
          state.list[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.status = Status.Error;
        state.error = action.payload as string;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.status = Status.Loading;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = Status.Success;
        state.deletedstatus = true;
        state.list =
          state.list?.filter(
            (user: { id: number }) => user.id !== action.payload.id
          ) || null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.status = Status.Error;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
