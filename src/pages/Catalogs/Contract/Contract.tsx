import React, {useEffect, useMemo, useState} from 'react';
import MaterialTable, {Column} from "material-table";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {IContract} from "../../../models/ICatalog";
import {convertListToObject, localizationMT} from "../../utils";
import {
    createContract,
    deleteContract,
    getContracts,
    getOrganizations,
    updateContract
} from "../../../store/actions/catalog";
import Upload from "antd/lib/upload/Upload";
import {IconButton, Tooltip} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import type {RcFile} from 'antd/es/upload/interface';


const Contract = () => {
    const [data, setData] = useState<IContract[]>([])
    const dispatch = useAppDispatch()
    const {contracts, organizations} = useAppSelector(state => state.catalogReducer)
    const {isLoading} = useAppSelector(state => state.authReducer)
    const [file, setFile] = useState<RcFile | null>(null)

    let columns = useMemo<Column<IContract>[]>(() => ([
            {
                title: 'Номер договора', field: 'number',
                validate: rowData => !!rowData.number,
            },
            {
                title: 'Наименование', field: 'name',
                validate: rowData => !!rowData.name,
            },
            {
                title: 'Организация', field: 'organization',
                lookup: organizations && convertListToObject(organizations),
                validate: rowData => !!rowData.organization,
            },
            {
                title: 'Активный', field: 'active', type: 'boolean'
            },
            {
                title: 'Скан договора', field: 'doc',
                render: rowData => (
                    <Tooltip title={rowData.doc ? 'Просмотреть договор' : 'Договор не загружен'}>
                        <a href={`${rowData.doc}`} target={'_blank'} rel={'noopener noreferrer'}>
                            <IconButton color="primary" disabled={!rowData.doc}><FileOpenIcon/></IconButton>
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
        [organizations]
    )

    useEffect(() => {
        dispatch(getContracts())
        dispatch(getOrganizations())
    }, [])

    useEffect(() => {
        if (contracts) setData(contracts.map(contract => ({...contract, tableData: {}})))
    }, [contracts])


    return (
        <MaterialTable
            title="Договоры"
            options={{
                pageSize: 5,
            }}
            localization={localizationMT}
            style={{display: 'grid'}}
            isLoading={isLoading}
            columns={columns}
            data={data}
            editable={{
                onRowAdd: newData => {
                    if (file) newData.doc = file
                    return dispatch(createContract(newData))
                },
                onRowUpdate: (newData) => {
                    if (file) newData.doc = file
                    return dispatch(updateContract(newData))
                },
                onRowDelete: oldData => dispatch(deleteContract(oldData))
            }}
        />
    )
}

export default Contract