import React, {useMemo} from 'react';
import {
    FormControl,
    MenuItem, OutlinedInput,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import moment from "moment";
import {ru} from "date-fns/locale";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

type EditableFieldProps = {
    title: string
    value: any
    edit?: boolean
    list?: any[]
}

const EditableField = ({title, value, edit = false, list = []}: EditableFieldProps) => {

    const data = useMemo(() => {
        if (Date.parse(value) > 0) {
            if (edit) {
                return <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
                    <DatePicker
                        value={moment(value)}
                        minDate={new Date('2022-01-01')}
                        maxDate={new Date('2023-12-01')}
                        onChange={(e) => {
                        }}
                        renderInput={(params: any) => <TextField {...params} size={'small'}/>}
                    />
                </LocalizationProvider>
            }
            return <Typography>{moment(value).format('DD-MM-YYYY')}</Typography>
        }
        if (Array.isArray(value)) {
            if (edit) {
                return <FormControl fullWidth>
                    <Select
                        multiple
                        value={value}
                        onChange={() => {}}
                        input={<OutlinedInput size={'small'} fullWidth/>}
                    >
                        {list.map((item, index) => (
                            <MenuItem
                                key={index}
                                value={item.id}
                            >
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
            return list.map((item, index) => {
                if (value.includes(item.id)) return <Typography key={index}>{item.name}</Typography>
                return null
            })
        }
        if (Number.isFinite(value) && list?.length > 0) {
            if (edit) {
                return <TextField
                    required
                    select
                    value={value}
                    fullWidth
                    size={'small'}
                >
                    {list.map((item, index) => <MenuItem key={index} value={item.id}>{item.name}</MenuItem>)}
                </TextField>
            }
            return <Typography>{list.find(org => org.id === value)?.name}</Typography>
        }
        if (edit) {
            return <Paper elevation={0} sx={{width: '100%', height: 'fit-content'}}><TextField value={value} onChange={() => {
            }} variant={'outlined'} fullWidth size={'small'}/></Paper>
        }
        return <Typography>{value}</Typography>
    }, [value, list, edit])

    return (
        <Stack spacing={1} direction={"row"}>
            <Typography color={"text.secondary"}>{title}</Typography>
            {data}
        </Stack>
    );
};

export default EditableField;