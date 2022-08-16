import {createSlice} from "@reduxjs/toolkit";
import {IOrganizationTK, ITeamKit} from "../../models/IKit";
import {createKit, createTeam, deleteKit, getOrganizationsTK, updateKit} from "../actions/kits";
import {deleteElementFromList, updateElementInList} from "../../pages/utils";


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
                org.teams = [...org.teams, payload]
                return org
            })
        })
        builder.addCase(createKit.fulfilled, (state, {payload}) => {
            state.organizationsTK = state.organizationsTK.map(org => {
                org.teams.map(team => {
                    if (team.team_kit.id === payload.team_kit) {
                        team.team_kit.kits = [...team.team_kit.kits, payload]
                    }
                    return team
                })
                return org
            })
        })
        builder.addCase(updateKit.fulfilled, (state, {payload}) => {
            state.organizationsTK = state.organizationsTK.map(org => {
                org.teams.map(team => {
                    if (team.team_kit.id === payload.team_kit) {
                        team.team_kit.kits = updateElementInList(team.team_kit.kits, payload)
                    }
                    return team
                })
                return org
            })
        })
        builder.addCase(deleteKit.fulfilled, (state, {payload}) => {
            state.organizationsTK = state.organizationsTK.map(org => {
                org.teams.map(team => {
                    if (team.team_kit.id === payload.team_kit) {
                        team.team_kit.kits = deleteElementFromList(team.team_kit.kits, payload.id)
                    }
                    return team
                })
                return org
            })
        })
    }
})

export default kitSlice.reducer