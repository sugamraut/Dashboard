import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status, type StatusType } from "../../globals/status";
import type { Branch, StateType } from "../../globals/typeDeclaration";
import type { AppDispatch } from "../store";
import axios from "axios";
import { server_Url } from "../../globals/config";



interface BranchState {
  districts: any;
  fullList: Branch[] | null;
  list: Branch[] | null;
  loading: boolean;
  error: string | null;
  status: StatusType;
  state: StateType;
}

const initialState: BranchState = {
  fullList: null,
  list: null,
  loading: false,
  error: null,
  status: Status.Loading,
  state: {
    id: 0,
    name: "",
    nameNp: "",
    nameCombined: "",
  },
  districts: undefined,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranch(state, action: PayloadAction<Branch[]>) {
      state.list = action.payload;
      state.loading = false;
      state.status = Status.Success;
      state.error = null;
    },
    setBranchStatus(state, action: PayloadAction<StatusType>) {
      state.loading = action.payload === Status.Loading;
      state.status = action.payload;
    },
    setBranchError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = Status.Error;
      state.loading = false;
    },
    setFullList(state, action: PayloadAction<Branch[]>) {
      state.fullList = action.payload;
    },
    updateBranchInStore(state, action: PayloadAction<Branch>) {
      const updated = action.payload;
      const index = state.list?.findIndex((b) => b.id === updated.id);
      if (index !== undefined && index !== -1 && state.list) {
        state.list[index] = updated;
      }
    },
  },
});

export const {
  setBranch,
  setBranchStatus,
  setBranchError,
  updateBranchInStore,
  setFullList,
} = branchSlice.actions;

export default branchSlice.reducer;

export function fetchBranchData() {
  return async function fetchBranchDataThunk(dispatch: AppDispatch) {
    dispatch(setBranchStatus(Status.Loading));
    try {
      const response = await axios.get(`${server_Url}/api/v1/branches/list`);
      dispatch(setBranch(response.data.data));
      dispatch(setBranchStatus(Status.Success));
    } catch (error: any) {
      const message = error?.message || "Failed to fetch branches";
      dispatch(setBranchError(message));
    }
  };
}

export function fetchBranchById(branchId: number) {
  return async function fetchBranchByIdThunk(dispatch: AppDispatch) {
    dispatch(setBranchStatus(Status.Loading));
    try {
      const response = await axios.get(`${server_Url}/api/v1/branches/${branchId}`);
      dispatch(setBranch([response.data.data]));
      dispatch(setBranchStatus(Status.Success));
    } catch (error: any) {
      const message = error?.message || "Failed to fetch branch by id";
      dispatch(setBranchError(message));
    }
  };
}

interface UpdateBranchPayload {
  id: number;
  data: Partial<Branch>;
}

export function updateBranch({ id, data }: UpdateBranchPayload) {
  return async function updateBranchThunk(dispatch: AppDispatch) {
    dispatch(setBranchStatus(Status.Loading));
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch(setBranchError("No auth token found."));
      return Promise.reject("No token");
    }
    try {
      const response = await axios.patch<Branch>(
        `${server_Url}/api/v1/branches/${id}`,
        data,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      dispatch(updateBranchInStore(response.data));
      dispatch(setBranchStatus(Status.Success));
      return Promise.resolve(response.data);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Update error";
      dispatch(setBranchError(message));
      return Promise.reject(message);
    }
  };
}

export function createBranch(data: Partial<Branch>) {
  return async function createBranchThunk(dispatch: AppDispatch) {
    dispatch(setBranchStatus(Status.Loading));
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch(setBranchError("No auth token found."));
      return Promise.reject("No token");
    }
    try {
      const response = await axios.post(
        `${server_Url}/api/v1/branches`,
        data,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      dispatch(setBranchStatus(Status.Success));
      dispatch(fetchBranchData());
      return response.data.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || "Create error";
      dispatch(setBranchError(message));
      return Promise.reject(message);
    }
  };
}
