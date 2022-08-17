import React, {useEffect, useState} from 'react';
import {IKit, ITeam} from "../../models/IKit";
import {
    Button,
    DialogActions, DialogContent,
    DialogTitle,
    ListSubheader,
    MenuItem,
    TextField
} from "@mui/material";
import {Form} from "antd";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getOrganizationsTK} from "../../store/actions/kits";

type MovingFormProps = {
    editData?: IKit | null
    onClose: () => void
}

const MovingForm = ({editData, onClose}: MovingFormProps) => {
    const [form] = Form.useForm()
    const dispatch = useAppDispatch()
    const {organizationsTK} = useAppSelector(state => state.kitReducer)
    const [formData] = useState({from_kit: editData ? editData.id : '', amount: '', to_team: ''})

    useEffect(() => {
        if (organizationsTK.length === 0) dispatch(getOrganizationsTK())
    }, [])

    if (!!editData) console.log(editData)

    const handleClose = () => {
        onClose()
        form.resetFields()
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    }

    return (
        <Form
            form={form}
            onFinish={(values: ITeam) => {
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
                        onChange={handleChange}
                        label="Комплкект"
                        // variant="standard"
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
                        // variant="standard"
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
                        // variant="standard"
                        fullWidth
                    >
                        {organizationsTK.map(org => {
                            const items = org.teams.map(team => <MenuItem key={team.id}
                                                                          value={team.id}>{team.name}</MenuItem>)
                            return [<ListSubheader key={org.name}>{org.name}</ListSubheader>, items]
                        })}
                    </TextField>
                </Form.Item>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Form.Item>
                    <Button type={'submit'}>
                        Добавить
                    </Button>
                </Form.Item>
            </DialogActions>
        </Form>
    );
};

export default MovingForm;
