import React, {useState} from 'react';
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import {Box, Popover, Stack, Typography} from "@mui/material";
import {useAppSelector} from "../../hooks/redux";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";

const Notifications = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    const {notifications} = useAppSelector(state => state.authReducer)

    return (<>
            <IconButton edge='end'
                        onClick={(e) => {
                            setAnchorEl(e.currentTarget)
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
                <IconButton sx={{position: 'sticky', top: 0, right: 0, zIndex: 1202}}><CloseIcon
                    fontSize={'large'}/></IconButton>
                <Stack spacing={1} sx={{maxHeight: '60vh', m: 1}}>
                    {notifications.map(notif => (
                        <Box key={notif.id} sx={{p: 1,}}>
                            <Stack spacing={2} direction={"row"}>
                                <Typography color={"text.secondary"}>Дата создания:</Typography>
                                <Typography>{moment(notif.date_create).format('DD-MM-YYYY')}</Typography>
                            </Stack>
                            <Typography>{notif.message}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Popover>
        </>
    );
};

export default Notifications;