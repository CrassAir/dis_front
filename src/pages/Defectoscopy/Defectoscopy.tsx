import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getDefectoscopy} from "../../store/actions/defect";
import {Box, Button, Collapse, Stack} from "@mui/material";
import DefectItem from "./DefectItem";
import Grid from "@mui/material/Unstable_Grid2";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {TransitionGroup} from "react-transition-group";


const Defectoscopy = () => {
    const dispatch = useAppDispatch()
    const {defectoscopy} = useAppSelector(state => state.defectReducer)
    const [create, setCreate] = useState(false)

    useEffect(() => {
        if (defectoscopy.length === 0) dispatch(getDefectoscopy())
    }, [])

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid container>
                <Grid xs={12}>
                    <Stack spacing={2}>
                        <Button sx={{height: '40px'}} variant={'contained'} startIcon={<AddBoxIcon/>}
                                onClick={() => setCreate(true)}>
                            Создать
                        </Button>
                        <TransitionGroup component={null}>
                            {create &&
                                <Collapse key={'new'}>
                                    <DefectItem defect={{}} create={true} exit={setCreate}/>
                                </Collapse>
                            }
                            {defectoscopy.map((defect) => (
                                <Collapse key={defect.id}>
                                    <DefectItem key={defect.id} defect={defect}/>
                                </Collapse>
                            ))}
                        </TransitionGroup>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Defectoscopy;