import {apiUrl} from "../../api/urls";
import {createAsyncThunk} from "@reduxjs/toolkit";
import api, {apiError} from "../../api/api";
import {IParameter} from "../../models/ICatalog";

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
