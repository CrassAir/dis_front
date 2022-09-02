import React, {useEffect, useMemo, useState} from 'react';
import {
    Box,
    Button, CircularProgress,
    MenuItem,
    Paper,
    Stack,
    TextField,
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
import StatusDrawer from "./StatusDrawer";
import InfiniteScroll from 'react-infinite-scroller';
import {useLocation, useNavigate, useParams} from "react-router-dom";

const Moving = () => {
    const [selectDate, setSelectDate] = useState(moment())
    const [editData, setEditData] = useState<any | null>(null)
    const location = useLocation()
    const navigation = useNavigate()
    const {id} = useParams()
    const dispatch = useAppDispatch()
    const {movingList} = useAppSelector(state => state.kitReducer)

    useEffect(() => {
        dispatch(getMoving({id: id}))
        window.scrollTo(0, 0)
    }, [])

    const movingForm = useMemo(() => (
        !!editData && <MovingForm onClose={() => setEditData(null)} editData={editData}/>
    ), [editData])

    const movingItems = useMemo(() => {
        return movingList.results.map(item => <MovingItem key={item.id} moving={item}/>)
    }, [movingList])

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Stack spacing={2}>
                <Grid container spacing={2} justifyContent={{xs: "center", sm: "flex-start"}}>
                    <Grid sm={'auto'} xs={5}>
                        <Paper>
                            <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year', 'month']}
                                    value={selectDate}
                                    minDate={new Date('2022-01-01')}
                                    maxDate={new Date('2023-12-01')}
                                    onChange={(e) => {
                                        setSelectDate(moment(e))
                                        dispatch(getMoving({date: e}))
                                        if (location.pathname !== '/delivery') navigation('', {replace: true})
                                    }}
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
                    <Grid sm={'auto'} xs={4}>
                        <Button sx={{height: '40px'}} variant={'contained'} startIcon={<AddBoxIcon/>}
                                onClick={() => setEditData({})}>
                            Создать
                        </Button>
                    </Grid>
                </Grid>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => dispatch(getMoving(movingList))}
                    hasMore={!!movingList.next}
                    loader={<CircularProgress/>}
                >
                    <Stack spacing={2}>
                        {movingItems}
                    </Stack>
                </InfiniteScroll>
            </Stack>
            {movingForm}
            <StatusDrawer/>
        </Box>
    )
}

export default Moving;
