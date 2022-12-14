import React, {useEffect, useMemo, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    IconButton,
    Paper,
    Stack, TextField, Tooltip,
    Typography
} from "@mui/material";
import Kits from "./Kits";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {
    createTeam,
    getOrganizationsTK
} from "../../store/actions/kits";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {Form} from "antd";
import {ITeam} from "../../models/IKit";
import {validateEditAccess} from "../utils";
import OperationTimeDrawer from "./OperationTimeDrawer";
import {getManufacturers, getParameters} from "../../store/actions/catalog";


const OrganizationsTeamKits = () => {
    const dispatch = useAppDispatch()
    const {organizationsTK} = useAppSelector(state => state.kitReducer)
    const {parameters, manufacturers} = useAppSelector(state => state.catalogReducer)
    const {user} = useAppSelector(state => state.authReducer)
    const [openTeamFormDialog, setOpenTeamFormDialog] = useState<number | null>(null)
    const [form] = Form.useForm();


    const edit = useMemo(() => validateEditAccess(user!, 'teams'), [user])


    useEffect(() => {
        dispatch(getOrganizationsTK())
        if (manufacturers.length === 0) dispatch(getManufacturers())
        if (parameters.length === 0) dispatch(getParameters())
    }, [])

    const TeamFormDialog = useMemo((editData: ITeam | null = null) => {
        const initialValues = {name: '', location_name: ''}
        if (!!editData) console.log(editData)

        const handleClose = () => {
            setOpenTeamFormDialog(null)
            form.resetFields()
        }

        return (
            <Dialog
                open={!!openTeamFormDialog}
                fullWidth
                maxWidth={'sm'}
                onClose={handleClose}
            >
                <Form
                    form={form}
                    onFinish={(values: ITeam) => {
                        if (openTeamFormDialog) values.organization = openTeamFormDialog
                        dispatch(createTeam(values))
                        handleClose()
                    }}
                    initialValues={initialValues}
                >
                    <DialogTitle>{'???????????????????? ??????????????'}</DialogTitle>
                    <DialogContent className={'form-paper'}>
                        <Form.Item
                            name="name"
                            required={true}
                        >
                            <TextField
                                autoFocus
                                required
                                label="????????????????????????"
                                // variant="standard"
                                fullWidth
                            />

                        </Form.Item>
                        <Form.Item
                            name="location_name"
                            required={true}
                        >
                            <TextField
                                required
                                label="????????????????????????"
                                fullWidth
                                // variant="standard"
                            />
                        </Form.Item>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>????????????</Button>
                        <Form.Item>
                            <Button type={'submit'}>
                                ????????????????
                            </Button>
                        </Form.Item>
                    </DialogActions>
                </Form>
            </Dialog>
        )
    }, [openTeamFormDialog])

    const body = useMemo(() => {
        if (organizationsTK.length === 0) {
            return <Box key={`empty`} sx={{maxWidth: '1400px'}}>
                <Paper sx={{p: 2}}>
                    <Typography variant={'h4'}>???????????? ???????? ??????</Typography>
                </Paper>
            </Box>
        }
        return organizationsTK.map(({id, name, teams}) =>
            (
                <Box key={`org${id}`} sx={{maxWidth: '1400px'}}>
                    <Paper sx={{p: 1, mb: 1, borderBottomRightRadius: 0, borderBottomLeftRadius: 0}}>
                        <Grid container spacing={1}>
                            <Grid item xs={2}>
                                <Box flexGrow={1}/>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant={'h5'} textAlign={'center'}
                                            letterSpacing={'2px'}>{name}</Typography>
                            </Grid>
                            <Grid item xs={2} textAlign={'end'}>
                                {edit &&
                                    <Tooltip title={'?????????????? ??????????????'}>
                                        <IconButton onClick={() => setOpenTeamFormDialog(id)}>
                                            <GroupAddIcon/>
                                        </IconButton>
                                    </Tooltip>}
                            </Grid>
                        </Grid>
                    </Paper>
                    {teams.map(({team_kit}, index) => (
                        <Accordion key={`team_kit_${team_kit.id}`} defaultExpanded={index === 0}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls={`panel${team_kit.id}-content`}
                                id={`panel${team_kit.id}-header`}
                            >
                                <Typography variant="h5">
                                    {team_kit.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{p: 0}}>
                                <Kits teamKit={team_kit}/>
                            </AccordionDetails>
                        </Accordion>
                    ))
                    }
                </Box>
            )
        )
    }, [organizationsTK])

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Stack spacing={2}>
                {body}
            </Stack>
            {TeamFormDialog}
            <OperationTimeDrawer/>
        </Box>
    )
};

export default OrganizationsTeamKits;