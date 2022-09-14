import React, {useEffect} from 'react'
import {Outlet} from "react-router-dom";
import {Box} from '@mui/material';
import Navbar, {DrawerHeader} from "../Navbar/Navbar";
import {useAppDispatch} from "../../hooks/redux";
import {getNotifications} from "../../store/actions/auth";

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getNotifications({}))
    }, [])

    return <div>
        <Box>
            <Navbar/>
            <Box component="main" sx={{p: {xs: '5px', md: 3}}}>
                <DrawerHeader/>
                <Box sx={{pl: {xs: 0, md: 8}}}>
                    <Outlet/>
                </Box>
            </Box>
        </Box>
    </div>
}

export default HomePage