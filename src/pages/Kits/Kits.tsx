import React, {useEffect, useMemo, useState} from 'react';
import MaterialTable, {Column} from "material-table";
import Upload from "antd/lib/upload/Upload";
import {IconButton, Tooltip} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import type {RcFile} from 'antd/es/upload/interface';
import {general_state_choose, IKit, pipe_class_choose} from "../../models/IKit";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {convertListToObject, localizationMT} from "../utils";
import {createKit, deleteKit, getKits, updateKit} from "../../store/actions/kits";
import {getParameters} from "../../store/actions/catalog";
import ArticleIcon from '@mui/icons-material/Article';

type KitsProps = {
    kits: IKit[]
}

const Kits = ({kits}: KitsProps) => {
    const [data, setData] = useState<IKit[]>([])
    const dispatch = useAppDispatch()
    const {parameters} = useAppSelector(state => state.catalogReducer)
    const {isLoading} = useAppSelector(state => state.authReducer)
    const [file, setFile] = useState<RcFile | null>(null)

    let columns = useMemo<Column<IKit>[]>(() => ([
            {
                title: 'Параметры', field: 'parameter',
                lookup: parameters && convertListToObject(parameters),
                validate: rowData => !!rowData.parameter,
            },
            {
                title: 'Производитель', field: 'manufacturer_name',
                validate: rowData => !!rowData.manufacturer_name,
            },
            {
                title: 'Количество', field: 'amount',
                validate: rowData => !!rowData.amount,
            },
            {
                title: 'Класс труб', field: 'pipe_class',
                lookup: pipe_class_choose,
                validate: rowData => !!rowData.pipe_class,
            },
            {
                title: 'Состояние', field: 'general_state',
                lookup: general_state_choose,
                validate: rowData => !!rowData.general_state,
            },
            {
                title: 'Скан паспорта', field: 'passport',
                render: rowData => (
                    <Tooltip title={rowData.passport ? 'Просмотреть договор' : 'Договор не загружен'}>
                        <a href={`${rowData.passport}`} target={'_blank'} rel={'noopener noreferrer'}>
                            <IconButton color="primary" disabled={!rowData.passport}><FileOpenIcon/></IconButton>
                        </a>
                    </Tooltip>
                ),
                editComponent: props => (
                    <Upload
                        maxCount={1}
                        beforeUpload={(newfile) => {
                            setFile(newfile)
                            props.onChange(newfile)
                            return false
                        }}>
                        <IconButton color="primary"><UploadFileIcon/></IconButton>
                    </Upload>
                )
            },
        ]),
        [parameters]
    )

    useEffect(() => {
        dispatch(getKits())
        dispatch(getParameters())
    }, [])

    useEffect(() => {
        if (kits) setData(kits.map(kit => ({...kit, tableData: {}})))
    }, [kits])


    return (
        <MaterialTable
            title="Комплекты труб"
            options={{
                pageSize: 5,
            }}
            localization={localizationMT}
            style={{display: 'grid'}}
            isLoading={isLoading}
            columns={columns}
            data={data}
            actions={[
                rowData => ({
                    icon: () => <ArticleIcon/>,
                    tooltip: 'Трубы в комплекте',
                    disabled: !rowData.pipes,
                    onClick: (event, rowData) => alert("You saved")
                })
            ]}
            editable={{
                onRowAdd: newData => {
                    if (file) newData.passport = file
                    return dispatch(createKit(newData))
                },
                onRowUpdate: (newData) => {
                    if (file) newData.passport = file
                    return dispatch(updateKit(newData))
                },
                onRowDelete: oldData => dispatch(deleteKit(oldData))
            }}
        />
    )
}

export default Kits