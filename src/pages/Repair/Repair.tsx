import React, {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {RcFile} from "antd/es/upload/interface";
import {convertListToObject, localizationMT, validateEditAccess} from "../utils";
import {Box, IconButton, Paper, Tooltip} from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import MaterialTable, {Column} from "material-table";
import Upload from "antd/lib/upload/Upload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {IRepair} from "../../models/IKit";
import {createRepair, deleteRepair, getKits, getRepairs, updateRepair} from "../../store/actions/kits";
import {getRepairContractor} from "../../store/actions/catalog";

const Repair = () => {
    const [data, setData] = useState<IRepair[]>([])
    const dispatch = useAppDispatch()
    const {user, isLoading} = useAppSelector(state => state.authReducer)
    const {repair_contractors} = useAppSelector(state => state.catalogReducer)
    const {repairs, kits} = useAppSelector(state => state.kitReducer)
    const [file, setFile] = useState<RcFile | null>(null)

    useEffect(() => {
        dispatch(getRepairs())
        if (repair_contractors.length === 0) dispatch(getRepairContractor())
        if (kits.length === 0) dispatch(getKits())
    }, [])

    useEffect(() => {
        if (repairs) setData(repairs.map(repair => ({...repair, tableData: {}})))
    }, [repairs])

    const edit = useMemo(() => validateEditAccess(user!, 'repair'), [user])

    const scanDoc = (rowData: IRepair) => {
        if (rowData.act_scan) {
            return <Tooltip title={'Просмотреть Акт'}>
                <a href={`${rowData.act_scan}`} target={'_blank'} rel={'noopener noreferrer'}>
                    <IconButton color="primary"><FileOpenIcon/></IconButton>
                </a>
            </Tooltip>
        }
        return <Tooltip title={'Акт не загружен'}>
             <span>
                <IconButton color="primary" disabled={true}><FileOpenIcon/></IconButton>
             </span>
        </Tooltip>
    }

    let columns = useMemo<Column<IRepair>[]>(() => ([
            {
                title: 'Дата создания', field: 'date_create',
                editable: 'never', type: 'date',
            },
            {
                title: 'Подрятчики', field: 'repair_contractor',
                validate: rowData => !!rowData.repair_contractor,
                lookup: repair_contractors && convertListToObject(repair_contractors),
            },
            {
                title: 'Комплект', field: 'kit',
                validate: rowData => !!rowData.kit,
                lookup: kits && convertListToObject(kits),
            },
            {
                title: 'Описание', field: 'description'
            },
            {
                title: 'Акт выполненых работ', field: 'act_scan',
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
        [data, repair_contractors, kits]
    )

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Paper sx={{width: '1200px',}}>
                <MaterialTable
                    title="Ремонты"
                    options={{
                        pageSize: 20,
                        draggable: false,
                    }}
                    localization={localizationMT}
                    style={{display: 'grid'}}
                    isLoading={isLoading}
                    columns={columns}
                    data={data}
                    editable={edit ? {
                        onRowAdd: newData => {
                            if (file) newData.act_scan = file
                            return dispatch(createRepair(newData))
                        },
                        onRowUpdate: (newData) => {
                            if (file) newData.act_scan = file
                            return dispatch(updateRepair(newData))
                        },
                        onRowDelete: oldData => dispatch(deleteRepair(oldData))
                    } : {}}
                />
            </Paper>
        </Box>
    )
}

export default Repair;