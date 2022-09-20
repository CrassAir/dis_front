import React, {useEffect, lazy, Suspense, ReactElement, useMemo} from 'react';
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
import ConstructionIcon from '@mui/icons-material/Construction';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import {ReactComponent as svgLogo} from "./assets/dis_log_without_text3.svg"

const Catalog = lazy(() => import("./pages/Catalogs/Catalog"))
const TeamKits = lazy(() => import("./pages/Kits/OrganizationsTeamKits"))
const Moving = lazy(() => import("./pages/Moving/Moving"))
const Defectoscopy = lazy(() => import("./pages/Defectoscopy/Defectoscopy"))
const Repair = lazy(() => import("./pages/Repair/Repair"))


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
    component: ReactElement
}

export const defaultNavList: INavItem[] = [
    {
        name: 'Бригады',
        icon: <PeopleAltIcon/>,
        path: '/',
        validate: 'teams',
        component: <TeamKits/>,
    },
    {
        name: 'Перемещение труб',
        icon: <LocalShippingIcon/>,
        path: '/delivery',
        validate: 'delivery',
        component: <Moving/>
    },
    {
        name: 'Дефектоскопия',
        icon: <ContentPasteIcon/>,
        path: '/defectoscopy',
        validate: 'defectoscopy',
        component: <Defectoscopy/>
    },
    {
        name: 'Ремонты',
        icon: <ConstructionIcon/>,
        path: '/repair',
        validate: 'repair',
        component: <Repair/>
    },
    {
        name: 'Справочник',
        icon: <LibraryBooksIcon/>,
        path: '/directory',
        validate: 'directory',
        component: <Catalog/>
    },
]

const App: React.FC = () => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const {user, navList, token, error} = useAppSelector(state => state.authReducer)

    useEffect(() => {
        if (error?.message && error?.code !== 401) {
            enqueueSnackbar(error.message, {variant: 'error'})
        }
    }, [error])

    useEffect(() => {
        dispatch(checkToken())
    }, [])

    const navigationList = useMemo(() => {
        let nav = '/'
        const newList = navList.map((navItem, index) => {
            if (index === 0 && navItem.path !== '/') nav = navItem.path
            return <Route
                key={navItem.name} path={navItem.path}
                element={
                    <Suspense fallback={<Box className={'login-container'}>
                        <SvgIcon className={'logo_anim'} component={svgLogo}
                                 sx={{width: 150, height: 150}}
                                 viewBox="-1.2989280492092803E-5 -2.8421709430404007E-13 128.08380126953125 128.46115112304688"/>
                    </Box>}>
                        {navItem.component}
                    </Suspense>
                }>
                <Route path={':id'} element={<Suspense fallback={<Box className={'login-container'}>
                    <SvgIcon className={'logo_anim'} component={svgLogo}
                             sx={{width: 150, height: 150}}
                             viewBox="-1.2989280492092803E-5 -2.8421709430404007E-13 128.08380126953125 128.46115112304688"/>
                </Box>}>
                    {navItem.component}
                </Suspense>}/>
            </Route>
        })
        if (nav !== '/') newList.push(<Route key={'redirect'} path="/" element={<Navigate to={nav}/>}/>)
        return newList
    }, [navList])


    const routes = () => {
        let sToken = localStorage.getItem('token')
        if (location.pathname === '/logout') {
            dispatch(logout())
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
                        {navigationList}
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
