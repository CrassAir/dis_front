import {createSlice} from "@reduxjs/toolkit";
import {IMoving, IOperationTime, IOrganizationTK, IPagination, IStatusMoving, ITeamKit} from "../../models/IKit";
import {
    changeStatusMoving,
    createMoving, createOperatingTime,
    createTeam,
    deleteMoving, deleteOperatingTime,
    getMoving, getOperatingTime,
    getOrganizationsTK, getStatus,
    updateMoving
} from "../actions/kits";
import {deleteElementFromList, updateElementInList, updatePaginationList} from "../../pages/utils";


interface IKitState {
    teamKits: ITeamKit[]
    organizationsTK: IOrganizationTK[]
    movingList: IPagination<IMoving[]>
    statusList: IPagination<IStatusMoving[]>
    operatingTimeList: IPagination<IOperationTime[]>
    operatingTimeTeamKit: null | number
}

const initialState: IKitState = {
    teamKits: [],
    organizationsTK: [],
    movingList: {count: 0, next: null, previous: null, results: []},
    statusList: {count: 0, next: null, previous: null, results: []},
    operatingTimeList: {count: 0, next: null, previous: null, results: []},
    operatingTimeTeamKit: null,
}

export const kitSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        clearStatusList: (state) => {
            state.statusList = initialState.statusList
        },
        clearOperatingTimeList: (state) => {
            state.operatingTimeList = initialState.operatingTimeList
            state.operatingTimeTeamKit = null
        }
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
            state.movingList = updatePaginationList(state.movingList, payload)
        })
        builder.addCase(getStatus.fulfilled, (state, {payload}) => {
            state.statusList = updatePaginationList(state.statusList, payload)
        })
        builder.addCase(getOperatingTime.fulfilled, (state, {payload}) => {
            state.operatingTimeList = updatePaginationList(state.operatingTimeList, payload.data)
            if (!payload.data.previous) state.operatingTimeTeamKit = payload.team_kit
        })
        builder.addCase(deleteOperatingTime.fulfilled, (state, {payload}) => {
            state.operatingTimeList.results = deleteElementFromList(state.operatingTimeList.results, payload)
        })
        builder.addCase(createOperatingTime.fulfilled, (state, {payload}) => {
            state.operatingTimeList.results = [payload, ...state.operatingTimeList.results]
        })
        builder.addCase(createMoving.fulfilled, (state, {payload}) => {
            state.movingList.results = [payload, ...state.movingList.results]
        })
        builder.addCase(changeStatusMoving.fulfilled, (state, {payload}) => {
            state.movingList.results = updateElementInList(state.movingList.results, payload)
        })
        builder.addCase(updateMoving.fulfilled, (state, {payload}) => {
            state.movingList.results = updateElementInList(state.movingList.results, payload)
        })
        builder.addCase(deleteMoving.fulfilled, (state, {payload}) => {
            state.movingList.results = deleteElementFromList(state.movingList.results, payload)
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

export const {clearStatusList, clearOperatingTimeList} = kitSlice.actions

export default kitSlice.reducer