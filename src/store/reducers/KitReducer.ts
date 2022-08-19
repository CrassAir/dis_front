import {createSlice} from "@reduxjs/toolkit";
import {IMoving, IOrganizationTK, ITeamKit} from "../../models/IKit";
import {
    changeStatusMoving,
    createMoving,
    createTeam,
    deleteMoving,
    getMoving,
    getOrganizationsTK,
    updateMoving
} from "../actions/kits";
import {deleteElementFromList, updateElementInList} from "../../pages/utils";


interface IKitState {
    teamKits: ITeamKit[]
    organizationsTK: IOrganizationTK[]
    movingList: IMoving[]
}

const initialState: IKitState = {
    teamKits: [],
    organizationsTK: [],
    movingList: []
}

export const kitSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        // openDialogMoving: (state, action) => {}
    },
    extraReducers: (builder) => {
        // builder.addCase(getKits.fulfilled, (state, {payload}) => {
        //     state.kits = payload
        // })
        // builder.addCase(getTeamKits.fulfilled, (state, {payload}) => {
        //     state.teamKits = payload
        // })
        builder.addCase(getOrganizationsTK.fulfilled, (state, {payload}) => {
            state.organizationsTK = payload
        })
        builder.addCase(getMoving.fulfilled, (state, {payload}) => {
            state.movingList = payload
        })
        builder.addCase(createMoving.fulfilled, (state, {payload}) => {
            state.movingList = [...state.movingList, payload]
        })
        builder.addCase(changeStatusMoving.fulfilled, (state, {payload}) => {
            state.movingList = updateElementInList(state.movingList, payload)
        })
        builder.addCase(updateMoving.fulfilled, (state, {payload}) => {
            state.movingList = updateElementInList(state.movingList, payload)
        })
        builder.addCase(deleteMoving.fulfilled, (state, {payload}) => {
            state.movingList = deleteElementFromList(state.movingList, payload)
        })
        builder.addCase(createTeam.fulfilled, (state, {payload}) => {
            state.organizationsTK = state.organizationsTK.map(org => {
                if (org.id === payload.organization) {
                    org.teams = [...org.teams, payload]
                }
                return org
            })
        })
    }
})

export default kitSlice.reducer