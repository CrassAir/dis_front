import {createSlice} from "@reduxjs/toolkit";
import {IOrganizationTK, ITeamKit} from "../../models/IKit";
import {createTeam, getOrganizationsTK} from "../actions/kits";


interface IKitState {
    teamKits: ITeamKit[]
    organizationsTK: IOrganizationTK[]
}

const initialState: IKitState = {
    teamKits: [],
    organizationsTK: []
}

export const kitSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
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