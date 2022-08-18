import React, {useEffect, useMemo, useState} from 'react';
import {IKit, ITeam} from "../../models/IKit";
import {
    Button, Dialog,
    DialogActions, DialogContent,
    DialogTitle,
    ListSubheader,
    MenuItem,
    TextField
} from "@mui/material";
import {Form} from "antd";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getOrganizationsTK} from "../../store/actions/kits";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {ru} from "date-fns/locale";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import moment from "moment/moment";

type MovingFormProps = {
    editData?: IKit | null
    onClose: () => void
}

const MovingForm = ({editData, onClose}: MovingFormProps) => {
    const [form] = Form.useForm()
    const dispatch = useAppDispatch()
    const {organizationsTK} = useAppSelector(state => state.kitReducer)
    const [selectKitId, setSelectKitId] = useState<number | null>(editData?.id || null)

    const formData = useMemo(() => {
        if (!!editData) setSelectKitId(editData.id)
        return {
            from_kit: editData ? editData.id : '',
            amount: '',
            to_team: '',
            delivery_date_time: moment()
        }
    }, [editData])

    useEffect(() => {
        if (organizationsTK.length === 0) dispatch(getOrganizationsTK())
    }, [])

    const handleClose = () => {
        onClose()
        form.resetFields()
    }

    const handleChange = (event: any) => {
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
                    values.delivery_date_time = values.delivery_date_time._d
                    console.log(values)
                    handleClose()
                }}
                initialValues={formData}
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
                            value={formData.from_kit}
                            onChange={e => setSelectKitId(Number(e.target.value))}
                            label="Комплкект"
                            fullWidth
                        >
                            {organizationsTK.map(org => {
                                const items = org.teams.map(team => {
                                    const items = team.team_kit.kits.map(kit => <MenuItem key={kit.id}
                                                                                          value={kit.id}>{kit.name}</MenuItem>)

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
                            value={formData.amount}
                            onChange={handleChange}
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
                            value={formData.to_team}
                            onChange={handleChange}
                            fullWidth
                        >
                            {organizationsTK.map(org => {
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
                                value={formData.delivery_date_time}
                                minDate={new Date('2022-01-01')}
                                onChange={handleChange}
                                renderInput={(params: any) => <TextField fullWidth required {...params}/>}
                            />
                        </LocalizationProvider>
                    </Form.Item>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Form.Item>
                        <Button type={'submit'}>
                            {editData?.id ? 'Изменить' : 'Создать'}
                        </Button>
                    </Form.Item>
                </DialogActions>
            </Form>
        </Dialog>
    );
};

export default MovingForm;
