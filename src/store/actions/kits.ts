import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {apiUrl} from "../../api/urls";
import {IKit, IMoving, IOperationTime, IOrganizationTK, IPagination, IStatusMoving, ITeam} from "../../models/IKit";
import {AxiosError} from "axios";


// export const getTeamKits = createAsyncThunk(
//     'getTeamKits',
//     async (_, thunkAPI) => {
//         try {
//             const {data} = await api.get<ITeamKit[]>(apiUrl + 'team_kit/')
//             return data
//         } catch (e) {
//             return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
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
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
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
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getStatus = createAsyncThunk(
    'getStatus',
    async (query: any, thunkAPI) => {
        try {
            const url = query?.next ? query.next : apiUrl + 'status_moving_kit/'
            const {data} = await api.get<IPagination<IStatusMoving[]>>(url, {params: {mov_id: query.mov_id}})
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
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
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
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
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
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
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
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
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getMoving = createAsyncThunk(
    'getMoving',
    async (query: any, thunkAPI) => {
        try {
            const url = query?.next ? query.next : apiUrl + 'moving_kit/'
            const {data} = await api.get<IPagination<IMoving[]>>(url, {params: {id: query.id, date: query.date}})
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getOperatingTime = createAsyncThunk(
    'getOperatingTime',
    async (query: any, thunkAPI) => {
        try {
            const url = query?.next ? query.next : apiUrl + 'operating_time/'
            const {data} = await api.get<IPagination<IOperationTime[]>>(url, {params: {team_kit: query.team_kit}})
            return {data, team_kit: query.team_kit}
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const createOperatingTime = createAsyncThunk(
    'createOperatingTime',
    async (post: any, thunkAPI) => {
        try {
            const {data} = await api.post<IOperationTime>(apiUrl + 'operating_time/', post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const deleteOperatingTime = createAsyncThunk(
    'deleteOperatingTime',
    async (post: number, thunkAPI) => {
        try {
            await api.delete<IOperationTime>(apiUrl + `operating_time/${post}/`)
            return post
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const changeStatusMoving = createAsyncThunk(
    'changeStatusMoving',
    async (post: any, thunkAPI) => {
        try {
            const {data} = await api.post<IMoving>(apiUrl + `moving_kit/${post.id}/change_status/`, {
                forward: post.forward,
                comment: post.comment
            })
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const createMoving = createAsyncThunk(
    'createMoving',
    async (post: any, thunkAPI) => {
        try {
            const {data} = await api.post<IMoving>(apiUrl + 'moving_kit/', post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const updateMoving = createAsyncThunk(
    'updateMoving',
    async (post: any, thunkAPI) => {
        try {
            const {data} = await api.put<IMoving>(apiUrl + `moving_kit/${post.id}/`, post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const deleteMoving = createAsyncThunk(
    'deleteMoving',
    async (post: IMoving, thunkAPI) => {
        try {
            await api.delete<IMoving>(apiUrl + `moving_kit/${post.id}/`)
            return post.id
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)
