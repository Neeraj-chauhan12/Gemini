import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    isAuthenticated: false,
    user: null
}

const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers: { 
        Userlogin: (state, action) => {
            state.isAuthenticated = true
            state.user = action.payload.user
        },
        Userlogout: (state) => {
            state.isAuthenticated = false
            state.user = null
        }
    }
 })

 export const {Userlogin, Userlogout} = authSlice.actions;
 export default authSlice.reducer;