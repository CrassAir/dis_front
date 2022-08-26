import React, {useEffect, useMemo, useState} from 'react';
import {
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    MenuItem,
    Paper,
    Slide,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {ru} from "date-fns/locale";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import moment from 'moment';
import MovingForm from "./MovingForm";
import MovingItem from "./MovingItem";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getMoving} from "../../store/actions/kits";
import {moving_status} from "../../models/IKit";
import {clearStatusList} from "../../store/reducers/KitReducer";
import CloseIcon from '@mui/icons-material/Close';


const Moving = () => {
    const [selectDate, setSelectDate] = useState(moment())
    const [editData, setEditData] = useState<any | null>(null)
    const dispatch = useAppDispatch()
    const {movingList, statusList} = useAppSelector(state => state.kitReducer)

    useEffect(() => {
        dispatch(getMoving())
        window.scrollTo(0, 0)
    }, [])

    const movingForm = useMemo(() => (
        !!editData && <MovingForm onClose={() => setEditData(null)} editData={editData}/>
    ), [editData])

    const movingItems = useMemo(() => {
        return movingList.map(item => <MovingItem key={item.id} moving={item}/>)
    }, [movingList])

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
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
                                {Object.keys(moving_status).map(key => (
                                    <MenuItem key={key} value={key}>
                                        {moving_status[key as keyof typeof moving_status].status}
                                    </MenuItem>))}
                            </TextField>
                        </Paper>
                    </Grid>
                    <Grid sm={'auto'} xs={'auto'}>
                        <Button sx={{height: '40px'}} variant={'contained'} startIcon={<AddBoxIcon/>}
                                onClick={() => setEditData({})}>
                            Создать
                        </Button>
                    </Grid>
                </Grid>
                {movingItems}
            </Stack>
            {movingForm}
            <Drawer
                anchor={'right'}
                open={statusList.length > 0}
                onClose={() => dispatch(clearStatusList())}
            >
                <Box sx={{pt: 7, mb: 2,backgroundColor: 'primary.main'}}/>
                <IconButton
                    sx={{position: 'absolute', top: '64px', right: 0}}
                    onClick={() => dispatch(clearStatusList())}
                ><CloseIcon fontSize={'large'}/></IconButton>
                <Stack spacing={1} sx={{p: 1, width: {xs: '100vw', md: '400px'}}}>
                    {statusList.map(status => {
                        const stat = moving_status[status.status as keyof typeof moving_status]
                        return <Box key={status.id} sx={{p: 1, borderLeft: `5px solid`, borderLeftColor: stat.color}}>
                            <Typography>{moment(status.date_create).format('DD-MM-YYYY')}</Typography>
                            <Typography>{stat.status}</Typography>
                            <Typography>{status.comment}</Typography>
                            <Divider variant="middle" sx={{py: 1}}/>
                        </Box>
                    })}
                </Stack>
            </Drawer>
        </Box>
    )
}

export default Moving;
