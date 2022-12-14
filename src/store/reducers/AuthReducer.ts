import {AnyAction, createSlice, isFulfilled, isPending, isRejected} from "@reduxjs/toolkit";
import {checkToken, getNotifications, login, logout} from "../actions/auth";
import {IAccount, INotifications} from "../../models/IAuth";
import api, {IApiError} from "../../api/api";
import {changeNavListOnValidate, updatePaginationList} from "../../pages/utils";
import {INavItem, defaultNavList} from "../../App";
import {IPagination} from "../../models/IKit";


interface IAuthState {
    user: IAccount | null
    token: string | null
    navList: INavItem[]
    isLoading: boolean
    error: IApiError | null
    interceptor: number
    notifications: IPagination<INotifications[]>
}

const initialState: IAuthState = {
    user: null,
    token: null,
    navList: [],
    isLoading: false,
    error: null,
    interceptor: 0,
    notifications: {count: 0, next: null, previous: null, results: []},
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, {payload}) => {
            state.user = payload.user
            state.token = payload.token
            state.navList = changeNavListOnValidate(payload.user, defaultNavList)
            state.interceptor = payload.interceptor
            state.isLoading = false
            state.error = null
        })
        builder.addCase(checkToken.fulfilled, (state, {payload}) => {
            state.user = payload?.user || null
            state.token = payload?.token || null
            state.navList = changeNavListOnValidate(payload?.user, defaultNavList)
            state.interceptor = payload?.interceptor || 0
            state.isLoading = false
            state.error = null
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.token = null
            state.user = null
            state.isLoading = false
            state.error = null
        })
        builder.addCase(getNotifications.fulfilled, (state, {payload}) => {
            state.notifications = updatePaginationList(state.notifications, payload)
            state.isLoading = false
            state.error = null
        })

        builder.addMatcher(isFulfilled, (state) => {
            state.isLoading = false
            state.error = null
        })
        builder.addMatcher(isPending, (state) => {
            state.isLoading = true
        })
        builder.addMatcher(isRejected, (state, action: AnyAction) => {
            if (action.payload?.code === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                api.interceptors.request.eject(state.interceptor)
                state.user = null
                state.token = null
            }
            state.isLoading = false
            state.error = action.payload
        })
    }
})

export default authSlice.reducer