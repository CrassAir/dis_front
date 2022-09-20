import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {apiUrl} from "../../api/urls";
import {AxiosError} from "axios";
import {IConventions, IDefectoscopy, IPipe, IStandarts} from "../../models/IDefectoscopy";
import {IPagination} from "../../models/IKit";


export const getDefectoscopy = createAsyncThunk(
    'getDefectoscopy',
    async (query: any, thunkAPI) => {
        try {
            const url = query?.next ? query.next : apiUrl + 'defectoscopy_report/'
            const {data} = await api.get<IPagination<IDefectoscopy[]>>(url, {params: {date: query.date}})
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getStandarts = createAsyncThunk(
    'getStandarts',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IStandarts[]>(apiUrl + 'standards_procedures/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getPipes = createAsyncThunk(
    'getPipes',
    async (report: IDefectoscopy, thunkAPI) => {
        try {
            const {data} = await api.get<IPipe[]>(apiUrl + 'pipe/', {params: {report: report.id}})
            return {pipes: data, report: report}
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const getConventions = createAsyncThunk(
    'getСonventions',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IConventions[]>(apiUrl + 'conventions/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const createDefectoscopy = createAsyncThunk(
    'createDefectoscopy',
    async (post: IDefectoscopy, thunkAPI) => {
        try {
            const {data} = await api.post<IDefectoscopy>(apiUrl + 'defectoscopy_report/', post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const updateDefectoscopy = createAsyncThunk(
    'updateDefectoscopy',
    async (post: IDefectoscopy, thunkAPI) => {
        try {
            const {data} = await api.put<IDefectoscopy>(apiUrl + `defectoscopy_report/${post.id}/`, post)
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)

export const deleteDefectoscopy = createAsyncThunk(
    'deleteDefectoscopy',
    async (post: IDefectoscopy, thunkAPI) => {
        try {
            await api.delete<IDefectoscopy>(apiUrl + `defectoscopy_report/${post.id}/`)
            return post.id
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e as Error | AxiosError))
        }
    }
)


