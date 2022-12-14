import React, {useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {IDefectoscopy} from "../../models/IDefectoscopy";
import {
    Box, Button,
    Divider,
    FormControl, FormHelperText,
    IconButton, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {
    createDefectoscopy,
    deleteDefectoscopy,
    getPipes,
    updateDefectoscopy
} from "../../store/actions/defect";
import Grid from "@mui/material/Unstable_Grid2";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from "moment/moment";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {ru} from "date-fns/locale";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {IKit} from "../../models/IKit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from '@mui/icons-material/Article';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {apiError, downloadBlankReport, downloadDefectReport, uploadDefectoscopyFile} from "../../api/api";
import {useSnackbar} from "notistack";
import {validateEditAccess} from "../utils";

type DefectItemProps = {
    defect: IDefectoscopy | any
    create?: boolean
    exit?: (create: boolean) => void
}

const DefectItem = ({defect, create, exit}: DefectItemProps) => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const {tools, organizations} = useAppSelector(state => state.catalogReducer)
    const {user, error} = useAppSelector(state => state.authReducer)
    const {standarts} = useAppSelector(state => state.defectReducer)
    const {organizationsTeam} = useAppSelector(state => state.kitReducer)
    const [data, setData] = useState({...defect})
    const [edit, setEdit] = useState(create)
    const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)

    const can_edit = useMemo(() => validateEditAccess(user!, 'defectoscopy'), [user])

    const onEdit = () => {
        if (!create) {
            setData({...defect})
            setEdit(!edit)
            setMenuAnchor(null)
        } else exit!(false)
    }

    const defaultField = (name: string, value: string, err: boolean) => {
        if (edit) {
            return <Paper elevation={0} sx={{width: '100%', height: 'fit-content'}}>
                <TextField value={value ? value : ''}
                           error={err}
                           onChange={e => setData((prev: any) => ({...prev, [name]: e.target.value}))}
                           variant={'outlined'}
                           fullWidth
                           helperText={err && '???????? ???? ?????????? ???????? ????????????!'}
                           size={'small'}/>
            </Paper>
        }
        return <Typography>{value}</Typography>
    }

    const defaultDateField = (name: string, value: string) => {
        if (edit) {
            return <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
                <DatePicker
                    value={value ? moment(value) : null}
                    minDate={moment().subtract(6, 'month').toDate()}
                    maxDate={moment().add(6, 'month').toDate()}
                    onChange={(e) => setData((prev: any) => ({...prev, [name]: e}))}
                    renderInput={(params: any) => <TextField {...params} placeholder={''} size={'small'}/>}
                />
            </LocalizationProvider>
        }
        return <Typography>{value && moment(value).format('DD-MM-YYYY')}</Typography>
    }

    const doc_number = useMemo(() => (
        defaultField('doc_number', data.doc_number, !!(error && !data.doc_number))
    ), [data.doc_number, edit, error])
    const location = useMemo(() => (
        defaultField('location', data.location, false)
    ), [data.location, edit, error])
    const application_number = useMemo(() => (
        defaultField('application_number', data.application_number, false)
    ), [data.application_number, edit, error])
    const date_defectoscopy_start = useMemo(() => (
        defaultDateField('date_defectoscopy_start', data.date_defectoscopy_start)
    ), [data.date_defectoscopy_start, edit, error])
    const date_defectoscopy_end = useMemo(() => (
        defaultDateField('date_defectoscopy_end', data.date_defectoscopy_end)
    ), [data.date_defectoscopy_end, edit, error])

    const organization = useMemo(() => {
        if (edit) {
            const err = !!(error && !data.organization)
            return <TextField
                required
                select
                value={data.organization ? data.organization : ''}
                error={err}
                fullWidth
                helperText={err && '???????? ???? ?????????? ???????? ????????????!'}
                onChange={(e) => (
                    setData((prev: any) => ({...prev, organization: e.target.value}))
                )}
                size={'small'}
            >
                {organizations.map((item, index) => (
                    <MenuItem
                        key={index}
                        value={item.id}
                    >
                        {item.name}
                    </MenuItem>
                ))}
            </TextField>
        }
        return <Typography>{organizations.find(org => org.id === data.organization)?.name}</Typography>
    }, [data.organization, organizations, edit, error])

    const kit = useMemo(() => {
        const err = !!(error && !data.kit)
        if (edit) {
            return <TextField
                required
                select
                value={data.kit ? data.kit : ''}
                fullWidth
                error={err}
                helperText={err && '???????? ???? ?????????? ???????? ????????????!'}
                onChange={(e) => {
                    setData((prev: any) => ({...prev, kit: e.target.value}))
                }}
                size={'small'}
            >
                {organizationsTeam.map(org => {
                    const items = org.teams.map((team: any) => {
                        const sub_items = team.team_kit.kits.map((kit: IKit) => (
                            <MenuItem
                                key={kit.id}
                                onClick={() => setData((prev: any) => ({...prev, organization: org.id}))}
                                value={kit.id}>
                                {kit.name}
                            </MenuItem>
                        ))
                        return [<ListSubheader key={team.name}>{team.name}</ListSubheader>, sub_items]
                    })
                    if (data.organization) {
                        if (org.id === data.organization) return items
                        return null
                    }
                    return [<ListSubheader key={org.name}>{org.name}</ListSubheader>, items]
                })}
            </TextField>
        }
        let sKit: IKit | undefined;
        organizationsTeam.forEach((org) => org.teams.forEach((team: any) => {
            team.team_kit.kits.forEach((kit: IKit) => {
                if (kit.id === data.kit) sKit = kit
            })
        }))
        return <Typography>{sKit?.name}</Typography>
    }, [data.kit, data.organization, organizationsTeam, edit, error])

    const toolList = useMemo(() => {
        if (edit) {
            const err = !!(error && !data.tools)
            return <FormControl fullWidth error={err}>
                <Select
                    multiple
                    value={data.tools ? data.tools : []}
                    onChange={(e) => (
                        setData((prev: any) => ({...prev, tools: e.target.value}))
                    )}
                    input={<OutlinedInput size={'small'} fullWidth/>}
                >
                    {tools.map((item, index) => (
                        <MenuItem
                            key={index}
                            value={item.id}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText hidden={!err}>???????? ???? ?????????? ???????? ????????????!</FormHelperText>
            </FormControl>
        }
        return <Stack spacing={1}>
            {tools.map((item, index) => data.tools.includes(item.id) &&
                <Typography key={index}>{item.name}</Typography>)}
        </Stack>
    }, [data.tools, tools, edit, error])

    const standartList = useMemo(() => {
        if (edit) {
            const err = !!(error && !data.standarts)
            return <FormControl fullWidth error={err}>
                <Select
                    multiple
                    value={data.standarts ? data.standarts : []}
                    onChange={(e) => (
                        setData((prev: any) => ({...prev, standarts: e.target.value}))
                    )}
                    input={<OutlinedInput size={'small'} fullWidth/>}
                >
                    {standarts.map((item, index) => (
                        <MenuItem
                            key={index}
                            value={item.id}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText hidden={!err}>???????? ???? ?????????? ???????? ????????????!</FormHelperText>
            </FormControl>
        }
        return <Stack spacing={1}>
            {standarts.map((item, index) => data.standarts.includes(item.id) &&
                <Typography key={index}>{item.name}</Typography>)}
        </Stack>
    }, [data.standarts, standarts, edit, error])

    const handleUpload = (e: any) => {
        if (e.target?.files.length > 0) {
            const data = uploadDefectoscopyFile(defect, e.target.files[0])
            data.then(_ => enqueueSnackbar('?????????? ?????????????? ????????????????', {variant: 'success'}))
                .catch(err => enqueueSnackbar(apiError(err).message, {variant: 'error'}))
        }
        setMenuAnchor(null)
    }

    const headMenu = useMemo(() => (
        <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={() => setMenuAnchor(null)}
        >
            <MenuItem
                disabled={data.pipe_count === 0}
                onClick={() => {
                    dispatch(getPipes(data))
                    setMenuAnchor(null)
                }}>
                <ListItemIcon>
                    <ArticleIcon/>
                </ListItemIcon>
                <ListItemText>????????????????</ListItemText>
            </MenuItem>
            <MenuItem
                disabled={data.pipe_count === 0}
                onClick={() => {
                    const snak = enqueueSnackbar('???????????? ????????????????...')
                    downloadDefectReport(data)
                        .then(() => {
                            closeSnackbar(snak);
                            enqueueSnackbar('???????????????? ??????????????????')
                        })
                        .catch(err => enqueueSnackbar(apiError(err).message, {variant: 'error'}))
                    setMenuAnchor(null)
                }}>
                <ListItemIcon>
                    <FileDownloadIcon/>
                </ListItemIcon>
                <ListItemText>?????????????? ??????????</ListItemText>
            </MenuItem>
            <MenuItem component="label" disabled={!can_edit}>
                <input
                    hidden
                    id={'report-upload'}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleUpload}
                    type="file"
                />
                <ListItemIcon>
                    <UploadFileIcon/>
                </ListItemIcon>
                <ListItemText>?????????????????? ??????????</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                downloadBlankReport(data)
                setMenuAnchor(null)
            }}>
                <ListItemIcon>
                    <FileCopyIcon/>
                </ListItemIcon>
                <ListItemText>?????????????? ???????????? ????????????</ListItemText>
            </MenuItem>
            <MenuItem onClick={onEdit} disabled={!can_edit}>
                <ListItemIcon>
                    <EditIcon/>
                </ListItemIcon>
                <ListItemText>??????????????????????????</ListItemText>
            </MenuItem>
            <MenuItem
                disabled={!can_edit}
                onClick={() => {
                    dispatch(deleteDefectoscopy(data))
                    setMenuAnchor(null)
                }}>
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                <ListItemText>??????????????</ListItemText>
            </MenuItem>
        </Menu>
    ), [menuAnchor])

    const actionButton = useMemo(() => {
        if (edit) {
            return <IconButton title={'????????????'} onClick={onEdit}>
                <CancelIcon/>
            </IconButton>
        }
        return <IconButton key={'detail'} title={"????????????????"}
                           onClick={(e) => setMenuAnchor(e.currentTarget)}><MoreVertIcon/></IconButton>
    }, [edit])


    return (
        <Paper>
            <Paper elevation={4}
                   sx={{
                       backgroundColor: data.date_defectoscopy_end ? 'success.light' : 'info.light',
                       p: 1,
                       position: 'relative',
                       alignItems: 'inherit'
                   }}>
                <Box sx={{position: 'absolute', right: '0', top: '0'}}>
                    {actionButton}
                </Box>
                <Grid container spacing={2} columns={16} alignItems={"center"}>
                    <Grid xs={16} md={5}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>???????? ???????????????? ????????????:</Typography>
                            <Typography>{data.date_create && moment(data.date_create).format('DD-MM-YYYY')}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={16} md={5}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>?????????? ??????????????????:</Typography>
                            {doc_number}
                        </Stack>
                    </Grid>
                    <Grid xs={16} md={'auto'}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>?????????? ????????????:</Typography>
                            {application_number}
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
            <Box sx={{p: 1}}>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>??????????????????????:</Typography>
                            {organization}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>?????????? ????????????????????:</Typography>
                            {location}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>????????????????????:</Typography>
                            {toolList}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>??????????????????:</Typography>
                            {standartList}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Divider variant="middle"/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>????????????????:</Typography>
                            {kit}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1}>
                            <Stack spacing={1} direction={"row"}>
                                <Typography color={"text.secondary"}>???????????????????? ???????? ?? ??????????????????:</Typography>
                                <Typography>{data.kit_count}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                                <Typography color={"text.secondary"}>???????????????????? ?????????????????????? ????????:</Typography>
                                <Typography>{data.pipe_count}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                                <Typography color={"text.secondary"}>???????????????????? ????????:</Typography>
                                <Typography>{data.lom_count}</Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Divider variant="middle"/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>???????? ???????????? ??????????????????????????:</Typography>
                            {date_defectoscopy_start}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={1} direction={"row"}>
                            <Typography color={"text.secondary"}>???????? ?????????????????? ??????????????????????????:</Typography>
                            {date_defectoscopy_end}
                        </Stack>
                    </Grid>
                    {edit && <React.Fragment>
                        <Grid xs={12} md={12}>
                            <Divider variant="middle"/>
                        </Grid>
                        <Grid xs={12} md={12} display={'flex'} justifyContent={'end'}>
                            <Button sx={{height: '40px'}} variant={'contained'}
                                    onClick={() => {
                                        if (create) {
                                            data.defectoscopist = user!.id
                                            dispatch(createDefectoscopy(data)).then(val => val.meta.requestStatus !== 'rejected' && exit!(false))

                                        } else {
                                            dispatch(updateDefectoscopy(data)).then((val) => val.meta.requestStatus !== 'rejected' && setEdit(false))
                                        }
                                    }}>
                                {create ? '??????????????' : '????????????????'}
                            </Button>
                        </Grid>
                    </React.Fragment>}
                </Grid>
            </Box>
            {headMenu}
        </Paper>
    );
};

export default DefectItem;