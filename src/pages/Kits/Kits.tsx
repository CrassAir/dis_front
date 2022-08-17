import React, {useEffect, useMemo, useState} from 'react';
import MaterialTable, {Column} from "material-table";
import Upload from "antd/lib/upload/Upload";
import {Dialog, IconButton, MenuItem, TextField, Tooltip} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import type {RcFile} from 'antd/es/upload/interface';
import {general_state_choose, IKit, ITeamKit, pipe_class_choose} from "../../models/IKit";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {convertListToObject, localizationMT, validateEditAccess} from "../utils";
import {createKit, deleteKit, getKits, updateKit} from "../../store/actions/kits";
import {getManufacturers, getParameters} from "../../store/actions/catalog";
import ArticleIcon from '@mui/icons-material/Article';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MovingForm from "../Moving/MovingForm";


type KitsProps = {
    teamKit: ITeamKit,
}

const Kits = ({teamKit}: KitsProps) => {
    const [data, setData] = useState<IKit[]>([])
    const dispatch = useAppDispatch()
    const {kits} = teamKit
    const {parameters, manufacturers} = useAppSelector(state => state.catalogReducer)
    const {user, isLoading} = useAppSelector(state => state.authReducer)
    const [file, setFile] = useState<RcFile | null>(null)
    const [openMoving, setOpenMoving] = useState<IKit | null>(null)

    const edit = useMemo(() => validateEditAccess(user!, 'to_team'), [user])
    const editDelivery = useMemo(() => validateEditAccess(user!, 'to_delivery'), [user])

    const detailMoving = () => {
        const handleClose = () => {
            setOpenMoving(null)
        }

        return (
            <Dialog
                open={!!openMoving}
                onClose={handleClose}
            >
                <MovingForm editData={openMoving} onClose={handleClose}/>
            </Dialog>
        )
    }

    const scanPassport = (rowData: IKit) => {
        if (rowData.passport) {
            return <Tooltip title={'Просмотреть cкан паспорта'}>
                <a href={`${rowData.passport}`} target={'_blank'} rel={'noopener noreferrer'}>
                    <IconButton color="primary"><FileOpenIcon/></IconButton>
                </a>
            </Tooltip>
        }
        return <Tooltip title={'Скан паспорта не загружен'}>
             <span>
                <IconButton color="primary" disabled={true}><FileOpenIcon/></IconButton>
             </span>
        </Tooltip>
    }

    const colorCell: any = {
        '2': {borderLeft: '8px solid red', backgroundColor: 'rgba(255,187,187,0.5)'},
        '3': {borderLeft: '8px solid orange', backgroundColor: 'rgba(255,249,187,0.5)'},
        '4': {borderLeft: '8px solid green', backgroundColor: 'rgba(206,255,187,0.5)'},
        '5': {borderLeft: '8px solid green', backgroundColor: 'rgba(206,255,187,0.5)'},
    }

    let columns = useMemo<Column<IKit>[]>(() => ([
            {
                title: 'Параметры', field: 'parameter',
                lookup: parameters && convertListToObject(parameters),
                validate: rowData => !!rowData.parameter,
            },
            {
                title: 'Производитель', field: 'manufacturer',
                lookup: manufacturers && convertListToObject(manufacturers),
                validate: rowData => !!rowData.manufacturer,
                editComponent: rowData => {
                    return <TextField select value={rowData.value || ''} onChange={e => rowData.onChange(e.target.value)}>
                        <MenuItem key={''} value={''}>Пусто</MenuItem>
                        {manufacturers.map(man => <MenuItem key={man.id} value={man.id}>{man.name}</MenuItem>)}
                    </TextField>
                }
            },
            {
                title: 'Количество', field: 'amount', type: 'numeric',
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
                customSort: (a, b) => Number(a.general_state) - Number(b.general_state),
                validate: rowData => !!rowData.general_state,
            },
            {
                title: 'Скан паспорта', field: 'passport',
                render: rowData => scanPassport(rowData),
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
        [parameters, manufacturers]
    )

    useEffect(() => {
        dispatch(getKits())
        dispatch(getManufacturers())
        dispatch(getParameters())
    }, [])

    useEffect(() => {
        if (kits) setData(kits.map(kit => ({...kit, tableData: {}})))
    }, [kits])


    return (
        <>
            <MaterialTable
                title="Комплекты труб"
                options={{
                    pageSize: 5,
                    rowStyle: rowData => colorCell[rowData.general_state]
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
                        disabled: rowData.pipes?.length === 0,
                        onClick: (event, rowData) => alert("You saved")
                    }),
                    rowData => ({
                        icon: () => rowData.id % 2 === 0 ? <LocalShippingIcon/> : <LocalShippingOutlinedIcon/>,
                        tooltip: 'Перемещение комплекта' + (rowData.id % 2 === 0 ? '(в пути)' : ''),
                        disabled: !editDelivery,
                        onClick: (event, rowData) => {
                            // @ts-ignore
                            setOpenMoving(rowData)
                        }
                    })
                ]}
                editable={edit ? {
                    onRowAdd: newData => {
                        if (file) newData.passport = file
                        newData.team_kit = teamKit.id
                        return dispatch(createKit(newData))
                    },
                    onRowUpdate: (newData) => {
                        if (file) newData.passport = file
                        return dispatch(updateKit(newData))
                    },
                    onRowDelete: oldData => dispatch(deleteKit(oldData))
                } : {}}
            />
            {detailMoving()}
        </>
    )
}

export default Kits