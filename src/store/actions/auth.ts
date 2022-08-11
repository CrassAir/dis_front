import axios from "axios";
import {IAccount, IAuth} from "../../models/IAuth";
import {apiUrl, restAuthUrl} from "../../api/urls";
import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError, IApiError} from "../../api/api";

let interceptor = 0;

export const login = createAsyncThunk(
    'login',
    async (post: IAuth, thunkAPI) => {
        try {
            const {data} = await axios.post(restAuthUrl + 'login/', post)
            console.log(data.key)
            const account: IAccount = {
                id: data.user.id,
                username: data.user.username,
                token: data.key,
                full_name: data.user.full_name,
            }
            localStorage.setItem('user', JSON.stringify(account))
            localStorage.setItem('token', data.key)
            interceptor = api.interceptors.request.use((config: any) => {
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
            api.interceptors.request.eject(interceptor)
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
                interceptor = api.interceptors.request.use((config: any) => {
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
