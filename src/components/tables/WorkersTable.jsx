import React, { useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Text, Avatar, ScrollArea, Box } from '@mantine/core';

import { IconCheck } from '@tabler/icons-react';
import { Edit, Trash } from 'iconsax-react';

// import EditClient from '../modals/EditClient';
import { useDisclosure } from '@mantine/hooks';
import EditWorker from '../modals/EditWorker';

const WorkersTable = ({ teamMembers, jobs }) => {
    const [selectedRow, setSelectedRow] = useState('');
    const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);

    // Use the workersJob function to get the workers with job names
    const workersJob = teamMembers.map((member) => {
        const job = jobs.find((job) => job.id === member.jobId);
        return {
            ...member,
            jobName: job ? job.name : 'Unknown', // Assign 'Unknown' if job is not found
        };
    });


    // Trigger confirm delete modal
    const openDeleteModal = (row) =>
        modals.openConfirmModal({
            title: <Text className="bold-title">Supprimer</Text>,
            centered: true,
            children: (
                <p>
                    Êtes-vous sûr de vouloir supprimer les informations pour cet ouvrier ?
                    Les tâches qui lui sont assignées doivent être ré-assignées à nouveau.
                </p>
            ),
            labels: { confirm: 'Supprimer', cancel: 'Non, revenir' },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                console.log('Confirmed');
                // Perform your deletion logic here
                notifications.show({
                    title: 'Succès',
                    message: 'Toutes les informations sur cet ouvrier ont été supprimées',
                    color: 'teal',
                    icon: <IconCheck />,
                    autoClose: 3000,
                    withCloseButton: true,
                });
            },
            closeOnConfirm: true,
        });

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'avatar',
                header: '',
                enableSorting: false, // Disable sorting for the avatar column
                enableColumnFilter: false,
                Cell: ({ renderedCellValue, row }) => (
                    <div className="table-header">
                        <div className="table-header-name">
                            <Avatar />
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Nom',
                Cell: ({ renderedCellValue, row }) => (
                    <div className="table-header">
                        <div className="table-header-name">{renderedCellValue}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'firstname',
                header: 'Prénom',
                Cell: ({ renderedCellValue, row }) => (
                    <div className="table-header">
                        <div className="table-header-name">{renderedCellValue}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'jobName', // Displaying job title as "Spécialité"
                header: 'Spécialité',
                Cell: ({ renderedCellValue, row }) => (
                    <div className="table-header">
                        <div className="table-header-name">{renderedCellValue}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Ajouté le',
                Cell: ({ renderedCellValue, row }) => (
                    <div className="table-header">
                        <div className="table-header-name">{renderedCellValue}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'actions',
                header: 'Actions',

                Cell: ({ row }) => (
                    <div className="table-action-buttons">
                        <Edit
                            size="24"
                            className="table-action-button-item"
                            id="edit-button"
                            onClick={() => {
                                // Open the EditClient drawer and pass the selected row data
                                editOpen();
                                setSelectedRow(row.original);
                            }}
                        />
                        <Trash
                            size="24"
                            className="table-action-button-item"
                            id="delete-button"
                            onClick={() => openDeleteModal(row.original)}
                        />
                    </div>
                ),
            },
        ],
        []
    );


    return (
        <>
            <div className="table-container">
                <MantineReactTable
                    columns={columns}
                    data={workersJob}

                    enableColumnResizing
                    enableColumnOrdering
                    enablePagination
                    enableStickyHeader

                    mantineTableContainerProps={{
                        style: {
                            width: '100%',
                            height: '100%',
                            overflowX: 'auto',
                            overflowY: 'auto',
                        },
                    }}
                />
            </div>
            <EditWorker
                editOpened={editOpened}
                editClose={editClose}
                selectedRow={selectedRow}
                jobs={jobs}
            />
        </>
    );
};

export default WorkersTable;