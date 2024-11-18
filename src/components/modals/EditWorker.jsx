import { useEffect, useState } from 'react';
import { Drawer, Divider, Text, TextInput, Select, Button, rem, Group, Image } from "@mantine/core";
import { Dropzone as MantineDropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';

import '../../styles/modal.css';

export default function EditWorker({ editOpened, editClose, selectedRow, jobs }) {
    const [previewImage, setPreviewImage] = useState(null);

    const form = useForm({
        initialValues: {
            name: '',
            firstname: '',
            jobId: '',
            photo: null,
        },
        validate: {
            name: (value) => !value ? 'Le nom est requis' : null,
            firstname: (value) => !value ? 'Le prénom est requis' : null,
            jobId: (value) => !value ? 'Le poste est requis' : null,
        }
    });

    // Populate form with selected worker data when drawer opens
    useEffect(() => {
        if (selectedRow) {
            form.setValues({
                name: selectedRow.name || '',
                firstname: selectedRow.firstname || '',
                jobId: selectedRow.jobId?.toString() || '',
                photo: selectedRow.photo || null,
            });

            // If there's an existing photo, set it as preview
            if (selectedRow.photo) {
                setPreviewImage(selectedRow.photo);
            }
        }
    }, [selectedRow]);

    const handleSubmit = (values) => {
        const updatedWorker = {
            ...selectedRow,
            ...values,
            updated_at: new Date().toISOString().split('T')[0],
        };

        console.log('Updated worker:', updatedWorker);

        notifications.show({
            title: 'Succès',
            message: 'Les informations de l\'ouvrier ont été mises à jour avec succès!',
            color: 'teal',
            icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
            autoClose: 5000,
            withCloseButton: true,
            styles: (theme) => ({
                root: { backgroundColor: theme.colors.teal[0], borderColor: theme.colors.teal[6] },
                title: { color: theme.colors.teal[9] },
                description: { color: theme.colors.teal[9] },
                closeButton: {
                    color: theme.colors.teal[9],
                    '&:hover': { backgroundColor: theme.colors.teal[1] },
                },
            }),
        });
        editClose();
    };

    const handleImageDrop = (files) => {
        if (files.length > 0) {
            const file = files[0];
            form.setFieldValue('photo', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <Drawer
            opened={editOpened}
            onClose={editClose}
            className="popup-modal"
            size="auto"
            position="right"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className="modal-content">
                    <section className="modal-title-section">
                        <h1 className="main-title">Modifier un ouvrier</h1>
                        <Text className="main-subtitle" c="dimmed" size='sm' mt='12'>
                            Modifier les informations de l'ouvrier
                        </Text>
                    </section>
                    <Divider className="divider" />
                    <div className="modal-datainput-content">
                        <div className="modal-form-section">
                            <TextInput
                                label="Nom"
                                placeholder="Nom de l'ouvrier"
                                withAsterisk
                                {...form.getInputProps('name')}
                            />
                            <TextInput
                                label="Prénom"
                                placeholder="Prénom de l'ouvrier"
                                withAsterisk
                                {...form.getInputProps('firstname')}
                            />
                            <Select
                                label="Poste"
                                placeholder="Sélectionner le poste"
                                withAsterisk
                                data={jobs.map((job) => ({
                                    value: job.id.toString(),
                                    label: job.name,
                                }))}
                                {...form.getInputProps('jobId')}
                            />
                            <MantineDropzone
                                onDrop={handleImageDrop}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                style={{
                                    marginTop: '32px'
                                }}
                            >
                                {previewImage ? (
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        width={200}
                                        height={200}
                                        radius="md"
                                        style={{ marginBottom: '16px' }}
                                    />
                                ) : (
                                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                                        <MantineDropzone.Accept>
                                            <IconUpload
                                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                                stroke={1.5}
                                            />
                                        </MantineDropzone.Accept>
                                        <MantineDropzone.Reject>
                                            <IconX
                                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                                stroke={1.5}
                                            />
                                        </MantineDropzone.Reject>
                                        <MantineDropzone.Idle>
                                            <IconPhoto
                                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                                stroke={1.5}
                                            />
                                        </MantineDropzone.Idle>

                                        <div>
                                            <Text size="xl" inline>
                                                Déposez une photo ici ou cliquez pour sélectionner
                                            </Text>
                                            <Text size="sm" c="dimmed" inline mt={7}>
                                                Chaque fichier ne doit pas dépasser 5mb
                                            </Text>
                                        </div>
                                    </Group>
                                )}
                            </MantineDropzone>
                        </div>
                        <div className="modal-action-button">
                            <Button
                                fullWidth
                                size="md"
                                type="submit"
                                disabled={!form.isValid()}
                            >
                                Mettre à jour
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Drawer>
    );
}