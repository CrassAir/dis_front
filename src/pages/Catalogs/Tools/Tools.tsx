import React, {useEffect, useMemo, useState} from 'react';
import MaterialTable, {Column} from "material-table";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {ITools} from "../../../models/ICatalog";
import {localizationMT, validateEditAccess} from "../../utils";
import {createTool, deleteTool, getTools, updateTool} from "../../../store/actions/catalog";
import {TextField} from "@mui/material";
import {ru} from 'date-fns/locale'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';


const Tools = () => {
    const [data, setData] = useState<ITools[]>([])
    const dispatch = useAppDispatch()
    const {tools} = useAppSelector(state => state.catalogReducer)
    const {user, isLoading} = useAppSelector(state => state.authReducer)

    const edit = useMemo(() => validateEditAccess(user!, 'directory'), [user])

    let columns = useMemo<Column<ITools>[]>(() => ([
        {
            title: 'Наименование', field: 'name',
            validate: rowData => !!rowData.name,
        },
        {
            title: 'Серийный номер', field: 'serial_number',
            validate: rowData => !!rowData.serial_number,
        },
        {
            title: 'Дата последней калибровки', field: 'date_last_verification', type: 'date',
            validate: rowData => 'date_last_verification' in rowData,
            editComponent: props => (
                <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
                    <DatePicker
                        value={props.value || null}
                        onChange={props.onChange}
                        renderInput={(params: any) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            )
        },
        {
            title: 'Дата следующей калибровки', field: 'date_next_verification', type: 'date',
            editComponent: props => (
                <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
                    <DatePicker
                        value={props.value || null}
                        onChange={props.onChange}
                        renderInput={(params: any) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            )
        },
    ]), [])

    useEffect(() => {
        dispatch(getTools())
    }, [])

    useEffect(() => {
        if (tools) setData(tools.map(tool => ({...tool, tableData: {}})))
    }, [tools])


    return (
        <MaterialTable
            title="Инструменты"
            options={{
                pageSize: 5,
                draggable: false,
            }}
            localization={localizationMT}
            style={{display: 'grid'}}
            isLoading={isLoading}
            columns={columns}
            data={data}
            editable={edit ? {
                onRowAdd: newData => dispatch(createTool(newData)),
                onRowUpdate: (newData, oldData) => dispatch(updateTool(newData)),
                onRowDelete: oldData => dispatch(deleteTool(oldData))
            } : {}}
        />
    )
}

export default Tools