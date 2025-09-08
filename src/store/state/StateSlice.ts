import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type State } from "../../globals/typeDeclaration";
import { StateService } from "../../globals/Api Service/service";

interface StateSliceType {
  statesList: State[];
  loading: boolean;
  error: string | null;
}

const initialState: StateSliceType = {
  statesList: [],
  loading: false,
  error: null,
};

export const fetchStates = createAsyncThunk<
  State[],
  void,
  { rejectValue: string }
>("states/fetchStates", async (_, { rejectWithValue }) => {
  try {
    // return await StateService.get("/");
    const response =await StateService.get("/")
    return response.data
  } catch (err: any) {
    console.error("fetchStates error:", err);
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const stateSlice = createSlice({
  name: "states",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStates.fulfilled,
        (state, action: PayloadAction<State[]>) => {
          state.loading = false;
          state.statesList = Array.isArray(action.payload)
            ? action.payload
            : [];
        }
      )
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch states";
      });
  },
});

export default stateSlice.reducer;
