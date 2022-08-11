import React, {useEffect, useMemo, useState} from 'react';
import MaterialTable, {Column} from "material-table";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {
    createParameter, deleteParameter,
    getLockThread,
    getLockType,
    getParameters, getPipeType,
    getSizeRange,
    getStrengthGroup, updateParameter
} from "../../../store/actions/catalog";
import {IParameter} from "../../../models/ICatalog";
import {convertListToObject, localizationMT} from "../../utils";


const Parameter = () => {
    const [data, setData] = useState<IParameter[]>([])
    const dispatch = useAppDispatch()
    const {
        parameters,
        strength_group,
        size_range,
        lock_type,
        lock_thread,
        pipe_type
    } = useAppSelector(state => state.catalogReducer)

    let columns = useMemo<Column<IParameter>[]>(() => ([
        {
            title: 'nominal pipe diameter', field: 'nominal_pipe_diameter', type: 'numeric',
            validate: rowData => !!rowData.nominal_pipe_diameter && isFinite(rowData.nominal_pipe_diameter),
            cellStyle: {backgroundColor: 'rgba(0,0,0,0.05)', textAlign: 'center'}
        },
        {
            title: 'weight_foot', field: 'weight_foot', type: 'numeric',
            validate: rowData => !!rowData.weight_foot && isFinite(rowData.weight_foot),
            cellStyle: {textAlign: 'center'}
        },
        {
            title: 'reinforcement',
            field: 'reinforcement',
            type: 'boolean',
            cellStyle: {backgroundColor: 'rgba(0,0,0,0.05)', textAlign: 'center'}
        },
        {
            title: 'internal_coating',
            field: 'internal_coating',
            type: 'boolean',
            cellStyle: {textAlign: 'center'}
        },
        {
            title: 'pipe_inner_diameter', field: 'pipe_inner_diameter', type: 'numeric',
            validate: rowData => !!rowData.pipe_inner_diameter && isFinite(rowData.pipe_inner_diameter),
            cellStyle: {backgroundColor: 'rgba(0,0,0,0.05)', textAlign: 'center'}
        },
        {
            title: 'lock_outside_diameter', field: 'lock_outside_diameter', type: 'numeric',
            validate: rowData => !!rowData.lock_outside_diameter && isFinite(rowData.lock_outside_diameter),
            cellStyle: {textAlign: 'center'}
        },
        {
            title: 'lock_inner_diameter', field: 'lock_inner_diameter', type: 'numeric',
            validate: rowData => !!rowData.lock_inner_diameter && isFinite(rowData.lock_inner_diameter),
            cellStyle: {backgroundColor: 'rgba(0,0,0,0.05)', textAlign: 'center'}
        },
        {
            title: 'weight', field: 'weight', type: 'numeric',
            validate: rowData => !!rowData.weight && isFinite(rowData.weight),
            cellStyle: {textAlign: 'center'}
        },
        {
            title: 'wall_thickness', field: 'wall_thickness', type: 'numeric',
            validate: rowData => !!rowData.wall_thickness && isFinite(rowData.wall_thickness),
            cellStyle: {backgroundColor: 'rgba(0,0,0,0.05)', textAlign: 'center'}
        },
        {
            title: 'length', field: 'length', type: 'numeric',
            validate: rowData => !!rowData.length && isFinite(rowData.length),
            cellStyle: {textAlign: 'center'}
        },
        {
            title: 'strength_group',
            field: 'strength_group',
            lookup: strength_group && convertListToObject(strength_group),
            validate: rowData => !!rowData.strength_group,
            cellStyle: {backgroundColor: 'rgba(0,0,0,0.05)', textAlign: 'center'}
        },
        {
            title: 'size_range', field: 'size_range', lookup: size_range && convertListToObject(size_range),
            validate: rowData => !!rowData.size_range,
            cellStyle: {textAlign: 'center'}
        },
        {
            title: 'lock_thread', field: 'lock_thread', lookup: lock_type && convertListToObject(lock_type),
            validate: rowData => !!rowData.lock_type,
            cellStyle: {backgroundColor: 'rgba(0,0,0,0.05)', textAlign: 'center'}
        },
        {
            title: 'lock_type', field: 'lock_type', lookup: lock_thread && convertListToObject(lock_thread),
            validate: rowData => !!rowData.lock_thread,
            cellStyle: {textAlign: 'center'}
        },
        {
            title: 'pipe_type', field: 'pipe_type', lookup: pipe_type && convertListToObject(pipe_type),
            validate: rowData => !!rowData.pipe_type,
            cellStyle: {backgroundColor: 'rgba(0,0,0,0.05)', textAlign: 'center'}
        },
    ]), [parameters, strength_group, size_range, lock_type, lock_thread, pipe_type])

    useEffect(() => {
        dispatch(getParameters())
        dispatch(getStrengthGroup())
        dispatch(getSizeRange())
        dispatch(getLockThread())
        dispatch(getLockType())
        dispatch(getPipeType())
    }, [])

    useEffect(() => {
        if (parameters) setData(parameters.map(par => ({...par, tableData: {}})))
    }, [parameters])


    return (
        <MaterialTable
            title="Editable Preview"
            options={{
                pageSize: 8,
            }}
            localization={localizationMT}
            style={{display: 'grid'}}
            columns={columns}
            data={data}
            editable={{
                onRowAdd: newData => dispatch(createParameter(newData)),
                onRowUpdate: (newData, oldData) => dispatch(updateParameter(newData)),
                onRowDelete: oldData => dispatch(deleteParameter(oldData))
            }}
        />
    )
}

export default Parameter