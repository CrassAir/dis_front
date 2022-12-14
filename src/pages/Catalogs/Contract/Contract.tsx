import React, {useEffect, useMemo, useState} from 'react';
import MaterialTable, {Column} from "material-table";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {IContract} from "../../../models/ICatalog";
import {convertListToObject, localizationMT, validateEditAccess} from "../../utils";
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
    const {user} = useAppSelector(state => state.authReducer)
    const [file, setFile] = useState<RcFile | null>(null)

    const edit = useMemo(() => validateEditAccess(user!, 'directory'), [user])

    const scanDoc = (rowData: IContract) => {
        if (rowData.doc) {
            return <Tooltip title={'Просмотреть договор'}>
                <a href={`${rowData.doc}`} target={'_blank'} rel={'noopener noreferrer'}>
                    <IconButton color="primary"><FileOpenIcon/></IconButton>
                </a>
            </Tooltip>
        }
        return <Tooltip title={'Договор не загружен'}>
             <span>
                <IconButton color="primary" disabled={true}><FileOpenIcon/></IconButton>
             </span>
        </Tooltip>
    }

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
                render: rowData => scanDoc(rowData),
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
        if (contracts.length === 0) dispatch(getContracts())
        if (organizations.length === 0) dispatch(getOrganizations())
    }, [])

    useEffect(() => {
        if (contracts) setData(contracts.map(contract => ({...contract, tableData: {}})))
    }, [contracts])


    return (
        <MaterialTable
            title="Договоры"
            options={{
                pageSize: 5,
                draggable: false,
            }}
            localization={localizationMT}
            style={{display: 'grid'}}
            columns={columns}
            data={data}
            editable={edit ? {
                onRowAdd: newData => {
                    if (file) newData.doc = file
                    return dispatch(createContract(newData))
                },
                onRowUpdate: (newData) => {
                    if (file) newData.doc = file
                    else newData.doc = undefined
                    return dispatch(updateContract(newData))
                },
                onRowDelete: oldData => dispatch(deleteContract(oldData))
            } : {}}
        />
    )
}

export default Contract