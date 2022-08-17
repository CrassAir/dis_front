import * as React from 'react';
import {styled, Theme, CSSObject} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {navList} from '../../App';
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import {
    Avatar,
    Box,
    Card,
    CardActionArea,
    CardMedia,
    LinearProgress,
    Slide,
    Stack,
    useScrollTrigger
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {logout} from "../../store/actions/auth";
import Logo from "../../assets/logo.png";
import {stringAvatar} from "../utils";
import Notifications from "./Notifications";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const HideOnScroll = (props: any) => {
    const {children, window} = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const Navbar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()
    const {user, isLoading} = useAppSelector(state => state.authReducer)
    const [open, setOpen] = useState(false)

    const handleDrawer = () => {
        setOpen(!open)
    }

    return (<>
            <HideOnScroll>
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawer}
                            edge="start"
                            sx={{
                                marginRight: 5, ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Card elevation={0}>
                            <CardActionArea
                                onClick={() => navigate('/', {replace: true})}
                            >
                                <CardMedia
                                    sx={{p: 1}}
                                    component="img"
                                    height="50"
                                    image={Logo}
                                    alt="dis logo"
                                />
                            </CardActionArea>
                        </Card>
                        <Box flexGrow={1}/>
                        <Stack spacing={1} direction={'row'}>
                            {user?.full_name && <Avatar {...stringAvatar(user.full_name)}/>}
                            <Notifications />
                            <IconButton edge='end' onClick={() => dispatch(logout())}>
                                <LogoutIcon/>
                            </IconButton>
                        </Stack>
                    </Toolbar>
                    {isLoading && <LinearProgress color={'secondary'}/>}
                </AppBar>
            </HideOnScroll>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawer}>
                        {open ? <ChevronLeftIcon/> : <MenuIcon/>}
                    </IconButton>
                </DrawerHeader>
                <List>
                    {navList.map((navItem: any) => (navItem.read &&
                        <ListItem key={navItem?.name} disablePadding sx={{display: 'block'}}
                                  selected={navItem.path === location.pathname}
                                  onClick={() => {
                                      navigate(navItem.path)
                                  }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0, mr: 3, justifyContent: 'center',
                                    }}
                                >
                                    {navItem?.icon}
                                </ListItemIcon>
                                <ListItemText primary={navItem?.name}
                                              sx={{opacity: open ? 1 : 0, transition: '200ms'}}/>
                            </ListItemButton>
                        </ListItem>))}
                </List>
            </Drawer>
        </>
    );
}

export default Navbar
