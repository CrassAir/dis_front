import {createSlice} from "@reduxjs/toolkit";
import {IKits} from "../../models/IKits";
import {getKits} from "../actions/kits";


interface IKitState {
    kits: IKits[]

}

const initialState: IKitState = {
    kits: []
}

export const kitSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getKits.fulfilled, (state, {payload}) => {
            state.kits = payload
        })
    }
})

export default kitSlice.reducer