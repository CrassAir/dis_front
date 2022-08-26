import {Box, Button, Divider, IconButton, Paper, Stack, Tooltip, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import EditIcon from "@mui/icons-material/Edit";
import ArticleIcon from '@mui/icons-material/Article';
import React, {useMemo, useState} from "react";
import {IMoving, moving_status} from "../../models/IKit";
import moment from "moment";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import CancelIcon from '@mui/icons-material/Cancel';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import MovingForm from "./MovingForm";
import {changeStatusMoving, deleteMoving, getStatus} from "../../store/actions/kits";
import {disableByMovingStatus} from "../utils";


type MovingItemProps = {
    moving: IMoving
}

const MovingItem = ({moving}: MovingItemProps) => {
    const {status, color} = moving_status[moving.last_status_name as keyof typeof moving_status]
    const date_create = moment(moving.date_create).format('DD-MM-YYYY')
    const delivery_date = moment(moving.delivery_date_time).format('DD-MM-YYYY')
    const {user} = useAppSelector(state => state.authReducer)
    const dispatch = useAppDispatch()
    const [editData, setEditData] = useState<any | null>(null)

    const movingForm = useMemo(() => (
        !!editData && <MovingForm editData={editData?.kit} moveId={editData?.moveId} onClose={() => setEditData(null)}/>
    ), [editData])

    const actionHeadButton = useMemo(() => {
        const listBtn = []
        listBtn.push(<Tooltip key={'detail'} title={"Статусы"}>
            <IconButton onClick={() => dispatch(getStatus({mov_id: moving.id}))}><ArticleIcon/></IconButton>
        </Tooltip>)
        if (user?.id === moving?.creator) {
            if (moving.last_status_name === 'create') {
                // listBtn.push(<Tooltip key={'edit'} title={"Редактировать"}>
                //     <IconButton onClick={() => setEditData({
                //         kit: {
                //             id: moving.send_kit ? moving.send_kit : moving.from_kit,
                //             amount: moving.amount,
                //             to_team: moving.to_team,
                //             delivery_date_time: moving.delivery_date_time,
                //             returnable: moving.returnable
                //         },
                //         moveId: moving.id
                //     })}><EditIcon/></IconButton>
                // </Tooltip>)
                listBtn.push(<Tooltip key={'delete'} title={"Удалить"}>
                    <IconButton onClick={() => dispatch(deleteMoving(moving))}><DeleteIcon/></IconButton>
                </Tooltip>)
            }
        }
        return listBtn
    }, [moving])

    const actionButton = useMemo(() => {
        const listBtn = []
        if (moving.last_status_name === 'create') {
            listBtn.push(<Button key={'send'} variant={'contained'} startIcon={<SendIcon/>}
                                 disabled={!(user!.is_superuser || user!.id === moving.creator)}
                                 onClick={() => dispatch(changeStatusMoving({
                                     id: moving.id,
                                     forward: true
                                 }))}
            >
                Отправить
            </Button>)
        }
        if (['sent', 'back'].includes(moving.last_status_name)) {
            listBtn.push(<Button key={'received'} variant={'contained'} color={'success'} startIcon={<CheckBoxIcon/>}
                                 disabled={disableByMovingStatus(user!, moving, 'accept')}
                                 onClick={() => dispatch(changeStatusMoving({
                                     id: moving.id,
                                     forward: true
                                 }))}
            >
                Принять
            </Button>)
            listBtn.push(<Button key={'not_received'} variant={'contained'} color={'error'} startIcon={<CancelIcon/>}
                                 disabled={disableByMovingStatus(user!, moving, 'cancel')}
                                 onClick={() => dispatch(changeStatusMoving({
                                     id: moving.id,
                                     forward: false
                                 }))}
            >
                Отклонить
            </Button>)
        }
        if (['received', 'not_received', 'back_received', 'not_back_received'].includes(moving.last_status_name) && !moving.complete) {
            listBtn.push(<Button key={'back'} variant={'contained'} startIcon={<ReplyIcon/>}
                                 disabled={!(user!.is_superuser || user!.id === moving.creator || user!.id === moving.recipient)}
                                 onClick={() => dispatch(changeStatusMoving({
                                     id: moving.id,
                                     forward: true
                                 }))}
            >
                Вернуть
            </Button>)
        }
        return <Stack spacing={1} direction={'row'} justifyContent={'end'}>{listBtn}</Stack>
    }, [moving])

    return (
        <Paper sx={{maxWidth: '1200px'}}>
            <Paper elevation={4}
                   sx={{backgroundColor: color, p: 1, position: 'relative'}}>
                <Box sx={{position: 'absolute', right: '0', top: '0'}}>
                    {actionHeadButton}
                </Box>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid xs={10} md={6}>

                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Номер документа:</Typography>
                            <Typography>{moving.id.toString().padStart(6, '0')}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Статус:</Typography>
                            <Typography>{status}</Typography>
                        </Stack>

                    </Grid>
                    <Grid xs={10} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Дата создания:</Typography>
                            <Typography>{date_create}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Орентировочная дата доставки:</Typography>
                            <Typography>{delivery_date}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
            <Grid container spacing={2} sx={{p: 1}}>
                <Grid xs={12} md={6}>
                    <Stack spacing={2}>
                        <Typography textAlign={'center'} variant={'h6'} fontSize={'bold'}>Отправитель</Typography>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Организация:</Typography>
                            <Typography>{moving.from_organization_name}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Бригада:</Typography>
                            <Typography>{moving.from_team_name}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Создал:</Typography>
                            <Typography>{moving.creator_name}</Typography>
                        </Stack>
                    </Stack>
                    <Divider variant="middle" sx={{py: 1}}/>
                </Grid>
                <Grid xs={12} md={6}>
                    <Stack spacing={2}>
                        <Typography textAlign={'center'} variant={'h6'} fontSize={'bold'}>Получатель</Typography>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Организация:</Typography>
                            <Typography>{moving.to_organization_name}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Бригада:</Typography>
                            <Typography>{moving.to_team_name}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>Получил:</Typography>
                            <Typography>{moving.recipient_name}</Typography>
                        </Stack>
                    </Stack>
                    <Divider variant="middle" sx={{py: 1}}/>
                </Grid>
                <Grid xs={12} md={4}>
                    <Stack spacing={1} direction={"row"} alignItems={'center'}>
                        <Typography color={"text.secondary"}>Комплект:</Typography>
                        <Typography variant={'h6'} fontSize={'bold'}>{moving.send_kit_name}</Typography>
                    </Stack>
                </Grid>
                <Grid xs={12} md={3}>
                    <Stack spacing={1} direction={"row"} alignItems={'center'}>
                        <Typography color={"text.secondary"}>Количество:</Typography>
                        <Typography>{moving.amount}</Typography>
                    </Stack>
                </Grid>
                <Grid xs={6} md={1}>
                    {moving.transfer_basis === 'rent' &&
                        <Typography variant={'h6'} fontSize={'bold'}>Арнеда</Typography>}
                </Grid>
                <Grid xs={6} md={4}>
                    {actionButton}
                </Grid>
            </Grid>
            {movingForm}
        </Paper>
    )
}

export default MovingItem