import {AnyAction, createSlice, isPending, isRejected} from "@reduxjs/toolkit";
import {checkToken, login, logout} from "../actions/auth";
import {IAccount} from "../../models/IAuth";
import {IApiError} from "../../api/api";


interface AuthState {
    user: IAccount | null
    isLoading: boolean
    error: IApiError | null
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null

}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, {payload}) => {
            state.user = payload
            state.isLoading = false
            state.error = null

        })
        builder.addCase(checkToken.fulfilled, (state, {payload}) => {
            state.user = payload || null
            state.isLoading = false
            state.error = null
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null
            state.isLoading = false
            state.error = null
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