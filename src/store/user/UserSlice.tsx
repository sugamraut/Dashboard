import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server_Url } from "../../globals/config";
import { Status, type StatusType } from "../../globals/status";
import type { UserProfile } from "../../globals/typeDeclaration";
import API, { getAuthHeader } from "../../http";

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
      const response = await API.get(`/users`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      const rawData = response.data.data;
      const total = response.data.metaData?.total || rawData.length;

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
      const response = await API.get(`/users/${userId}`);
      return response.data.data;
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
    const response = await API.put(`/users/${Profile.id}`, Profile, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "failed to create user");
  }
});

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await API.delete(
        `/users/${userId}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      if (response.status === 201) return userId;
      else throw new Error("Failed to delete user");
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete user"
      );
    }
  }
);
export const createUser = createAsyncThunk(
  "auth/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/create-user", userData, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create user"
      );
    }
  }
);

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
        state.list = action.payload;
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
            (user: { id: number }) => user.id !== action.payload
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
