import {AnyAction, createSlice, isPending, isRejected} from "@reduxjs/toolkit";
import {IApiError} from "../../api/api";
import {IParameter} from "../../models/ICatalog";
import {getParameters} from "../actions/catalog";


interface ICatalogState {
    parameters: IParameter[] | null
}

const initialState: ICatalogState = {
    parameters: null,
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getParameters.fulfilled, (state, {payload}) => {
            state.parameters = payload
        })
        // builder.addCase(checkToken.fulfilled, (state, {payload}) => {
        //     state.user = payload || null
        //     state.isLoading = false
        //     state.error = null
        // })
        // builder.addCase(logout.fulfilled, (state) => {
        //     state.user = null
        //     state.isLoading = false
        //     state.error = null
        // })

        // builder.addMatcher(isPending, (state) => {
        //     state.isLoading = true
        // })
        // builder.addMatcher(isRejected, (state, action: AnyAction) => {
        //     state.isLoading = false
        //     state.error = action.payload
        // })
    }
})

export default catalogSlice.reducer