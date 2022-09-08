import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {apiUrl} from "../../api/urls";
import {AxiosError} from "axios";
import {IDefectoscopy, IStandarts} from "../../models/IDefectoscopy";

export const getDefectoscopy = createAsyncThunk(
    'getDefectoscopy',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IDefectoscopy[]>(apiUrl + 'defectoscopy_report/')
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

