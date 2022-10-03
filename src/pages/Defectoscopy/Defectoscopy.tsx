import React, {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getDefectoscopy, getStandarts} from "../../store/actions/defect";
import {Box, Button, Collapse, LinearProgress, Paper, Stack, TextField} from "@mui/material";
import DefectItem from "./DefectItem";
import Grid from "@mui/material/Unstable_Grid2";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {TransitionGroup} from "react-transition-group";
import DefectPipeTable from "./DefectPipeTable";
import InfiniteScroll from 'react-infinite-scroller';
import {getOrganizations, getTools} from "../../store/actions/catalog";
import {getOrganizationsTK} from "../../store/actions/kits";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {ru} from "date-fns/locale";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import moment from "moment/moment";
import {validateEditAccess} from "../utils";


const Defectoscopy = () => {
    const dispatch = useAppDispatch()
    const {defectoscopy, standarts} = useAppSelector(state => state.defectReducer)
    const {tools, organizations} = useAppSelector(state => state.catalogReducer)
    const {organizationsTK} = useAppSelector(state => state.kitReducer)
    const {user, isLoading} = useAppSelector(state => state.authReducer)
    const [create, setCreate] = useState(false)
    const [stopLoad, setStopLoad] = useState(true)
    const [selectDate, setSelectDate] = useState(moment())

    const can_edit = useMemo(() => validateEditAccess(user!, 'defectoscopy'), [user])

    useEffect(() => {
        dispatch(getDefectoscopy({}))
        if (tools.length === 0) dispatch(getTools())
        if (standarts.length === 0) dispatch(getStandarts())
        if (organizations.length === 0) dispatch(getOrganizations())
        if (organizationsTK.length === 0) dispatch(getOrganizationsTK())
    }, [])

    useEffect(() => {
        setTimeout(() => setStopLoad(false), 500)
    }, [defectoscopy])

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{maxWidth: '1200px'}}>
                <Grid container spacing={2}>
                    <Grid xs={12}>
                        <Stack spacing={2} direction={'row'}>
                            <Paper>
                                <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        views={['month', 'year']}
                                        value={selectDate}
                                        minDate={new Date('2022-01-01')}
                                        maxDate={new Date('2023-12-01')}
                                        onChange={(e) => {
                                            const tmp = moment(e)
                                            if (tmp.isValid()) {
                                                setSelectDate(tmp)
                                                dispatch(getDefectoscopy({date: e}))
                                            }
                                            // if (location.pathname !== '/delivery') navigation('', {replace: true})
                                        }}
                                        renderInput={(params: any) => <TextField {...params} size={'small'}/>}
                                    />
                                </LocalizationProvider>
                            </Paper>
                            <Button sx={{height: '40px'}} disabled={!can_edit} variant={'contained'} startIcon={<AddBoxIcon/>}
                                    onClick={() => setCreate(true)}>
                                Создать
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid xs={12}>
                        <Stack spacing={2}>
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={() => {
                                    if (!isLoading && !stopLoad) {
                                        setStopLoad(true)
                                        dispatch(getDefectoscopy(defectoscopy))
                                    }
                                }}
                                hasMore={!!defectoscopy.next}
                                loader={<LinearProgress key={'loading'} sx={{height: 10}} color={'secondary'}/>}
                                threshold={100}
                            >
                                <Stack spacing={2}>
                                    <TransitionGroup component={null}>
                                        {create &&
                                            <Collapse key={'new'}>
                                                <DefectItem defect={{}} create={true} exit={setCreate}/>
                                            </Collapse>
                                        }
                                        {defectoscopy.results.map((defect) => (
                                            <Collapse key={defect.id}>
                                                <DefectItem key={defect.id} defect={defect}/>
                                            </Collapse>
                                        ))}
                                    </TransitionGroup>
                                </Stack>
                            </InfiniteScroll>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            <DefectPipeTable/>
        </Box>
    );
};

export default Defectoscopy;