import { createSlice } from "@reduxjs/toolkit";

const toSerializable = (value) => JSON.parse(
    JSON.stringify(value, (_key, nestedValue) =>
        typeof nestedValue === "function" ? undefined : nestedValue
    )
);

const initialState = {
    status:false,
    userData : null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:{
            reducer:(state,action)=>{
                state.status=true
                state.userData=action.payload
            },
            prepare:(userData)=>({
                payload: toSerializable(userData)
            })
        },
        logOut:(state)=>{
            state.status=false
            state.userData=null
        }
    }
})

export const {login , logOut} = authSlice.actions

export default authSlice.reducer