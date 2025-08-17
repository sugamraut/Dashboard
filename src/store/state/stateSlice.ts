import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { type State } from '../../globals/typeDeclaration';
import API from '../../http';

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


export const fetchStates = createAsyncThunk<State[], void, { rejectValue: string }>(
  'states/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/v1/states`);
      console.log("fetchStates response.data:", response.data); // Debug response
      return response.data.data as State[];
    } catch (err: any) {
      console.error("fetchStates error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const stateSlice = createSlice({
  name: 'states',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action: PayloadAction<State[]>) => {
        state.loading = false;
        state.statesList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch states';
      });
  },
});

export default stateSlice.reducer;
