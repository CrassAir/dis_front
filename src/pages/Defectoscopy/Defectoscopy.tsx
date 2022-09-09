import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getDefectoscopy} from "../../store/actions/defect";
import {Box, Stack} from "@mui/material";
import DefectItem from "./DefectItem";
import Grid from "@mui/material/Unstable_Grid2";


const Defectoscopy = () => {
    const dispatch = useAppDispatch()
    const {defectoscopy} = useAppSelector(state => state.defectReducer)

    useEffect(() => {
        if (defectoscopy.length === 0) dispatch(getDefectoscopy())
    }, [])

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid container>
                <Grid xs={12}>
                    <Stack spacing={2}>
                        {/*<DefectItem defect={{}} />*/}
                        {defectoscopy.map((defect, index) => (
                            <DefectItem key={index} defect={defect}/>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Defectoscopy;