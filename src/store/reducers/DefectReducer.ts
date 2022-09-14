import {createSlice} from "@reduxjs/toolkit";
import {deleteElementFromList, updateElementInList, updatePaginationList} from "../../pages/utils";
import {IConventions, IDefectoscopy, IPipe, IStandarts} from "../../models/IDefectoscopy";
import {
    createDefectoscopy,
    deleteDefectoscopy,
    getDefectoscopy, getPipes,
    getStandarts, getConventions,
    updateDefectoscopy
} from "../actions/defect";
import {IPagination} from "../../models/IKit";


interface IKitState {
    defectoscopy: IPagination<IDefectoscopy[]>
    standarts: IStandarts[]
    report: IDefectoscopy | null
    conventions: IConventions[]
    pipes: IPipe[]

}

const initialState: IKitState = {
    defectoscopy: {count: 0, next: null, previous: null, results: []},
    standarts: [],
    report: null,
    conventions: [],
    pipes: [],
}

export const defectSlice = createSlice({
    name: 'defect',
    initialState,
    reducers: {
        clearPipes: (state) => {
            state.pipes = initialState.pipes
            state.report = initialState.report
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getDefectoscopy.fulfilled, (state, {payload}) => {
            state.defectoscopy = updatePaginationList(state.defectoscopy, payload)
        })
        builder.addCase(getStandarts.fulfilled, (state, {payload}) => {
            state.standarts = payload
        })
        builder.addCase(getPipes.fulfilled, (state, {payload}) => {
            state.pipes = payload.pipes
            state.report = payload.report
        })
        builder.addCase(getConventions.fulfilled, (state, {payload}) => {
            state.conventions = payload
        })
        builder.addCase(createDefectoscopy.fulfilled, (state, {payload}) => {
            state.defectoscopy.results = [payload, ...state.defectoscopy.results]
        })
        builder.addCase(updateDefectoscopy.fulfilled, (state, {payload}) => {
            state.defectoscopy.results = updateElementInList(state.defectoscopy.results, payload)
        })
        builder.addCase(deleteDefectoscopy.fulfilled, (state, {payload}) => {
            state.defectoscopy.results = deleteElementFromList(state.defectoscopy.results, payload)
        })
    }
})

export const {clearPipes} = defectSlice.actions
export default defectSlice.reducer