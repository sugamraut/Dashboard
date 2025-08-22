import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status, type StatusType } from "../../globals/status";
import API from "../../http";

interface OnlineAccount {
  name: string;
  id: number;
  status: string;
  createdat: string;
}

interface OnlineAccountStatus {
  data: OnlineAccount[] | null;
  list: OnlineAccount[] | null;
  loading: boolean;
  error: string | null ;
  status: StatusType;
}

const initialState: OnlineAccountStatus = {
  data: [],
  list: [],
  loading: false,
  error: null,
  status: Status.Loading,
};

export const fetchOnlineAccount= createAsyncThunk<OnlineAccount,{rejectValue:string}>(
    "fetch/onlineaccount",async(_,{rejectWithValue})=>{
        try {
            const response = await API.get(`/api/v1/online-account-requests`);
            return response.data.data as OnlineAccount
        } catch (error:any) {
            return rejectWithValue(error.message||"failed to fetch the OnlineAccount")
            
        }
    }
)

const OnlineAccountSlice = createSlice({
  name: "onlineAccount",
  initialState,
  reducers: {},
  extraReducers:(builder)=>{
    builder
    .addCase(fetchOnlineAccount.rejected,(state)=>{
        state.status=Status.Error;
        state.loading=false;
        // state.error=action.payload ;
    })
    .addCase(fetchOnlineAccount.pending,(state)=>{
        state.status=Status.Loading;
        state.loading=true;
        state.error=null;

    })
    .addCase(fetchOnlineAccount.fulfilled,(state,action)=>{
        state.list=[action.payload];
        state.data=[action.payload];
        state.loading=false;
        
    })
  }
});

export default OnlineAccountSlice.reducer