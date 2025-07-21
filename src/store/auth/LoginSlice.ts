import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status, type StatusType } from "../../globals/status";
import type { authItem } from "../../globals/typeDeclaration"

interface authState {
    data: authItem | null;
    loading: boolean;
    error: string | null;
    status: StatusType;
}
const initialState: authState = {
    data: null,
    loading: false,
    error: null,
    status: Status.Loading
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<authItem>) {
            state.data = action.payload;
        },
        setStatus(state, action: PayloadAction<StatusType>) {
            state.status = action.payload
        }
    }
});
export const { setAuth, setStatus } = authSlice.actions;
export default authSlice.reducer