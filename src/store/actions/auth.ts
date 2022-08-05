import axios from "axios";
import {IAccount, IAuth} from "../../models/IAuth";
import {apiUrl, restAuthUrl} from "../../api/urls";
import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError, IApiError} from "../../api/api";

export const login = createAsyncThunk(
    'login',
    async (post: IAuth, thunkAPI) => {
        try {
            const {data} = await axios.post(restAuthUrl + 'login/', post)
            const account: IAccount = {
                username: data.account.username,
                token: data.key,
                full_name: data.account.full_name,
                avatar: data.account.avatar
            }
            localStorage.setItem('user', JSON.stringify(account))
            localStorage.setItem('token', data.key)
            api.interceptors.request.use((config: any) => {
                config.headers["Authorization"] = `Token ${data.key}`;
                return config
            })
            return account
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const logout = createAsyncThunk(
    'logout',
    async (_, thunkAPI) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        try {
            await api.post(restAuthUrl + "logout/", {})
            return {}
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const checkToken = createAsyncThunk(
    'checkToken',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}') ;
        if (token) {
            try {
                await axios.post(apiUrl + 'check_token/', {token: token})
                api.interceptors.request.use((config: any) => {
                    config.headers["Authorization"] = `Token ${token}`;
                    return config
                })
                return user
            } catch (e) {
                const error: IApiError = apiError(e)
                if (error.code === 401) thunkAPI.dispatch(logout())
                return thunkAPI.rejectWithValue(error)
            }
        } else if (token === undefined) {
            thunkAPI.dispatch(logout());
        }
    }
)
