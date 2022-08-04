import React from 'react'
import {Outlet} from "react-router-dom";
import {Box} from '@mui/material';
import Navbar, {DrawerHeader} from "../Navbar/Navbar";

const HomePage: React.FC = () => {
    return <div>
        <Box sx={{display: 'flex'}}>
            <Navbar/>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeader/>
                <Outlet/>
            </Box>
        </Box>
    </div>
}

export default HomePage