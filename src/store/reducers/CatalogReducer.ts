import {createSlice} from "@reduxjs/toolkit";
import {IContract, IOrganization, IParameter, IPipeType, ISubParameter, ITools} from "../../models/ICatalog";
import {
    createContract,
    createParameter, createTool, deleteContract, deleteParameter, deleteTool, getContracts,
    getLockThread,
    getLockType, getManufacturers, getOrganizations,
    getParameters,
    getPipeType, getProjectGroups, getRepairContractor,
    getSizeRange,
    getStrengthGroup, getTools, updateContract, updateParameter, updateTool
} from "../actions/catalog";
import {deleteElementFromList, updateElementInList} from "../../pages/utils";


interface ICatalogState {
    parameters: IParameter[]
    strength_group: ISubParameter[]
    size_range: ISubParameter[]
    lock_thread: ISubParameter[]
    lock_type: ISubParameter[]
    pipe_type: IPipeType[]
    tools: ITools[]
    contracts: IContract[]
    organizations: IOrganization[]
    manufacturers: ISubParameter[]
    repair_contractors: ISubParameter[]
    project_groups: ISubParameter[]
}

const initialState: ICatalogState = {
    parameters: [],
    strength_group: [],
    size_range: [],
    lock_thread: [],
    lock_type: [],
    pipe_type: [],
    tools: [],
    contracts: [],
    organizations: [],
    manufacturers: [],
    repair_contractors: [],
    project_groups: [],
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getParameters.fulfilled, (state, {payload}) => {
            state.parameters = payload
        })
        builder.addCase(createParameter.fulfilled, (state, {payload}) => {
            state.parameters = [...state.parameters, payload]
        })
        builder.addCase(updateParameter.fulfilled, (state, {payload}) => {
            state.parameters = updateElementInList(state.parameters, payload)
        })
        builder.addCase(deleteParameter.fulfilled, (state, {payload}) => {
            state.parameters = deleteElementFromList(state.parameters, payload)
        })
        builder.addCase(getStrengthGroup.fulfilled, (state, {payload}) => {
            state.strength_group = payload
        })
        builder.addCase(getSizeRange.fulfilled, (state, {payload}) => {
            state.size_range = payload
        })
        builder.addCase(getLockThread.fulfilled, (state, {payload}) => {
            state.lock_thread = payload
        })
        builder.addCase(getLockType.fulfilled, (state, {payload}) => {
            state.lock_type = payload
        })
        builder.addCase(getPipeType.fulfilled, (state, {payload}) => {
            state.pipe_type = payload
        })
        builder.addCase(getTools.fulfilled, (state, {payload}) => {
            state.tools = payload
        })
        builder.addCase(createTool.fulfilled, (state, {payload}) => {
            state.tools = [...state.tools, payload]
        })
        builder.addCase(updateTool.fulfilled, (state, {payload}) => {
            state.tools = updateElementInList(state.tools, payload)
        })
        builder.addCase(deleteTool.fulfilled, (state, {payload}) => {
            state.tools = deleteElementFromList(state.tools, payload)
        })
        builder.addCase(getContracts.fulfilled, (state, {payload}) => {
            state.contracts = payload
        })
        builder.addCase(createContract.fulfilled, (state, {payload}) => {
            state.contracts = [...state.contracts, payload]
        })
        builder.addCase(updateContract.fulfilled, (state, {payload}) => {
            state.contracts = updateElementInList(state.contracts, payload)
        })
        builder.addCase(deleteContract.fulfilled, (state, {payload}) => {
            state.contracts = deleteElementFromList(state.contracts, payload)
        })
         builder.addCase(getOrganizations.fulfilled, (state, {payload}) => {
            state.organizations = payload
        })
        builder.addCase(getManufacturers.fulfilled, (state, {payload}) => {
            state.manufacturers = payload
        })
        builder.addCase(getRepairContractor.fulfilled, (state, {payload}) => {
            state.repair_contractors = payload
        })
        builder.addCase(getProjectGroups.fulfilled, (state, {payload}) => {
            state.project_groups = payload
        })
    }
})

export default catalogSlice.reducer