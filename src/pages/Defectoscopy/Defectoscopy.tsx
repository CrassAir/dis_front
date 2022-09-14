import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getDefectoscopy} from "../../store/actions/defect";
import {Box, Button, Collapse, LinearProgress, Stack} from "@mui/material";
import DefectItem from "./DefectItem";
import Grid from "@mui/material/Unstable_Grid2";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {TransitionGroup} from "react-transition-group";
import DefectPipeTable from "./DefectPipeTable";
import {getMoving} from "../../store/actions/kits";
import InfiniteScroll from 'react-infinite-scroller';


const Defectoscopy = () => {
    const dispatch = useAppDispatch()
    const {defectoscopy} = useAppSelector(state => state.defectReducer)
    const {isLoading} = useAppSelector(state => state.authReducer)
    const [create, setCreate] = useState(false)
    const [stopLoad, setStopLoad] = useState(true)

    useEffect(() => {
        dispatch(getDefectoscopy({}))
    }, [])

    useEffect(() => {
        setTimeout(() => setStopLoad(false), 500)
    }, [defectoscopy])

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid container>
                <Grid xs={12}>
                    <Stack spacing={2}>
                        <Button sx={{height: '40px'}} variant={'contained'} startIcon={<AddBoxIcon/>}
                                onClick={() => setCreate(true)}>
                            Создать
                        </Button>
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
            <DefectPipeTable/>
        </Box>
    );
};

export default Defectoscopy;