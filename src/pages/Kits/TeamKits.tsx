import React, {useEffect} from 'react';
import {Box, Grid, Paper, Typography} from "@mui/material";
import Kits from "./Kits";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getTeamKits} from "../../store/actions/kits";

const TeamKits = () => {
    const dispatch = useAppDispatch()
    const {teamKits} = useAppSelector(state => state.kitReducer)

    useEffect(() => {
        dispatch(getTeamKits())
    }, [])
    return (
        <Box>
            {teamKits.map(teamKit => (
                <Paper sx={{p: 1}} key={teamKit.id}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} textAlign={'center'}>
                            <Typography variant="h5" gutterBottom>
                                {teamKit.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Paper>xs=6 md=4</Paper>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Paper>xs=6 md=4</Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Kits kits={teamKit.kits}/>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </Box>
    )
};

export default TeamKits;