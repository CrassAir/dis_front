import React, {useEffect, lazy, Suspense, ReactElement, useState, useMemo} from 'react';
import './App.less';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {checkToken, logout} from "./store/actions/auth";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import {
    Box,
    createTheme,
    CssBaseline,
    SvgIcon,
    ThemeProvider
} from '@mui/material';
import {useSnackbar} from "notistack";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import {ReactComponent as svgLogo} from "./assets/dis_log_without_text3.svg"
import MovingForm from "./pages/Moving/MovingForm";
import {changeNavListValidate} from "./pages/utils";

const Catalog = lazy(() => import("./pages/Catalogs/Catalog"))
const TeamKits = lazy(() => import("./pages/Kits/OrganizationsTeamKits"))


const theme = createTheme({
    typography: {
        fontFamily: 'Arial',
    },
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

export interface INavItem {
    name: string
    icon: ReactElement
    path: string
    validate: string
    read: boolean
    component: ReactElement
}

export const navList: INavItem[] = [
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
        validate: 'to_team',
        read: false,
        component: <TeamKits/>,
    },
    {
        name: 'Перемещение труб',
        icon: <LocalShippingIcon/>,
        path: '/delivery',
        validate: 'to_delivery',
        read: false,
        component: <MovingForm onClose={() => {
        }}/>
    },
    {
        name: 'Справочник',
        icon: <LibraryBooksIcon/>,
        path: '/directory',
        validate: 'to_directory',
        read: false,
        component: <Catalog/>
    },
    {
        name: 'Дефектоскопия',
        icon: <ContentPasteIcon/>,
        path: '/3',
        validate: 'to_defectoscopy',
        read: false,
        component: <div/>
    },
]

const App: React.FC = () => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const {user, token, error} = useAppSelector(state => state.authReducer)

    useEffect(() => {
        if (error?.message) {
            enqueueSnackbar(error.message, {variant: 'error'});
        }
    }, [error])

    useEffect(() => {
        dispatch(checkToken())
    }, [])

    useMemo(() => {
        if (user) changeNavListValidate(user, navList)
    }, [user])


    const routes = () => {
        let sToken = localStorage.getItem('token')
        if (location.pathname === '/logout') {
            dispatch(logout())
            return <Navigate replace to={'login'}/>
        }
        if (!token && !sToken) {
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
                        {navList.map(navItem => (navItem.read &&
                            <Route key={navItem.name} path={navItem.path}
                                   element={
                                       <Suspense fallback={<Box className={'login-container'}>
                                           <SvgIcon className={'logo_anim'} component={svgLogo}
                                                    sx={{width: 150, height: 150}}
                                                    viewBox="-1.2989280492092803E-5 -2.8421709430404007E-13 128.08380126953125 128.46115112304688"/>
                                       </Box>}>
                                           {navItem.component}
                                       </Suspense>
                                   }/>
                        ))}
                    </Route>
                </Routes>
            )
        }
        return (
            <Box className={'login-container'}>
                <SvgIcon className={'logo_anim'} component={svgLogo} sx={{width: 150, height: 150}}
                         viewBox="-1.2989280492092803E-5 -2.8421709430404007E-13 128.08380126953125 128.46115112304688"/>
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
