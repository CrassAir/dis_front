import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {IDefectoscopy} from "../../models/IDefectoscopy";
import {Box, Divider, IconButton, Paper} from "@mui/material";
import {getOrganizations, getTools} from "../../store/actions/catalog";
import {getStandarts} from "../../store/actions/defect";
import Grid from "@mui/material/Unstable_Grid2";
import EditableField from "./EditableField";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

type DefectItemProps = {
    defect: IDefectoscopy
}

const DefectItem = ({defect}: DefectItemProps) => {
    const dispatch = useAppDispatch()
    const {tools, organizations} = useAppSelector(state => state.catalogReducer)
    const {standarts} = useAppSelector(state => state.defectReducer)
    const [data, setData] = useState(defect)
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        if (tools.length === 0) dispatch(getTools())
        if (standarts.length === 0) dispatch(getStandarts())
        if (organizations.length === 0) dispatch(getOrganizations())
    }, [])

    const onEdit = () => {
        setEdit(!edit)
        if (!edit) setData(defect)
    }

    return (
        <Paper sx={{maxWidth: '1200px'}}>
            <Paper elevation={4}
                   sx={{
                       backgroundColor: data.date_defectoscopy_end ? 'success.light' : 'info.light',
                       p: 1,
                       position: 'relative'
                   }}>
                <Box sx={{position: 'absolute', right: '0', top: '0'}}>
                    <IconButton onClick={onEdit}>{edit ? <CancelIcon/> : <EditIcon/>}</IconButton>
                </Box>
                <Grid container spacing={2} columns={16} alignItems={"center"}>
                    <Grid xs={16} md={5}>
                        <EditableField title={'Дата создания отчета:'} value={data.date_create}/>
                    </Grid>
                    <Grid xs={16} md={5}>
                        <EditableField title={'Номер документа:'} value={defect.doc_number} edit={edit}/>
                    </Grid>
                    <Grid xs={16} md={5}>
                        <EditableField title={'Номер заявки:'} value={defect.application_number} edit={edit}/>
                    </Grid>
                </Grid>
            </Paper>
            <Box sx={{p: 1}}>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid xs={12} md={6}>
                        <EditableField title={'Организация:'} value={defect.organization} list={organizations}
                                       edit={edit}/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <EditableField title={'Место проведения:'} value={defect.location} edit={edit}/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <EditableField title={'Инструмент:'} value={defect.tools} list={tools} edit={edit}/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <EditableField title={'Стандарты:'} value={defect.standarts} list={standarts} edit={edit}/>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Divider variant="middle"/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <EditableField title={'Количество в комплекте:'} value={defect.kit_count}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <EditableField title={'Количество проверенных:'} value={defect.pipe_count} edit={edit}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <EditableField title={'Количество лома:'} value={defect.lom_count} edit={edit}/>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Divider variant="middle"/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <EditableField title={'Дата начала дефектоскопии:'} value={defect.date_defectoscopy_start}
                                       edit={edit}/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <EditableField title={'Дата окончания дефектоскопии:'} value={defect.date_defectoscopy_end}
                                       edit={edit}/>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default DefectItem;