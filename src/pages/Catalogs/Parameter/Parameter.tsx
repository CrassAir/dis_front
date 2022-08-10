import React, {useEffect, useMemo, useState} from 'react';
import {Box, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import MaterialReactTable, {MRT_Cell, MRT_ColumnDef, MRT_Row} from 'material-react-table';
import AddBoxIcon from '@mui/icons-material/AddBox'
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {getParameters} from "../../../store/actions/catalog";

type Person = {
    id: string,
    name: {
        firstName: string;
        lastName: string;
    };
    address: string;
    city: string;
    state: string;
};

const data: Person[] = [
    {
        id: 'John',
        name: {
            firstName: 'John',
            lastName: 'Doe',
        },
        address: '261 Erdman Ford',
        city: 'East Daphne',
        state: 'Kentucky',
    },
    {
        id: 'Jane',
        name: {
            firstName: 'Jane',
            lastName: 'Doe',
        },
        address: '769 Dominic Grove',
        city: 'Columbus',
        state: 'Ohio',
    },
    {
        id: 'Joe',
        name: {
            firstName: 'Joe',
            lastName: 'Doe',
        },
        address: '566 Brakus Inlet',
        city: 'South Linda',
        state: 'West Virginia',
    },
    {
        id: 'Kevin',
        name: {
            firstName: 'Kevin',
            lastName: 'Vandy',
        },
        address: '722 Emie Stream',
        city: 'Lincoln',
        state: 'Nebraska',
    },
    {
        id: 'Joshua',
        name: {
            firstName: 'Joshua',
            lastName: 'Rolluffs',
        },
        address: '32188 Larkin Turnpike',
        city: 'Omaha',
        state: 'Nebraska',
    },
];

const Parameter: React.FC = () => {
    const [ndata, setNdata] = useState(data)
    const [create, setCreate] = useState(false)
    const dispatch = useAppDispatch()
    const {parameters} = useAppSelector(state => state.catalogReducer)


    useEffect(() => {
        dispatch(getParameters())
    }, [])

    console.log(parameters)

    const columns = useMemo<MRT_ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'name.firstName',
                header: 'First Name',
            },
            {
                accessorKey: 'name.lastName',
                header: 'Last Name',
            },
            {
                accessorKey: 'address',
                header: 'Address',
            },
            {
                accessorKey: 'city',
                header: 'City',
            },
            {
                accessorKey: 'state',
                header: 'State',
            },
        ], [],
    );

    return (
        <MaterialReactTable
            columns={columns}
            data={ndata}
            muiTableBodyRowProps={({row}) => ({
                onClick: (e) => {
                    if (row.original.id === 'new') {
                        let target = e.target
                        for (let i = 0; i < 3; i++) {
                            // @ts-ignore
                            if (target.type === 'button' && target.attributes['aria-label'].value) {
                                setNdata(prevState => {
                                    prevState.shift()
                                    return [...prevState]
                                })
                                setCreate(false)
                                return
                            }
                            // @ts-ignore
                            target = target.parentNode
                        }
                    } else if (create) {
                        setNdata(prevState => {
                            prevState.shift()
                            return [...prevState]
                        })
                        setCreate(false)

                    }
                }
            })}
            onEditRowSubmit={({row, table}) => {
                console.log(row)
                console.log(table)
            }}
            initialState={{
                pagination: {pageSize: 25, pageIndex: 0},
                density: 'compact',
            }}
            muiTableTopToolbarProps={{
                sx: {
                    borderRadius: '10px'
                }
            }}
            muiTableBottomToolbarProps={{
                sx: {
                    borderRadiusBottom: '10px'
                }
            }}
            // enableRowSelection //enable some features
            enableHiding={false}
            enableColumnOrdering={false}
            enableColumnActions={false}
            enableColumnDragging={false}
            enableEditing
            renderTopToolbarCustomActions={({table}) => {
                const handleCreateNewUser = () => {
                    if (!create) {
                        setCreate(true)
                        setNdata(prevState => [{
                            id: 'new',
                            name: {
                                firstName: '',
                                lastName: '',
                            },
                            address: '',
                            city: '',
                            state: '',
                        }, ...prevState,])
                        // @ts-ignore
                        table.setCurrentEditingRow(table.getRow('0'))
                    }
                };

                return (
                    <Box sx={{display: 'flex'}}>
                        <Typography variant="h4">Table Title</Typography>
                        <Tooltip arrow title="Create New User">
                            <IconButton onClick={handleCreateNewUser}>
                                <AddBoxIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            }}
        />
    )
}

export default Parameter