import React, {useEffect} from 'react';
import './App.less';

import HomePage from "./pages/HomePage/HomePage";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {checkToken, logout} from "./store/actions/auth";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import LoginPage from "./pages/LoginPage/LoginPage";
import {useSnackbar} from "notistack";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';

const theme = createTheme({
    palette: {
        // mode: 'dark',
        background: {
            default: '#d7edf1',
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
        component: <div style={{height: '120vh', width: 100, backgroundColor: 'red'}}></div>
    },
    {
        name: 'Dashboard',
        icon: <DashboardRoundedIcon/>,
        path: '/dashboard',
        component: <div style={{height: 100, width: 100, backgroundColor: 'green'}}/>
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
        <ThemeProvider theme={theme}>
            <div className="App">
                <CssBaseline/>
                {routes()}
            </div>
        </ThemeProvider>
    )
}

export default App;
