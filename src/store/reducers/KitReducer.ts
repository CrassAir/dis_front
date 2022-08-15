import {createSlice} from "@reduxjs/toolkit";
import {IKit, ITeamKit} from "../../models/IKit";
import {createKit, deleteKit, getKits, getTeamKits, updateKit} from "../actions/kits";
import {deleteElementFromList, updateElementInList} from "../../pages/utils";


interface IKitState {
    kits: IKit[]
    teamKits: ITeamKit[]
}

const initialState: IKitState = {
    kits: [],
    teamKits: []
}

export const kitSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getKits.fulfilled, (state, {payload}) => {
            state.kits = payload
        })
        builder.addCase(createKit.fulfilled, (state, {payload}) => {
            state.kits = [...state.kits, payload]
        })
        builder.addCase(updateKit.fulfilled, (state, {payload}) => {
            state.kits = updateElementInList(state.kits, payload)
        })
        builder.addCase(deleteKit.fulfilled, (state, {payload}) => {
            state.kits = deleteElementFromList(state.kits, payload)
        })
        builder.addCase(getTeamKits.fulfilled, (state, {payload}) => {
            state.teamKits = payload
        })
    }
})

export default kitSlice.reducer