import React, {useEffect, useMemo, useState} from 'react';
import MaterialTable, {Column} from "material-table";
import Upload from "antd/lib/upload/Upload";
import {Box, Button, IconButton, MenuItem, TextField, Tooltip, Typography} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import type {RcFile} from 'antd/es/upload/interface';
import {general_state_choose, IKit, ITeamKit, moving_status, pipe_class_choose} from "../../models/IKit";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {convertListToObject, localizationMT, validateEditAccess} from "../utils";
import {changeStatusMoving, createKit, deleteKit, getOperatingTime, updateKit} from "../../store/actions/kits";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ReplyIcon from '@mui/icons-material/Reply';
import MovingForm from "../Moving/MovingForm";
import {useNavigate} from "react-router-dom";
import {getManufacturers, getParameters} from "../../store/actions/catalog";


type KitsProps = {
    teamKit: ITeamKit,
}

const Kits = ({teamKit}: KitsProps) => {
    const [data, setData] = useState<IKit[]>([])
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const {kits} = teamKit
    const {parameters, manufacturers} = useAppSelector(state => state.catalogReducer)
    const {user} = useAppSelector(state => state.authReducer)
    const [file, setFile] = useState<RcFile | null>(null)
    const [openMoving, setOpenMoving] = useState<IKit | null>(null)

    useEffect(() => {
        if (manufacturers.length === 0) dispatch(getManufacturers())
        if (parameters.length === 0) dispatch(getParameters())
    }, [])

    const edit = useMemo(() => validateEditAccess(user!, 'teams'), [user])

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

    const movingForm = useMemo(() => (
        !!openMoving && <MovingForm editData={openMoving} onClose={() => setOpenMoving(null)}/>
    ), [openMoving])

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
                cellStyle: {minWidth: '250px'}

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
                },
                cellStyle: {minWidth: '250px'}
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

    let options = useMemo(() => ({
        pageSize: 5,
        draggable: false,
        rowStyle: (rowData: IKit) => colorCell[rowData.general_state]
    }), [])

    useEffect(() => {
        if (kits) setData(kits.map(kit => ({...kit, tableData: {}})))
    }, [kits])


    return (
        <Box>
            <MaterialTable
                title={'Комплекты труб'}
                options={options}
                localization={localizationMT}
                style={{display: 'grid'}}
                columns={columns}
                data={data}
                actions={[
                    {
                        icon: () => <MoreTimeIcon/>,
                        tooltip: 'Наработка',
                        isFreeAction: true,
                        onClick: () => dispatch(getOperatingTime({team_kit: teamKit.id}))
                    },
                    // rowData => ({
                    //     icon: () => <ArticleIcon/>,
                    //     tooltip: 'Трубы в комплекте',
                    //     disabled: rowData.pipes?.length === 0,
                    //     onClick: (event, rowData) => alert("You saved")
                    // }),
                    rowData => ({
                        icon: () => [null, 'create', 'sent'].includes(rowData.last_status_name) ? <LocalShippingIcon/> :
                            <ReplyIcon/>, //: <LocalShippingOutlinedIcon/>,
                        tooltip: rowData.last_status_name ? moving_status[rowData.last_status_name as keyof typeof moving_status].status : 'Созадать перемещение',
                        disabled: ['sent', 'back'].includes(rowData.last_status_name),
                        hidden: teamKit?.name !== user!.team_name,
                        onClick: (event) => {
                            if (['received', 'not_received'].includes(rowData.last_status_name)) {
                                dispatch(changeStatusMoving({
                                    id: rowData.last_moving_id,
                                    forward: true
                                })).then(() => navigation('delivery'))
                            } else {
                                setOpenMoving(rowData)
                            }
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
            {movingForm}
        </Box>
    )
}

export default Kits