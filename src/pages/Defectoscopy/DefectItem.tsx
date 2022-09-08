import React, {useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {IDefectoscopy} from "../../models/IDefectoscopy";
import {Box, Divider, Paper, Stack, Typography} from "@mui/material";
import moment from "moment";
import {getOrganizations, getTools} from "../../store/actions/catalog";
import {getStandarts} from "../../store/actions/defect";
import Grid from "@mui/material/Unstable_Grid2";

type DefectItemProps = {
    defect: IDefectoscopy
}

const DefectItem = ({defect}: DefectItemProps) => {
    const dispatch = useAppDispatch()
    const {tools, organizations} = useAppSelector(state => state.catalogReducer)
    const {standarts} = useAppSelector(state => state.defectReducer)

    useEffect(() => {
        if (tools.length === 0) dispatch(getTools())
        if (standarts.length === 0) dispatch(getStandarts())
        if (organizations.length === 0) dispatch(getOrganizations())
    }, [])

    const useTools = useMemo(() => {
        return <Stack spacing={1}>
            {tools.map((tool, index) => {
                if (defect.tools.includes(tool.id)) return <Typography key={index}>{tool.name}</Typography>
                return null
            })}
        </Stack>
    }, [tools])

    const useStandarts = useMemo(() => {
        return <Stack spacing={1}>
            {standarts.map((standart, index) => {
                if (defect.standarts.includes(standart.id)) return <Typography key={index}>{standart.name}</Typography>
                return null
            })}
        </Stack>
    }, [standarts])

    const useOrganization = useMemo(() => {
        return <Typography>{organizations.find(org => org.id === defect.organization)?.name}</Typography>
    }, [organizations])


    return (
        <Paper sx={{maxWidth: '1200px'}}>
            <Paper elevation={4}
                   sx={{backgroundColor: 'info.main', p: 1, position: 'relative'}}>
                <Box sx={{position: 'absolute', right: '0', top: '0'}}>
                </Box>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid xs={12} md={4}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Дата создания отчета:</Typography>
                            <Typography>{moment(defect.date_create).format('DD-MM-YYYY')}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Номер документа:</Typography>
                            <Typography>{defect.doc_number}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Номер заявки:</Typography>
                            <Typography>{defect.application_number}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
            <Box sx={{p: 1}}>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Организация:</Typography>
                            {useOrganization}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Место проведения:</Typography>
                            <Typography>{defect.location}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Инструмент:</Typography>
                            {useTools}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Стандарты:</Typography>
                            {useStandarts}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Divider variant="middle"/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Количество в комплекте:</Typography>
                            <Typography>{defect.kit_count}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Количество проверенных:</Typography>
                            <Typography>{defect.pipe_count}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Количество лома:</Typography>
                            <Typography>{defect.lom_count}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Divider variant="middle"/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Дата начала дефектоскопии:</Typography>
                            <Typography>{moment(defect.date_defectoscopy_start).format('DD-MM-YYYY')}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Дата окончания дефектоскопии:</Typography>
                            <Typography>{moment(defect.date_defectoscopy_end).format('DD-MM-YYYY')}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default DefectItem;