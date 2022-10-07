import React, {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {convertListToObject, localizationMT} from "../utils";
import {AppBar, Box, Dialog, IconButton, Slide, Toolbar, Typography} from "@mui/material";
import MaterialTable, {Column} from "material-table";
import {class_choices, IPipe} from "../../models/IDefectoscopy";
import {TransitionProps} from "@mui/material/transitions";
import {clearPipes} from "../../store/reducers/DefectReducer";
import CloseIcon from '@mui/icons-material/Close';
import {getConventions} from "../../store/actions/defect";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
})


const DefectPipeTable = () => {
    const [data, setData] = useState<IPipe[]>([])
    const dispatch = useAppDispatch()
    const {pipes, report, conventions} = useAppSelector(state => state.defectReducer)

    useEffect(() => {
        if (conventions.length === 0) dispatch(getConventions())
    }, [])

    const conventionList = useMemo(() => conventions ? convertListToObject(conventions) : {}, [conventions])


    const colorCell: any = {
        'lom': {borderLeft: '8px solid red', backgroundColor: 'rgba(255,187,187,0.5)'},
        'otbrak': {borderLeft: '8px solid blue', backgroundColor: 'rgba(187,253,255,0.5)'},
    }

    let columns = useMemo<Column<IPipe>[]>(() => ([
            {
                title: 'Серийный номер', field: 'serial_number', type: 'numeric'
            }, {
                title: 'Толщина стенки, мм', field: 'wall_thickness',
                type: 'numeric', align: 'center',
            }, {
                title: 'Состояние внутрю покрытия', field: 'internal_coatings',
                lookup: conventionList,
            }, {
                title: 'Искривление', field: 'curvature',
                lookup: conventionList,
            }, {
                title: 'ЭМК', field: 'emc',
                lookup: conventionList,
            }, {
                title: 'Износ по наружнему диаметру', field: 'outer_diameter',
                lookup: conventionList,
            }, {
                title: 'МПД Зоны Высадки и мест захвата', field: 'mpd',
                lookup: conventionList,
            }, {
                title: 'Общая длина, м', field: 'length',
                type: 'numeric', align: 'center',
            }, {
                title: 'Класс тела трубы', field: 'pipe_body_class',
                lookup: class_choices,
            }, {
                title: 'Наружний диаметр нипеля', field: 'nipple_outside_diameter',
                type: 'numeric', align: 'center',
            }, {
                title: 'Диаметр фаски нипеля', field: 'nipple_chamfer_diameter',
                type: 'numeric', align: 'center',
            }, {
                title: 'Длина нипеля', field: 'nipple_length',
                type: 'numeric', align: 'center',
                lookup: conventionList,
            }, {
                title: 'Место установки нипеля', field: 'nipple_location_of_the_key',
                type: 'numeric', align: 'center',
            }, {
                title: 'Внутренний диаметр нипеля', field: 'nipple_inner_diameter',
                type: 'numeric', align: 'center',
            }, {
                title: 'Тв.сплавная наплавка min', field: 'nipple_hard_alloy_welding_min',
                lookup: conventionList,
            }, {
                title: 'МПД Замкового соединения', field: 'nipple_mpd_lock_connection',
                lookup: conventionList,
            }, {
                title: 'Состояние нипеля', field: 'nipple_state',
                lookup: conventionList,
            }, {
                title: 'Класс замкового соединения', field: 'lock_connection_class',
                lookup: class_choices,
            }, {
                title: 'Наружний диаметр муфты, мм', field: 'coupling_outside_diameter',
                type: 'numeric', align: 'center',
            }, {
                title: 'Диаметр фаски муфты, мм', field: 'coupling_chamfer_diameter',
                type: 'numeric', align: 'center',
            }, {
                title: 'Ширина заплечника муфты, мм', field: 'coupling_shoulder_width',
                type: 'numeric', align: 'center',
            }, {
                title: 'Диаметр конусной выточки муфты, мм', field: 'coupling_taper_groove_diameter',
                type: 'numeric', align: 'center',
            }, {
                title: 'Глубина конусной выточки муфты, мм', field: 'coupling_depth_conical_undercut',
                type: 'numeric', align: 'center',
            }, {
                title: 'Место установки ключа, мм', field: 'coupling_key_installation_location',
                type: 'numeric', align: 'center',
            }, {
                title: 'Тв.сплавная наплавка min', field: 'coupling_hard_alloy_welding_min',
                lookup: conventionList,
            }, {
                title: 'МПД Резьбового соединения', field: 'coupling_mpd_threaded_connection',
                lookup: conventionList,
            }, {
                title: 'Состояние муфты', field: 'coupling_state',
                lookup: conventionList,
            }, {
                title: 'Класс муфты', field: 'coupling_class',
                lookup: class_choices,
            }, {
                title: 'Коментарий', field: 'comment',
                lookup: class_choices,
            },
        ]),
        [conventions, data]
    )

    let options = useMemo(() => ({
        pageSize: 20,
        draggable: false,
        emptyRowsWhenPaging: false,
        // rowStyle: (rowData: IKit) => colorCell[rowData.general_state]
    }), [])

    useEffect(() => {
        if (pipes) setData(pipes.map(pipe => ({...pipe, tableData: {}})))
    }, [pipes])

    return (
        <Dialog
            fullScreen
            open={pipes.length > 0}
            onClose={() => dispatch(clearPipes())}
            TransitionComponent={Transition}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <Typography variant={'h4'}>{report?.doc_number}</Typography>
                    <Box flexGrow={1}/>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => dispatch(clearPipes())}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <MaterialTable
                title={'Трубы'}
                options={options}
                localization={localizationMT}
                style={{display: 'grid'}}
                columns={columns}
                data={data}
            />
        </Dialog>
    )
}

export default DefectPipeTable