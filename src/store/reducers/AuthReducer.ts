import {AnyAction, createSlice, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {checkToken, login, logout} from "../actions/auth";
import {IAccount} from "../../models/IAuth";


interface AuthState {
    user: IAccount | null
    isLoading: boolean
    error: string
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: ''

}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, {payload}) => {
            state.user = payload
            state.isLoading = false
            state.error = ''

        })
        builder.addCase(checkToken.fulfilled, (state, {payload}) => {
            state.user = payload || null
            state.isLoading = false
            state.error = ''
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null
            state.isLoading = false
            state.error = ''
        })

        builder.addMatcher(isPending, (state) => {
            state.isLoading = true
        })
        builder.addMatcher(isRejected, (state, action: AnyAction) => {
            state.isLoading = false
            state.error = action.payload
        })
    }
})

export default authSlice.reducer