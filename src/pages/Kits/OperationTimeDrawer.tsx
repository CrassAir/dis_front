import React, {useMemo} from 'react';
import {
    Box, Collapse,
    Divider, Drawer,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel, List, ListItem, ListItemText,
    OutlinedInput,
    Stack,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Form} from "antd";
import {createOperatingTime, deleteOperatingTime} from "../../store/actions/kits";
import SendIcon from "@mui/icons-material/Send";
import {TransitionGroup} from "react-transition-group";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {clearOperatingTimeList} from "../../store/reducers/KitReducer";
import moment from "moment/moment";
import DeleteIcon from "@mui/icons-material/Delete";


const OperationTimeDrawer = () => {
    const dispatch = useAppDispatch()
    const {operatingTimeTeamKit, operatingTimeList} = useAppSelector(state => state.kitReducer)
    const {user} = useAppSelector(state => state.authReducer)
    const [form2] = Form.useForm();

    const drawerBody = useMemo(() => operatingTimeList.map(oper => (
        <Collapse key={oper.id}>
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
                        <Typography color={"text.secondary"}>Часы наработки:</Typography>
                    </React.Fragment>}

                />
                <ListItemText
                    primary={<React.Fragment>
                        <Typography>{moment(oper.date_create).format('DD-MM-YYYY')}</Typography>
                        <Typography>{oper.hours}</Typography>
                    </React.Fragment>}

                />
            </ListItem>
        </Collapse>
    )), [operatingTimeList])

    const closeDrawer = () => {
        dispatch(clearOperatingTimeList())
    }

    const visibilityBox = useMemo(() => document.querySelector('header')!.style.visibility !== 'hidden', [operatingTimeTeamKit])

    return (
        <Drawer
            anchor={'right'}
            open={!!operatingTimeTeamKit}
            onClose={closeDrawer}
        >
            <Box sx={{pt: visibilityBox ? 8 : 0}}>
                <Box sx={{
                    position: 'sticky',
                    top: visibilityBox ? '64px' : 0,
                    p: 1,
                    m: 0,
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
                        <Form
                            form={form2}
                            onFinish={(values) => {
                                dispatch(createOperatingTime({
                                    creator: user!.id,
                                    team_kit: operatingTimeTeamKit,
                                    hours: Number(values.hours)
                                }))
                                form2.resetFields()
                            }}>
                            <Form.Item
                                name={'hours'}
                            >
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="hours-adornment">Укажите количество часов</InputLabel>
                                    <OutlinedInput
                                        id={'hours-adornment'}
                                        required
                                        type={'number'}
                                        label={'Укажите количество часов'}
                                        autoFocus
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    type={'submit'}
                                                    edge="end"
                                                >
                                                    <SendIcon/>
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Form.Item>
                        </Form>
                    </Stack>
                </Box>
                <List>
                    <TransitionGroup>
                        {drawerBody}
                    </TransitionGroup>
                </List>
            </Box>
        </Drawer>
    );
};

export default OperationTimeDrawer;