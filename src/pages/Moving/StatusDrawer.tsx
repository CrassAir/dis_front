import React, {useMemo} from 'react';
import {Box, Divider, Drawer, IconButton, Stack, Typography} from "@mui/material";
import {clearStatusList} from "../../store/reducers/KitReducer";
import CloseIcon from "@mui/icons-material/Close";
import {moving_status} from "../../models/IKit";
import moment from "moment/moment";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";

const StatusDrawer = () => {
    const dispatch = useAppDispatch()
    const {statusList} = useAppSelector(state => state.kitReducer)

    const visibilityBox = useMemo(() => document.querySelector('header')!.style.visibility !== 'hidden', [statusList])

    const drawerBody = useMemo(() => statusList.map(status => {
        const stat = moving_status[status.status as keyof typeof moving_status]
        return <React.Fragment key={status.id}>
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
            open={statusList.length > 0}
            onClose={() => dispatch(clearStatusList())}
        >
            <Box sx={{pt: visibilityBox ? 8 : 0}}>
                <Box sx={{
                    position: 'sticky',
                    top: visibilityBox ? '64px' : 0,
                    p: 1,
                    m: 0,
                    zIndex: 1,
                    backgroundColor: '#f5f8f8',
                    width: {xs: '100vw', md: '500px'}
                }}>
                    <Typography variant={'h5'}>Статусы премещения</Typography>
                    <IconButton
                        sx={{position: 'absolute', top: 0, zIndex: 1202, right: 0}}
                        onClick={() => dispatch(clearStatusList())}
                    ><CloseIcon fontSize={'large'}/></IconButton>
                </Box>
                <Stack spacing={1} sx={{p: 1, width: {xs: '100vw', md: '500px'}}}>
                    {drawerBody}
                </Stack>
            </Box>
        </Drawer>
    );
};

export default StatusDrawer;