import React, {useEffect} from 'react';
import './App.less';

import HomePage from "./pages/HomePage/HomePage";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {checkToken, logout} from "./store/actions/auth";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {
    Box,
    createTheme,
    CssBaseline,
    SvgIcon,
    TextField,
    ThemeProvider
} from '@mui/material';
import LoginPage from "./pages/LoginPage/LoginPage";
import {useSnackbar} from "notistack";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {ReactComponent as svgLogo} from "./assets/dis_log_without_text2.svg"
import Catalog from "./pages/Catalogs/Catalog";
import Kits from "./pages/Kits/Kits";

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
    // {
    //     name: 'Главная',
    //     icon: <HomeRoundedIcon/>,
    //     path: '/',
    //     component: <Kits/>
    // },
    {
        name: 'Бригады',
        icon: <PeopleAltIcon/>,
        path: '/',
        component: <Kits/>
    },
    {
        name: 'Справочник',
        icon: <LibraryBooksIcon/>,
        path: '/dashboard',
        component: <Catalog/>
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
                <SvgIcon className={'logo_anim'} component={svgLogo} sx={{width: 100, height: 100}} viewBox="-5.019615315404735E-6 -0.3768116120910392 99.89627206933781 100.37680334753924"/>
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
