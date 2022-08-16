import {apiUrl} from "../../api/urls";
import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {IContract, IOrganization, IParameter, IPipeType, ISubParameter, ITools} from "../../models/ICatalog";

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

export const getTools = createAsyncThunk(
    'getTools',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<ITools[]>(apiUrl + 'tools/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const createTool = createAsyncThunk(
    'createTool',
    async (post: ITools, thunkAPI) => {
        try {
            const {data} = await api.post<ITools>(apiUrl + 'tools/', post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const updateTool = createAsyncThunk(
    'updateTool',
    async (post: ITools, thunkAPI) => {
        try {
            const {data} = await api.put<ITools>(apiUrl + `tools/${post.id}/`, post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const deleteTool = createAsyncThunk(
    'deleteTool',
    async (post: ITools, thunkAPI) => {
        try {
            await api.delete<ITools>(apiUrl + `tools/${post.id}/`)
            return post.id
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getContracts = createAsyncThunk(
    'getContracts',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IContract[]>(apiUrl + 'contract/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const createContract = createAsyncThunk(
    'createContract',
    async (post: IContract, thunkAPI) => {
        try {
            const {data} = await api.post<IContract>(apiUrl + 'contract/', post, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const updateContract = createAsyncThunk(
    'updateContract',
    async (post: IContract, thunkAPI) => {
        try {
            const {data} = await api.put<IContract>(apiUrl + `contract/${post.id}/`, post, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const deleteContract = createAsyncThunk(
    'deleteContract',
    async (post: IContract, thunkAPI) => {
        try {
            await api.delete<IContract>(apiUrl + `contract/${post.id}/`)
            return post.id
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getOrganizations = createAsyncThunk(
    'getOrganizations',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IOrganization[]>(apiUrl + 'organization/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getManufacturers = createAsyncThunk(
    'getManufacturers',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<ISubParameter[]>(apiUrl + 'manufacturer/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)