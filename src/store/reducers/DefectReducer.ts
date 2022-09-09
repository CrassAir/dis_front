import {createSlice} from "@reduxjs/toolkit";
import {deleteElementFromList, updateElementInList, updatePaginationList} from "../../pages/utils";
import {IDefectoscopy, IStandarts} from "../../models/IDefectoscopy";
import {
    createDefectoscopy,
    deleteDefectoscopy,
    getDefectoscopy,
    getStandarts,
    updateDefectoscopy
} from "../actions/defect";


interface IKitState {
    defectoscopy: IDefectoscopy[]
    standarts: IStandarts[]
    create: boolean
}

const initialState: IKitState = {
    defectoscopy: [],
    standarts: [],
    create: false
}

export const DefectSlice = createSlice({
    name: 'defect',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDefectoscopy.fulfilled, (state, {payload}) => {
            state.defectoscopy = payload
        })
        builder.addCase(getStandarts.fulfilled, (state, {payload}) => {
            state.standarts = payload
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

export default DefectSlice.reducer