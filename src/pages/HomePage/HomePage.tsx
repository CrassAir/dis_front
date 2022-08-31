import React, {useEffect} from 'react'
import {Outlet} from "react-router-dom";
import {Box} from '@mui/material';
import Navbar, {DrawerHeader} from "../Navbar/Navbar";
import {useAppDispatch} from "../../hooks/redux";
import {getNotifications} from "../../store/actions/auth";

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getNotifications())
    }, [])

    return <div>
        <Box sx={{display: 'flex'}}>
            <Navbar/>
            <Box component="main" sx={{flexGrow: 1, p: {xs: '5px', md: 3}}}>
                <DrawerHeader/>
                <Outlet/>
            </Box>
        </Box>
    </div>
}

export default HomePage