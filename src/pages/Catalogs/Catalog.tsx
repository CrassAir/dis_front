import React from 'react';
import Parameter from "./Parameter/Parameter";
import Grid from '@mui/material/Unstable_Grid2';
import Tools from "./Tools/Tools";
import Contract from "./Contract/Contract";
import {useLocation} from "react-router-dom";
import {navList} from "../../App";

const Catalog = () => {
    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Parameter/>
            </Grid>
            <Grid xs={12} lg={6}>
                <Tools/>
            </Grid>
            <Grid xs={12} lg={6}>
                <Contract/>
            </Grid>
        </Grid>
    )
}

export default Catalog;