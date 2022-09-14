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


interface IKitState {
    defectoscopy: IDefectoscopy[]
    standarts: IStandarts[]
    report: IDefectoscopy | null
    conventions: IConventions[]
    pipes: IPipe[]

}

const initialState: IKitState = {
    defectoscopy: [],
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
            state.defectoscopy = payload
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
            state.defectoscopy = [payload, ...state.defectoscopy]
        })
        builder.addCase(updateDefectoscopy.fulfilled, (state, {payload}) => {
            state.defectoscopy = updateElementInList(state.defectoscopy, payload)
        })
        builder.addCase(deleteDefectoscopy.fulfilled, (state, {payload}) => {
            state.defectoscopy = deleteElementFromList(state.defectoscopy, payload)
        })
    }
})

export const {clearPipes} = defectSlice.actions
export default defectSlice.reducer