import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    Box, Collapse,
    Divider, Drawer,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel, LinearProgress, ListItem, ListItemText, MenuItem,
    OutlinedInput, Select,
    Stack, TextField,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Form} from "antd";
import {createOperatingTime, deleteOperatingTime, getOperatingTime} from "../../store/actions/kits";
import SendIcon from "@mui/icons-material/Send";
import {TransitionGroup} from "react-transition-group";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {clearOperatingTimeList} from "../../store/reducers/KitReducer";
import moment from "moment/moment";
import DeleteIcon from "@mui/icons-material/Delete";
import InfiniteScroll from "react-infinite-scroller";
import {getProjectGroups} from "../../store/actions/catalog";
import {project_group_choose} from "../../models/IKit";


const OperationTimeDrawer = () => {
    const dispatch = useAppDispatch()
    const {operatingTimeTeamKit, operatingTimeList} = useAppSelector(state => state.kitReducer)
    const {project_groups} = useAppSelector(state => state.catalogReducer)
    const {isLoading, user} = useAppSelector(state => state.authReducer)
    const [stopLoad, setStopLoad] = useState(true)
    const [hours, setHours] = useState<number | string>('')
    const [projectGroup, setProjectGroup] = useState<number | null>(null)

    useEffect(() => {
        if (project_groups.length === 0) dispatch(getProjectGroups())
    }, [project_groups])

    const closeDrawer = () => {
        dispatch(clearOperatingTimeList())
    }

    useEffect(() => {
        if (operatingTimeList.results.length > 0) {
            setProjectGroup(operatingTimeList.results[0].project_group)
        } else {
            if (project_groups.length > 0) setProjectGroup(project_groups[0].id)
        }
    }, [operatingTimeList.results, project_groups])

    const sendVal = () => {
            dispatch(createOperatingTime({
                creator: user!.id,
                team_kit: operatingTimeTeamKit,
                hours: hours,
                project_group: projectGroup
            }))
        }

    const drawerHead = useMemo(() => {
        return (
            <Box sx={{
                position: 'sticky',
                top: 0,
                p: 0,
                m: 1,
                zIndex: 1,
                backgroundColor: '#f5f8f8',
                width: {xs: '100vw', md: '500px'}
            }}>
                <IconButton
                    sx={{position: 'absolute', top: 0, zIndex: 1202, right: 0}}
                    onClick={closeDrawer}
                >
                    <CloseIcon fontSize={'large'}/>
                </IconButton>
                <Stack spacing={2} sx={{p: 1}}>
                    <Typography variant={'h5'}>Наработка</Typography>
                    <Divider variant="middle"/>
                    <Stack spacing={1} direction={'row'}>
                        <TextField
                            variant={'outlined'}
                            fullWidth
                            select
                            value={projectGroup}
                            onChange={(e) => setProjectGroup(Number(e.target.value))}
                        >
                            {project_groups.map((item, index) => (
                                <MenuItem
                                    key={index}
                                    value={item.id}
                                >
                                    {project_group_choose[item.name as keyof typeof project_group_choose]}
                                </MenuItem>
                            ))}
                        </TextField>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="hours-adornment">Количество часов</InputLabel>
                            <OutlinedInput
                                id={'hours-adornment'}
                                required
                                type={'number'}
                                label={'Количество часов'}
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                autoFocus
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={sendVal}
                                            edge="end"
                                        >
                                            <SendIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Stack>
                </Stack>
            </Box>
        )
    }, [project_groups, hours, projectGroup])

    const drawerBody = useMemo(() => operatingTimeList.results.map((oper, index) => {
        let project_group = project_groups.find(item => item.id === oper.project_group)?.name
        if (project_group) project_group = project_group_choose[project_group as keyof typeof project_group_choose]
        else project_group = 'Отсутствует'
        return (
            <Collapse key={oper.id}>
                <Box>
                    <Divider variant="middle"/>
                    <ListItem
                        secondaryAction={
                            <IconButton
                                edge="end"
                                disabled={!moment().startOf('day').isSame(moment(oper.date_create).startOf('day'))}
                                aria-label="delete"
                                title="Удалить наработку"
                                onClick={() => dispatch(deleteOperatingTime(oper.id))}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        }
                    >
                        <ListItemText
                            primary={<React.Fragment>
                                <Typography color={"text.secondary"}>Дата внесения:</Typography>
                                <Typography color={"text.secondary"}>Проектная группа:</Typography>
                                <Typography color={"text.secondary"}>Часы наработки:</Typography>
                            </React.Fragment>}

                        />
                        <ListItemText
                            primary={<React.Fragment>
                                <Typography>{moment(oper.date_create).format('DD-MM-YYYY')}</Typography>
                                <Typography>{project_group}</Typography>
                                <Typography>{oper.hours}</Typography>
                            </React.Fragment>}

                        />
                    </ListItem>
                </Box>
            </Collapse>
        )
    }), [operatingTimeList, project_groups])


    useEffect(() => {
        setTimeout(() => setStopLoad(false), 500)
    }, [operatingTimeList])

    const visibilityBox = useMemo(() => document.querySelector('header')?.style.visibility !== 'hidden', [operatingTimeTeamKit])

    return (
        <Drawer
            anchor={'right'}
            open={!!operatingTimeTeamKit}
            onClose={closeDrawer}
        >
            <Box sx={{overflow: 'auto', height: '100vh'}}>
                {visibilityBox && <Box sx={{height: '64px'}}/>}
                {drawerHead}
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => {
                        if (!isLoading && !stopLoad) {
                            setStopLoad(true)
                            dispatch(getOperatingTime(operatingTimeList))
                        }
                    }}
                    hasMore={!!operatingTimeList.next}
                    loader={<LinearProgress key={'loading'} sx={{height: 10}} color={'secondary'}/>}
                    useWindow={false}
                    threshold={100}
                >
                    <TransitionGroup>
                        {drawerBody}
                    </TransitionGroup>
                </InfiniteScroll>
            </Box>
        </Drawer>
    );
};

export default OperationTimeDrawer;