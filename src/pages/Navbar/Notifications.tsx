import React, {useEffect, useMemo, useState} from 'react';
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import {Box, Divider, LinearProgress, Popover, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import InfiniteScroll from "react-infinite-scroller";
import {getNotifications} from "../../store/actions/auth";

const Notifications = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    const dispatch = useAppDispatch()
    const {notifications, isLoading} = useAppSelector(state => state.authReducer)
    const [stopLoad, setStopLoad] = useState(true)

    useEffect(() => {
        setTimeout(() => setStopLoad(false), 500)
    }, [notifications])

    const notifBody = useMemo(() => notifications.results.map(notif => (
        <Box key={notif.id} sx={{p: 1,}}>
            <Divider sx={{mb: 2}} variant="middle"/>
            <Stack spacing={2} direction={"row"}>
                <Typography color={"text.secondary"}>Дата создания:</Typography>
                <Typography>{moment(notif.date_create).format('DD-MM-YYYY')}</Typography>
            </Stack>
            {notif.message.split('\n').map(el => <Typography>{el}</Typography>)}
        </Box>
    )), [notifications])

    return (<>
            <IconButton edge='end'
                        onClick={(e) => {
                            setAnchorEl(e.currentTarget)
                            dispatch(getNotifications({}))
                        }}>
                <NotificationsIcon/>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{overflow: 'auto', height: {xs: '90vh', md: '60vh'}, width: {xs: '90vw', md: '500px'}}}>
                    <Box sx={{position: 'sticky', top: 0, right: 0, m: 1, backgroundColor: '#f5f8f8'}}>
                        <Typography variant={'h5'} sx={{p: 1}}>Уведомления</Typography>
                        <IconButton sx={{position: 'absolute', top: 0, right: 0}}
                                    onClick={() => setAnchorEl(null)}><CloseIcon
                            fontSize={'large'}/></IconButton>
                    </Box>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => {
                            if (!isLoading && !stopLoad) {
                                setStopLoad(true)
                                dispatch(getNotifications(notifications))
                            }
                        }}
                        hasMore={!!notifications.next}
                        loader={<LinearProgress key={'loading'} sx={{height: 10}} color={'secondary'}/>}
                        threshold={100}
                        useWindow={false}
                    >
                        <Stack spacing={1} sx={{m: 1}}>
                            {notifBody}
                        </Stack>
                    </InfiniteScroll>
                </Box>
            </Popover>
        </>
    );
};

export default Notifications;