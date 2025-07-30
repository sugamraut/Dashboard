import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status, type StatusType } from "../../globals/status";
import type { StateType } from "../../globals/typeDeclaration";
import type { AppDispatch } from "../store";
import axios from "axios";
import { server_Url } from "../../globals/config";
;

export interface branch{
    data: any;
    id:number,
    name:string,
    nameNp:string,
    nameCombined:number,
    districtId:number,
    code:string|null,
    district:string,
    state:string,
}

interface branchState{
    fullList:branch[]|null;
    list:branch[]|null,
    loading:boolean,
    error:string|null,
    status:StatusType;
    state:StateType
}

const initialState :branchState={
    fullList: null,
    list: null,
    loading: false,
    error: null,
    status: Status.Loading,
    state: {
        id: 0,
        name: "",
        nameNp: "",
        nameCombined: ""
    }
}

const BranchSlice= createSlice({
    name:"Branch",
    initialState,
    reducers:{
        setBranch(states,action:PayloadAction<branch>){
            states.list=action.payload.data;
            states.loading=false;
            states.status=Status.Success;
            states.error=null
        },
        setBranchStatus(state,action:PayloadAction<StatusType>){
            state.loading=action.payload===Status.Loading
        },
        setBranchError(state,action:PayloadAction<string>){
            state.error=action.payload;
            state.status=Status.Error;
            state.loading=false;
        }
    }

})
 export const{setBranch,setBranchStatus,setBranchError}=BranchSlice.actions
export default BranchSlice.reducer

export function BranchPaginateData(){
    return async function BranchPaginateDataThnunk(dispatch:AppDispatch) {
        dispatch(setBranchStatus(Status.Loading))
        try {
            const response =await axios.get(`${server_Url}/api/v1/branches/list`)
                dispatch(setBranch(response.data.data))
                dispatch(setBranchStatus(Status.Success));
            
        } catch (error:any) {
            dispatch(setBranchError( error|| "Failed to fetch all cities"));
        }
        
    }
}

export function fetchBranchById(){
    return async function fetchBranchById(dispatch:AppDispatch) {
        dispatch(setBranchStatus(Status.Loading));
        try {
            //{{server_url}}/api/v1/branches/2
            const response=await axios.get
        } catch (error) {
            
        }
    }
}