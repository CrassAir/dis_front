import React, {useEffect, useState} from 'react';
import {
    Button, Dialog,
    DialogActions, DialogContent,
    DialogTitle,
    ListSubheader,
    MenuItem, Stack, Switch,
    TextField, Typography
} from "@mui/material";
import {Form} from "antd";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {createMoving, getOrganizationsTeam, getOrganizationsTK, updateMoving} from "../../store/actions/kits";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {ru} from "date-fns/locale";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import moment from "moment/moment";
import {useLocation, useNavigate} from "react-router-dom";

type MovingFormProps = {
    editData?: any | null
    onClose: () => void
    moveId?: number
}

const MovingForm = ({editData, moveId, onClose}: MovingFormProps) => {
    const [form] = Form.useForm()
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const location = useLocation()
    const {organizationsTK, organizationsTeam} = useAppSelector(state => state.kitReducer)
    const {user} = useAppSelector(state => state.authReducer)
    const [selectKitId, setSelectKitId] = useState<number | null>(null)
    const [switchVal, setSwitchVal] = useState(true)
    const [selectDate, setSelectDate] = useState<any | null>()

    useEffect(() => {
        const newData = {
            from_kit: editData?.id ? editData?.id : '',
            amount: editData?.amount ? editData?.amount : 0,
            to_team: editData?.to_team ? editData?.to_team : '',
            delivery_date_time: editData?.delivery_date_time ? moment(editData?.delivery_date_time) : moment(),
            returnable: editData?.returnable ? editData?.returnable : true,
        }
        setSelectKitId(newData.from_kit)
        setSelectDate(newData.delivery_date_time)
        setSwitchVal(editData?.returnable ? editData?.returnable : true)
        form.setFieldsValue(newData)
    }, [editData])


    useEffect(() => {
        if (organizationsTK.length === 0) dispatch(getOrganizationsTK())
        if (organizationsTeam.length === 0) dispatch(getOrganizationsTeam())
    }, [])

    const handleClose = () => {
        onClose()
        form.resetFields()
    }

    return (
        <Dialog
            fullWidth
            maxWidth={'sm'}
            open={!!editData}
            onClose={handleClose}
        >
            <Form
                form={form}
                onFinish={(values) => {
                    values.delivery_date_time = selectDate
                    values.amount = Number(values.amount)
                    values.creator = user!.id
                    values.returnable = switchVal
                    if (moveId) {
                        values.id = moveId
                        dispatch(updateMoving(values))
                    } else {
                        dispatch(createMoving(values))
                    }
                    handleClose()
                    if (location.pathname !== '/delivery') navigation('delivery', {replace: true})
                }}
                initialValues={{
                    from_kit: '',
                    amount: 0,
                    to_team: '',
                    delivery_date_time: moment(),
                    returnable: true
                }}
            >
                <DialogTitle>{'Перемещение комплекта'}</DialogTitle>
                <DialogContent className={'form-paper'}>
                    <Form.Item
                        name="from_kit"
                        required={true}
                    >
                        <TextField
                            required
                            select
                            value={editData?.id}
                            onChange={e => setSelectKitId(Number(e.target.value))}
                            label="Комплкект"
                            fullWidth
                        >
                            {organizationsTK.map(org => {
                                const items = org.teams.map(team => {
                                    const items = team.team_kit.kits.map(kit => <MenuItem key={kit.id}
                                                                                          value={kit.id}>{kit.name} {kit.amount}Шт.</MenuItem>)

                                    return [<ListSubheader key={team.name}>{team.name}</ListSubheader>, items]
                                })
                                return [<ListSubheader key={org.name}>{org.name}</ListSubheader>, items]
                            })}
                        </TextField>
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        required={true}
                    >
                        <TextField
                            required
                            label="Количество"
                            value={editData?.amount}
                            type={'number'}
                            fullWidth
                        />
                    </Form.Item>
                    <Form.Item
                        name="to_team"
                        required={true}
                    >
                        <TextField
                            required
                            select
                            label="Кому(Бригада)"
                            value={editData?.to_team}
                            fullWidth
                        >
                            {organizationsTeam.map(org => {
                                const items = org.teams.map(team => (
                                    !team.team_kit.kits.some(kit => kit.id === selectKitId) &&
                                    <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                                ))
                                return [<ListSubheader key={org.name}>{org.name}</ListSubheader>, items]
                            })}
                        </TextField>
                    </Form.Item>

                    <Form.Item
                        name="delivery_date_time"
                        required={true}
                    >
                        <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label='Дата доставки'
                                value={selectDate}
                                minDate={new Date('2022-01-01')}
                                onChange={(e) => setSelectDate(e)}
                                renderInput={(params: any) => <TextField fullWidth required {...params}/>}
                            />
                        </LocalizationProvider>
                    </Form.Item>


                    <Form.Item
                        name="returnable"
                        required={true}
                    >
                        <Stack minWidth={'auto'} spacing={2} direction={'row'}>
                            <Typography>С возвратом?</Typography>
                            <Switch inputProps={{'aria-label': 'С возвратом?'}} value={switchVal}
                                    onChange={(_, checked) => setSwitchVal(checked)} defaultChecked/>
                        </Stack>
                    </Form.Item>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Form.Item>
                        <Button type={'submit'}>
                            Отправить
                        </Button>
                    </Form.Item>
                </DialogActions>
            </Form>
        </Dialog>
    );
};

export default MovingForm;
