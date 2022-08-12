import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {apiUrl} from "../../api/urls";
import {IKits} from "../../models/IKits";


export const getKits = createAsyncThunk(
    'getKits',
    async (_, thunkAPI) => {
        try {
            const {data} = await api.get<IKits[]>(apiUrl + 'kits/')
            return data
        } catch (e) {
            return thunkAPI.rejectWithValue(apiError(e))
        }
    }
)