import { Drawer, Divider, Text, TextInput, Textarea, Select, Button, rem } from "@mantine/core";
import { useForm } from '@mantine/form';
import '../../styles/modal.css'

import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';


export default function AddProject({ opened, onClose, clientData }) {
    const clientOptions = clientData.map(client => ({
        value: client.id.toString(),
        label: client.nom_client
    }));

    const form = useForm({
        initialValues: {
            nom_projet: '',
            description_projet: '',
            client_id: '',
            adresse_chantier: '',
        },
        validate: {
            nom_projet: (value) => !value ? 'Le nom du projet est requis' : null,
            client_id: (value) => !value ? 'Le client est requis' : null,
            adresse_chantier: (value) => !value ? "L'adresse du chantier est requise" : null,
        }
    });

    const handleSubmit = (values) => {
        console.log(values);
        // Add your submission logic here
        notifications.show({
            title: 'Succès',
            message: 'Le projet a été créé avec succès!',
            color: 'teal',
            icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
            autoClose: 5000, // Will close after 5 seconds
            withCloseButton: true,
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colors.teal[0],
                    borderColor: theme.colors.teal[6],
                },
                title: {
                    color: theme.colors.teal[9],
                },
                description: {
                    color: theme.colors.teal[9],
                },
                closeButton: {
                    color: theme.colors.teal[9],
                    '&:hover': {
                        backgroundColor: theme.colors.teal[1],
                    },
                },
            }),
        });
        onClose();
    };

    // Check if all required fields are filled
    const isFormValid = form.isValid() &&
        form.values.nom_projet &&
        form.values.client_id &&
        form.values.adresse_chantier;

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            className="popup-modal"
            size="auto"
            position="right"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className="modal-content">
                    <section className="modal-title-section">
                        <h1 className="main-title">Créer un projet</h1>
                        <Text className="main-subtitle" c="dimmed" size='sm' mt='12'>
                            Ajouter un projet à gérer dans votre liste de projets
                        </Text>
                    </section>
                    <Divider className="divider" />
                    <div className="modal-datainput-content">
                        <div className="modal-form-section">
                            <TextInput
                                label="Nom du projet"
                                placeholder="Nom du projet"
                                withAsterisk
                                {...form.getInputProps('nom_projet')}
                            />
                            <Textarea
                                label="Description du projet"
                                placeholder="Description du projet"
                                {...form.getInputProps('description_projet')}
                            />
                            <Select
                                label="Nom du client"
                                placeholder="Sélectionner le nom du client"
                                data={clientOptions}
                                withAsterisk
                                {...form.getInputProps('client_id')}
                            />
                            <TextInput
                                label="Adresse du chantier"
                                placeholder="Adresse du chantier"
                                withAsterisk
                                {...form.getInputProps('adresse_chantier')}
                            />
                        </div>
                        <div className="modal-action-button">
                            <Button
                                fullWidth
                                size="md"
                                type="submit"
                                disabled={!isFormValid}
                            >
                                Créer le projet
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Drawer>
    );
}