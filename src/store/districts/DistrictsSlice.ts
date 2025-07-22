import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status, type StatusType } from "../../globals/status";
import type { getDistricts } from "../../globals/typeDeclaration";


interface districtState {
    data: getDistricts | null;
    loading: boolean;
    error: string | null;
    status: StatusType;
}

const initialState: districtState = {
    data: null,
    loading: false,
    error: null,
    status: Status.Loading
}

const districtSlice = createSlice({
    name: "district",
    initialState,
    reducers: {
        setDistrict(state, action: PayloadAction<districtState>) {
            // state.data = action.payload;
            state.status = Status.Success
            state.error = null;
            state.loading = false;

        },
        setStatus(state, action: PayloadAction<StatusType>) {
            state.status = action.payload;
            state.loading = action.payload === Status.Loading;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.status = Status.Error;
            state.loading = false;
        },
    }
});
export const {setDistrict,setStatus,setError}=districtSlice.actions;
export default districtSlice.reducer;
