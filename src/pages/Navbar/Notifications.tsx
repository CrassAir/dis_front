import React, {useState} from 'react';
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import {Popover, Typography} from "@mui/material";

const Notifications = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
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
                <Typography sx={{p: 2}}>The content of the Popover.</Typography>
            </Popover>
        </>
    );
};

export default Notifications;