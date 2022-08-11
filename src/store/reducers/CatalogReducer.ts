import {createSlice} from "@reduxjs/toolkit";
import {IParameter, IPipeType, ISubParameter} from "../../models/ICatalog";
import {
    createParameter, deleteParameter,
    getLockThread,
    getLockType,
    getParameters,
    getPipeType,
    getSizeRange,
    getStrengthGroup, updateParameter
} from "../actions/catalog";


interface ICatalogState {
    parameters: IParameter[]
    strength_group: ISubParameter[]
    size_range: ISubParameter[]
    lock_thread: ISubParameter[]
    lock_type: ISubParameter[]
    pipe_type: IPipeType[]
}

const initialState: ICatalogState = {
    parameters: [],
    strength_group: [],
    size_range: [],
    lock_thread: [],
    lock_type: [],
    pipe_type: [],
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getParameters.fulfilled, (state, {payload}) => {
            state.parameters = payload
        })
        builder.addCase(createParameter.fulfilled, (state, {payload}) => {
            state.parameters = [...state.parameters, payload]
        })
        builder.addCase(updateParameter.fulfilled, (state, {payload}) => {
            state.parameters = state.parameters.map(par => {
                if (par.id === payload.id) return payload
                return par
            })
        })
        builder.addCase(deleteParameter.fulfilled, (state, {payload}) => {
            const newPar: IParameter[] = [];
            state.parameters.forEach(par => {
                if (par.id !== payload) {
                    newPar.push(par)
                }
            })
            state.parameters = newPar
        })
        builder.addCase(getStrengthGroup.fulfilled, (state, {payload}) => {
            state.strength_group = payload
        })
        builder.addCase(getSizeRange.fulfilled, (state, {payload}) => {
            state.size_range = payload
        })
        builder.addCase(getLockThread.fulfilled, (state, {payload}) => {
            state.lock_thread = payload
        })
        builder.addCase(getLockType.fulfilled, (state, {payload}) => {
            state.lock_type = payload
        })
        builder.addCase(getPipeType.fulfilled, (state, {payload}) => {
            state.pipe_type = payload
        })

    }
})

export default catalogSlice.reducer