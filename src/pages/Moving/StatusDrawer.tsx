import React, {useEffect, useMemo, useState} from 'react';
import {Box, Divider, Drawer, IconButton, LinearProgress, Stack, Typography} from "@mui/material";
import {clearStatusList} from "../../store/reducers/KitReducer";
import CloseIcon from "@mui/icons-material/Close";
import {moving_status} from "../../models/IKit";
import moment from "moment/moment";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getStatus} from "../../store/actions/kits";
import InfiniteScroll from "react-infinite-scroller";

const StatusDrawer = () => {
    const dispatch = useAppDispatch()
    const {statusList} = useAppSelector(state => state.kitReducer)
    const {isLoading} = useAppSelector(state => state.authReducer)
    const [stopLoad, setStopLoad] = useState(true)

    useEffect(() => {
        setTimeout(() => setStopLoad(false), 500)
    }, [statusList])

    const visibilityBox = useMemo(() => document.querySelector('header')?.style.visibility !== 'hidden', [statusList])

    const drawerBody = useMemo(() => statusList.results.map((status, index) => {
        const stat = moving_status[status.status as keyof typeof moving_status]
        return <React.Fragment key={index}>
            <Divider variant="middle"/>
            <Box sx={{p: 1, pl: 2, position: 'relative'}}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '4px',
                    backgroundColor: stat.color,
                    borderRadius: '4px'
                }}/>
                <Stack direction={'row'} spacing={2}>
                    <Typography color={"text.secondary"}>Дата:</Typography>
                    <Typography>{moment(status.date_create).format('DD-MM-YYYY')}</Typography>
                    <Typography color={"text.secondary"}>Статус:</Typography>
                    <Typography>{stat.status}</Typography>
                </Stack>
                {status.comment &&
                    <React.Fragment>
                        <Typography color={"text.secondary"}>Комментарий:</Typography>
                        <Typography>{status.comment}</Typography>
                    </React.Fragment>
                }
            </Box>
        </React.Fragment>
    }), [statusList])

    return (
        <Drawer
            anchor={'right'}
            open={statusList.results.length > 0}
            onClose={() => dispatch(clearStatusList())}
        >
            {visibilityBox && <Box sx={{height: '64px'}}/>}
            <Box sx={{overflow: 'auto', height: '100vh'}}>
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    p: 0,
                    m: 1,
                    zIndex: 1,
                    backgroundColor: '#f5f8f8',
                    width: {xs: '100vw', md: '500px'}
                }}>
                    <Typography sx={{p: 1}} variant={'h5'}>Статусы премещения</Typography>
                    <IconButton
                        sx={{position: 'absolute', top: 0, zIndex: 1202, right: 0}}
                        onClick={() => dispatch(clearStatusList())}
                    ><CloseIcon fontSize={'large'}/></IconButton>
                </Box>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => {
                        if (!isLoading && !stopLoad) {
                            setStopLoad(true)
                            dispatch(getStatus(statusList))
                        }
                    }}
                    hasMore={!!statusList.next}
                    loader={<LinearProgress key={'loading'} sx={{height: 10}} color={'secondary'}/>}
                    useWindow={false}
                >
                    <Stack spacing={1} sx={{p: 1, width: {xs: '100vw', md: '500px'}}}>
                        {drawerBody}
                    </Stack>
                </InfiniteScroll>
            </Box>
        </Drawer>
    );
};

export default StatusDrawer;