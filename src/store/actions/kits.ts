import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {apiUrl} from "../../api/urls";
import {IKit, ITeamKit} from "../../models/IKit";
import {IParameter} from "../../models/ICatalog";


export const getKits = createAsyncThunk(
    'getKits',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IKit[]>(apiUrl + 'kit/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const createKit = createAsyncThunk(
    'createKit',
    async (post: IKit, thunkAPI) => {
        try {
            const {data} = await api.post<IKit>(apiUrl + 'kit/', post, {
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

export const updateKit = createAsyncThunk(
    'updateKit',
    async (post: IKit, thunkAPI) => {
        try {
            const {data} = await api.put<IKit>(apiUrl + `kit/${post.id}/`, post, {
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

export const deleteKit = createAsyncThunk(
    'deleteKit',
    async (post: IKit, thunkAPI) => {
        try {
            await api.delete<IKit>(apiUrl + `kit/${post.id}/`)
            return post.id
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const getTeamKits = createAsyncThunk(
    'getTeamKits',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<ITeamKit[]>(apiUrl + 'team_kit/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)