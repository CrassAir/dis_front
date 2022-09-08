import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getDefectoscopy} from "../../store/actions/defect";
import {Box, Stack} from "@mui/material";
import DefectItem from "./DefectItem";


const Defectoscopy = () => {
    const dispatch = useAppDispatch()
    const {defectoscopy} = useAppSelector(state => state.defectReducer)

    useEffect(() => {
        if (defectoscopy.length === 0) dispatch(getDefectoscopy())
    }, [])

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Stack spacing={2}>
                {defectoscopy.map((defect, index) => (
                    <DefectItem key={index} defect={defect}/>
                ))}
            </Stack>
        </Box>
    );
};

export default Defectoscopy;