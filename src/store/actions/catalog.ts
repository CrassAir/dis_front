import {apiUrl} from "../../api/urls";
import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {IParameter, IPipeType, ISubParameter} from "../../models/ICatalog";

export const getParameters = createAsyncThunk(
    'getParameters',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IParameter[]>(apiUrl + 'parameter/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const createParameter = createAsyncThunk(
    'createParameter',
    async (post: IParameter, thunkAPI) => {
        try {
            const {data} = await api.post<IParameter>(apiUrl + 'parameter/', post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const updateParameter = createAsyncThunk(
    'updateParameter',
    async (post: IParameter, thunkAPI) => {
        try {
            const {data} = await api.put<IParameter>(apiUrl + `parameter/${post.id}/`, post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const deleteParameter = createAsyncThunk(
    'deleteParameter',
    async (post: IParameter, thunkAPI) => {
        try {
            await api.delete<IParameter>(apiUrl + `parameter/${post.id}/`)
            return post.id
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getStrengthGroup = createAsyncThunk(
    'getStrengthGroup',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<ISubParameter[]>(apiUrl + 'strength_group/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getSizeRange = createAsyncThunk(
    'getSizeRange',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<ISubParameter[]>(apiUrl + 'size_range/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getLockThread = createAsyncThunk(
    'getLockThread',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<ISubParameter[]>(apiUrl + 'lock_thread/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getLockType = createAsyncThunk(
    'getLockType',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<ISubParameter[]>(apiUrl + 'lock_type/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getPipeType = createAsyncThunk(
    'getPipeType',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IPipeType[]>(apiUrl + 'pipe_type/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)