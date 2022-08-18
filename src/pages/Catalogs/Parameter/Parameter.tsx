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
import {convertListToObject, localizationMT, validateEditAccess} from "../../utils";


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
    const {user, isLoading} = useAppSelector(state => state.authReducer)

    const edit = useMemo(() => validateEditAccess(user!, 'directory'), [user])

    let columns = useMemo<Column<IParameter>[]>(() => ([
        {
            title: 'Тип трубы', field: 'pipe_type', lookup: pipe_type && convertListToObject(pipe_type),
            validate: rowData => !!rowData.pipe_type,
        },
        {
            title: 'Номинальный диаметр трубы', field: 'nominal_pipe_diameter', type: 'numeric',
            validate: rowData => !!rowData.nominal_pipe_diameter && isFinite(rowData.nominal_pipe_diameter),
        },
        {
            title: 'Внутренний диаметр трубы', field: 'pipe_inner_diameter', type: 'numeric',
            validate: rowData => !!rowData.pipe_inner_diameter && isFinite(rowData.pipe_inner_diameter),
        },
        {
            title: 'Вес, фунтов на фут', field: 'weight_foot', type: 'numeric',
            validate: rowData => !!rowData.weight_foot && isFinite(rowData.weight_foot),
        },
        {
            title: 'Вес в кг/м', field: 'weight', type: 'numeric',
            validate: rowData => !!rowData.weight && isFinite(rowData.weight),
        },
        {
            title: 'Толщина стенки в мм', field: 'wall_thickness', type: 'numeric',
            validate: rowData => !!rowData.wall_thickness && isFinite(rowData.wall_thickness),
        },
        {
            title: 'Длина одного элемента в м', field: 'length', type: 'numeric',
            validate: rowData => !!rowData.length && isFinite(rowData.length),
        },
        {
            title: 'Группа прочности',
            field: 'strength_group',
            lookup: strength_group && convertListToObject(strength_group),
            validate: rowData => !!rowData.strength_group,
        },
        {
            title: 'Размерный ряд', field: 'size_range', lookup: size_range && convertListToObject(size_range),
            validate: rowData => !!rowData.size_range,
        },
        {
            title: 'Армирование',
            field: 'reinforcement',
            type: 'boolean',
        },
        {
            title: 'Внутренее покрытие',
            field: 'internal_coating',
            type: 'boolean',
        },
        {
            title: 'Тип замка', field: 'lock_type',
            lookup: lock_type && convertListToObject(lock_type),
            validate: rowData => !!rowData.lock_type,
        },
        {
            title: 'Резьба замкового соединения',
            field: 'lock_thread',
            lookup: lock_thread && convertListToObject(lock_thread),
            validate: rowData => !!rowData.lock_thread,
        },
        {
            title: 'Наружний диаметр замка', field: 'lock_outside_diameter', type: 'numeric',
            validate: rowData => !!rowData.lock_outside_diameter && isFinite(rowData.lock_outside_diameter),
        },
        {
            title: 'Внутренний диаметр замка', field: 'lock_inner_diameter', type: 'numeric',
            validate: rowData => !!rowData.lock_inner_diameter && isFinite(rowData.lock_inner_diameter),
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
            title="Параметры труб"
            options={{
                pageSize: 5,
            }}
            localization={localizationMT}
            style={{display: 'grid'}}
            isLoading={isLoading}
            columns={columns}
            data={data}
            editable={edit ? {
                onRowAdd: newData => dispatch(createParameter(newData)),
                onRowUpdate: (newData, oldData) => dispatch(updateParameter(newData)),
                onRowDelete: oldData => dispatch(deleteParameter(oldData))
            } : {}}
        />
    )
}

export default Parameter