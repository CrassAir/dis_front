import React, {useEffect} from 'react';
import './App.less';

import HomePage from "./pages/HomePage/HomePage";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {checkToken, logout} from "./store/actions/auth";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {Box, Card, CardMedia, createTheme, CssBaseline, TextField, ThemeProvider} from '@mui/material';
import LoginPage from "./pages/LoginPage/LoginPage";
import {useSnackbar} from "notistack";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
// import Parameter from "./pages/Catalogs/Parameter/Parameter";
import Logo from "./assets/logo_footer.png";
import Parameter from './pages/Catalogs/Parameter/Parameter';

const theme = createTheme({
    palette: {
        // mode: 'dark',
        background: {
            // default: '#d7edf1',
            paper: '#f5f8f8'
        },
        primary: {
            main: '#2c6e6a',
        },
        secondary: {
            main: '#2da3c2'
        },
    },
    components: {
        MuiListItem: {
            styleOverrides: {
                root: {
                    transition: '500ms',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(44,109,106, 0.7)',

                        'svg, span': {
                            color: '#f5f8f8'
                        }
                    }
                }
            }
        }
    }
});

export const navList = [
    {
        name: 'Home',
        icon: <HomeRoundedIcon/>,
        path: '/',
        component: <TextField/>
    },
    {
        name: 'Dashboard',
        icon: <DashboardRoundedIcon/>,
        path: '/dashboard',
        component: <Parameter/>
    },
    {
        name: '3',
        icon: <AddLocationIcon/>,
        path: '/3',
        component: <div style={{height: 100, width: 100, backgroundColor: 'yellow'}}/>
    },
]

const App: React.FC = () => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const {user, error} = useAppSelector(state => state.authReducer)

    useEffect(() => {
        if (error?.message) {
            enqueueSnackbar(error.message, {variant: 'error'});
        }
    }, [error])

    useEffect(() => {
        dispatch(checkToken())
    }, [])

    const routes = () => {
        let sToken = localStorage.getItem('token')
        if (location.pathname === '/logout') {
            dispatch(logout())
            return <Navigate replace to={'login'}/>
        }
        if (!user?.token && !sToken) {
            return (
                <Routes>
                    <Route path={'*'} element={<Navigate replace to={'login'}/>}/>
                    <Route path="login" element={<LoginPage/>}/>
                </Routes>
            )
        }
        if (user) {
            return (
                <Routes>
                    <Route path="login" element={<Navigate to={'/'}/>}/>
                    <Route path="change_password" element={<Navigate to={'/'}/>}/>
                    <Route path="/" element={<HomePage/>}>
                        {navList.map(navItem => <Route key={navItem.name} path={navItem.path}
                                                       element={navItem.component}/>)}
                    </Route>
                </Routes>
            )
        }
        return (
            <Box className={'login-container'}>
                <Card elevation={0} sx={{maxWidth: 300, p: 3}}>
                    <CardMedia
                        component="img"
                        height="100"
                        image={Logo}
                        alt="dis logo"
                    />
                </Card>
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <CssBaseline/>
                {routes()}
            </div>
        </ThemeProvider>
    )
}

export default App;
