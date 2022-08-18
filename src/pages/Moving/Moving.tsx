import React, {useMemo, useState} from 'react';
import {Box, Button, MenuItem, Paper, Stack, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {ru} from "date-fns/locale";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import moment from 'moment';
import MovingForm from "./MovingForm";

const Moving = () => {
    const [selectDate, setSelectDate] = useState(moment())
    const [editData, setEditData] = useState<any | null>(null)

    const movingForm = useMemo(() => (
        <MovingForm onClose={() => setEditData(null)} editData={editData}/>
    ), [editData])

    return (
        <>
            <Stack spacing={2}>
                <Grid container spacing={2} justifyContent={{xs: "center", sm: "flex-start"}}>
                    <Grid sm={'auto'} xs={'auto'}>
                        <Paper>
                            <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year', 'month']}
                                    value={selectDate}
                                    minDate={new Date('2022-01-01')}
                                    maxDate={new Date('2023-12-01')}
                                    onChange={(e) => setSelectDate(moment(e))}
                                    renderInput={(params: any) => <TextField {...params} size={'small'}/>}
                                />
                            </LocalizationProvider>
                        </Paper>
                    </Grid>
                    <Grid sm={'auto'} xs={'auto'}>
                        <Paper>
                            <TextField
                                select
                                size={'small'}
                                defaultValue={'all'}
                            >
                                <MenuItem value={'all'}>Все</MenuItem>
                                <MenuItem value={1}>Создан</MenuItem>
                                <MenuItem value={2}>В пути</MenuItem>
                                <MenuItem value={3}>Доставлен</MenuItem>
                            </TextField>
                        </Paper>
                    </Grid>
                    <Grid sm={'auto'} xs={'auto'}>
                        <Button sx={{height: '40px'}} variant={'contained'} startIcon={<AddBoxIcon/>}
                                onClick={() => setEditData({})}

                        >Создать</Button>
                    </Grid>
                </Grid>
                <Paper sx={{p: 1}}>
                    <Grid container spacing={2}>
                        <Grid xs={12} md={10}>
                            <Stack spacing={1} direction={'row'}>
                                <Typography color={'text.secondary'}>Дата создания:</Typography>
                                <Typography>01-02-2022</Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={2}>
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Button sx={{height: '40px'}} variant={'contained'}
                                        startIcon={<AddBoxIcon/>}>Создать</Button>
                            </Box>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Stack spacing={1} direction={'row'}>
                                <Typography color={'text.secondary'}>Бригада отправитель:</Typography>
                                <Typography>Тест</Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Stack spacing={1} direction={'row'}>
                                <Typography color={'text.secondary'}>Бригада получатель:</Typography>
                                <Typography>Тест</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Stack>
            {movingForm}
        </>
    )
}

export default Moving;