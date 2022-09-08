import {createSlice} from "@reduxjs/toolkit";
import {deleteElementFromList, updateElementInList, updatePaginationList} from "../../pages/utils";
import {IDefectoscopy, IStandarts} from "../../models/IDefectoscopy";
import {getDefectoscopy, getStandarts} from "../actions/defect";


interface IKitState {
    defectoscopy: IDefectoscopy[]
    standarts: IStandarts[]

}

const initialState: IKitState = {
    defectoscopy: [],
    standarts: []
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
    }
})

export default DefectSlice.reducer