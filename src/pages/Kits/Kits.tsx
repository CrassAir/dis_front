import React, {useEffect, useMemo, useState} from 'react';
import MaterialTable, {Column} from "material-table";
import Upload from "antd/lib/upload/Upload";
import {IconButton, Tooltip} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import type {RcFile} from 'antd/es/upload/interface';
import {general_state_choose, IKits, pipe_class_choose} from "../../models/IKits";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {convertListToObject, localizationMT} from "../utils";
import {getKits} from "../../store/actions/kits";
import {getParameters} from "../../store/actions/catalog";
import ArticleIcon from '@mui/icons-material/Article';


const Contract = () => {
    const [data, setData] = useState<IKits[]>([])
    const dispatch = useAppDispatch()
    const {kits} = useAppSelector(state => state.kitReducer)
    const {parameters} = useAppSelector(state => state.catalogReducer)
    const {isLoading} = useAppSelector(state => state.authReducer)
    const [file, setFile] = useState<RcFile | null>(null)

    let columns = useMemo<Column<IKits>[]>(() => ([
            {
                title: 'Параметры', field: 'parameters',
                lookup: parameters && convertListToObject(parameters),
                validate: rowData => !!rowData.parameters,
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
                        <a href={`${rowData.passport}`} target={'_blank'}>
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
            // editable={{
            //     onRowAdd: newData => {
            //         if (file) newData.doc = file
            //         return dispatch(createContract(newData))
            //     },
            //     onRowUpdate: (newData) => {
            //         if (file) newData.doc = file
            //         return dispatch(updateContract(newData))
            //     },
            //     onRowDelete: oldData => dispatch(deleteContract(oldData))
            // }}
        />
    )
}

export default Contract