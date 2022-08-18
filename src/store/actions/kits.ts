import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {apiUrl} from "../../api/urls";
import {IKit, IOrganizationTK, ITeam} from "../../models/IKit";


// export const getTeamKits = createAsyncThunk(
//     'getTeamKits',
//     async (_, thunkAPI) => {
//         try {
//             const {data} = await api.get<ITeamKit[]>(apiUrl + 'team_kit/')
//             return data
//         } catch (e) {
//             return thunkAPI.rejectWithValue(apiError(e))
//         }
//     }
// )

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


export const getOrganizationsTK = createAsyncThunk(
    'getOrganizationsTK',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IOrganizationTK[]>(apiUrl + 'organization_team_kit/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const createTeam = createAsyncThunk(
    'createTeam',
    async (post: ITeam, thunkAPI) => {
        try {
            const {data} = await api.post<ITeam>(apiUrl + 'team/', post)
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
            await api.post<IKit>(apiUrl + 'kit/', post, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return thunkAPI.dispatch(getOrganizationsTK())
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)

export const updateKit = createAsyncThunk(
    'updateKit',
    async (post: IKit, thunkAPI) => {
        try {
            await api.put<IKit>(apiUrl + `kit/${post.id}/`, post, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return thunkAPI.dispatch(getOrganizationsTK())
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
            return thunkAPI.dispatch(getOrganizationsTK())
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)
