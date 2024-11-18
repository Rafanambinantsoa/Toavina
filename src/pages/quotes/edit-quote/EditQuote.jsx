import React, { useEffect } from 'react';
import { Modal, Group, Button, Text, ScrollArea, TextInput, NumberInput, ActionIcon, Stack, Paper, Textarea, Select, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, Trash } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

const EditQuote = ({
    editOpened,
    closeEdit,
    quote,
    workData,
    taskData,
    budgetData,
    formatQuoteNumber
}) => {
    // Initialize form with default structure
    const form = useForm({
        initialValues: {
            works: []
        }
    });

    // Helper function to get budgets for a specific task
    const getTaskBudgets = (tache_id) => {
        return budgetData.filter(budget => budget.tache_id === tache_id).map(budget => ({
            id: budget.id,
            type: getBudgetType(budget.subtype),
            unitPrice: budget.prix_unitaire.toString(),
            quantity: budget.quantite.toString()
        }));
    };

    // Convert budget subtype to display type
    const getBudgetType = (subtype) => {
        const typeMap = {
            'budget_mo': 'budget_mo_previsionnel',
            'budget_materiaux': 'budget_materiaux_previsionnel',
            'budget_materiel': 'budget_materiel_previsionnel',
            'budget_sous_traitance': 'budget_sous_traitance_previsionnel'
        };
        return typeMap[subtype] || subtype;
    };

    // Convert display type to budget subtype
    const getBudgetSubtype = (type) => {
        const subtypeMap = {
            'budget_mo_previsionnel': 'budget_mo',
            'budget_materiaux_previsionnel': 'budget_materiaux',
            'budget_materiel_previsionnel': 'budget_materiel',
            'budget_sous_traitance_previsionnel': 'budget_sous_traitance'
        };
        return subtypeMap[type] || type;
    };

    // Initialize form data from props
    useEffect(() => {
        if (workData && taskData && budgetData) {
            const initialWorks = workData.map(work => {
                const workTasks = taskData
                    .filter(task => task.ouvrage_id === work.id)
                    .map(task => ({
                        id: task.id,
                        name: task.nom_tache,
                        budgets: getTaskBudgets(task.id)
                    }));

                return {
                    id: work.id,
                    name: work.nom_ouvrage,
                    description_ouvrage: work.description_ouvrage || '',
                    tasks: workTasks
                };
            });

            form.setValues({ works: initialWorks });
        }
    }, [workData, taskData, budgetData]);

    // Form update handlers
    const updateWork = (ouvrage_id, field, value) => {
        const works = form.values.works.map(work =>
            work.id === ouvrage_id ? { ...work, [field]: value } : work
        );
        form.setValues({ works });
    };

    const updateTask = (ouvrage_id, tache_id, value) => {
        const works = form.values.works.map(work => {
            if (work.id === ouvrage_id) {
                const tasks = work.tasks.map(task =>
                    task.id === tache_id ? { ...task, name: value } : task
                );
                return { ...work, tasks };
            }
            return work;
        });
        form.setValues({ works });
    };

    const updateBudget = (ouvrage_id, tache_id, budgetId, field, value) => {
        const works = form.values.works.map(work => {
            if (work.id === ouvrage_id) {
                const tasks = work.tasks.map(task => {
                    if (task.id === tache_id) {
                        const budgets = task.budgets.map(budget =>
                            budget.id === budgetId ? { ...budget, [field]: value } : budget
                        );
                        return { ...task, budgets };
                    }
                    return task;
                });
                return { ...work, tasks };
            }
            return work;
        });
        form.setValues({ works });
    };

    // Add/Remove handlers
    const addWork = () => {
        const newWork = {
            id: Date.now(),
            name: '',
            description_ouvrage: '',
            tasks: [{
                id: Date.now() + 1,
                name: '',
                budgets: [{
                    id: Date.now() + 2,
                    type: 'budget_mo_previsionnel',
                    unitPrice: '',
                    quantity: ''
                }]
            }]
        };
        form.setValues({ works: [...form.values.works, newWork] });
    };

    const removeWork = (ouvrage_id) => {
        form.setValues({
            works: form.values.works.filter(work => work.id !== ouvrage_id)
        });
    };

    const addTask = (ouvrage_id) => {
        const works = form.values.works.map(work => {
            if (work.id === ouvrage_id) {
                const newTask = {
                    id: Date.now(),
                    name: '',
                    budgets: [{
                        id: Date.now() + 1,
                        type: 'budget_mo_previsionnel',
                        unitPrice: '',
                        quantity: ''
                    }]
                };
                return { ...work, tasks: [...work.tasks, newTask] };
            }
            return work;
        });
        form.setValues({ works });
    };

    const removeTask = (ouvrage_id, tache_id) => {
        const works = form.values.works.map(work => {
            if (work.id === ouvrage_id) {
                return {
                    ...work,
                    tasks: work.tasks.filter(task => task.id !== tache_id)
                };
            }
            return work;
        });
        form.setValues({ works });
    };

    const addBudget = (ouvrage_id, tache_id) => {
        const works = form.values.works.map(work => {
            if (work.id === ouvrage_id) {
                const tasks = work.tasks.map(task => {
                    if (task.id === tache_id) {
                        const newBudget = {
                            id: Date.now(),
                            type: 'budget_mo_previsionnel',
                            unitPrice: '',
                            quantity: ''
                        };
                        return { ...task, budgets: [...task.budgets, newBudget] };
                    }
                    return task;
                });
                return { ...work, tasks };
            }
            return work;
        });
        form.setValues({ works });
    };

    const removeBudget = (ouvrage_id, tache_id, budgetId) => {
        const works = form.values.works.map(work => {
            if (work.id === ouvrage_id) {
                const tasks = work.tasks.map(task => {
                    if (task.id === tache_id) {
                        return {
                            ...task,
                            budgets: task.budgets.filter(budget => budget.id !== budgetId)
                        };
                    }
                    return task;
                });
                return { ...work, tasks };
            }
            return work;
        });
        form.setValues({ works });
    };

    // Get available budget types for select
    const getAvailableBudgetTypes = (task, currentBudgetId) => {
        const usedTypes = task.budgets
            .filter(budget => budget.id !== currentBudgetId)
            .map(budget => budget.type);

        const allTypes = [
            { value: 'budget_mo_previsionnel', label: "Main d'oeuvre" },
            { value: 'budget_materiaux_previsionnel', label: "Matériaux" },
            { value: 'budget_materiel_previsionnel', label: "Matériel" },
            { value: 'budget_sous_traitance_previsionnel', label: "Sous-traitance" }
        ];

        return allTypes.filter(type => !usedTypes.includes(type.value));
    };

    // Handle save
    const handleSave = () => {
        const formattedData = {
            works: form.values.works.map(work => ({
                id: work.id,
                nom_ouvrage: work.name,
                description_ouvrage: work.description_ouvrage,
                tasks: work.tasks.map(task => ({
                    id: task.id,
                    nom_tache: task.name,
                    ouvrage_id: work.id,
                    budgets: task.budgets.map(budget => ({
                        id: budget.id,
                        tache_id: task.id,
                        type: 'previsionnel',
                        subtype: getBudgetSubtype(budget.type),
                        prix_unitaire: parseFloat(budget.unitPrice),
                        quantite: parseFloat(budget.quantity)
                    }))
                }))
            }))
        };

        console.log('Saving:', formattedData);
        // Here you would typically send the data to your backend
        notifications.show({
            title: 'Succès',
            message: 'Le devis a été modifié avec succès!',
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
                description_ouvrage: {
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
        closeEdit();
    };

    return (
        <Modal
            opened={editOpened}
            onClose={closeEdit}
            title={
                <Text size="xl" weight={700} className="bold-title">
                    Modifier le devis N° {quote && formatQuoteNumber(quote)}
                </Text>
            }
            size={1200}
            centered
            styles={{
                body: {
                    height: '80vh',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                },
                header: {
                    marginBottom: 0,
                    padding: '20px 20px 0',
                },
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: 0,
                }}
            >
                <ScrollArea offsetScrollbars style={{ flex: 1, padding: '20px', minHeight: 0 }}>
                    <Stack spacing="xl">
                        {form.values.works.map((work) => (
                            <Paper key={work.id} p="md" withBorder>
                                <Stack spacing="md">
                                    <Group position="apart">
                                        <Text className="bold-title" size="lg">Ouvrage {work.id}</Text>
                                        <ActionIcon
                                            color="red"
                                            variant="subtle"
                                            onClick={() => removeWork(work.id)}
                                            disabled={form.values.works.length === 1}
                                        >
                                            <Trash size={18} />
                                        </ActionIcon>
                                    </Group>

                                    <TextInput
                                        label="Nom de l'ouvrage"
                                        placeholder="Nom de l'ouvrage"
                                        required
                                        value={work.name}
                                        onChange={(e) => updateWork(work.id, 'name', e.target.value)}
                                    />

                                    <Textarea
                                        label="Description de l'ouvrage"
                                        placeholder="Description de l'ouvrage"
                                        value={work.description_ouvrage}
                                        onChange={(e) => updateWork(work.id, 'description_ouvrage', e.target.value)}
                                    />

                                    <Stack spacing="md">
                                        {work.tasks.map((task) => (
                                            <Paper key={task.id} p="md" withBorder>
                                                <Stack spacing="md">
                                                    <Group position="apart">
                                                        <Text weight={500}>Tâche {task.id}</Text>
                                                        <ActionIcon
                                                            color="red"
                                                            variant="subtle"
                                                            onClick={() => removeTask(work.id, task.id)}
                                                            disabled={work.tasks.length === 1}
                                                        >
                                                            <Trash size={18} />
                                                        </ActionIcon>
                                                    </Group>
                                                    <TextInput
                                                        placeholder="Nom de la tâche"
                                                        required
                                                        value={task.name}
                                                        onChange={(e) => updateTask(work.id, task.id, e.target.value)}
                                                    />
                                                    <Stack spacing="xs">
                                                        {task.budgets.map((budget) => (
                                                            <Group key={budget.id} grow>
                                                                <Select
                                                                    placeholder="Type"
                                                                    data={getAvailableBudgetTypes(task, budget.id)}
                                                                    value={budget.type}
                                                                    onChange={(value) => updateBudget(work.id, task.id, budget.id, 'type', value)}
                                                                    required
                                                                />
                                                                <TextInput
                                                                    placeholder={budget.type === 'budget_mo_previsionnel' ? 'Tarif horaire' : 'Prix unitaire'}
                                                                    rightSection='€'
                                                                    value={budget.unitPrice}
                                                                    onChange={(e) => updateBudget(work.id, task.id, budget.id, 'unitPrice', e.target.value)}
                                                                    required
                                                                />
                                                                <TextInput
                                                                    placeholder="Quantité"
                                                                    rightSection={budget.type === 'budget_mo_previsionnel' ? 'h' : '€'}
                                                                    value={budget.quantity}
                                                                    onChange={(e) => updateBudget(work.id, task.id, budget.id, 'quantity', e.target.value)}
                                                                    required
                                                                />
                                                                <ActionIcon
                                                                    color="red"
                                                                    variant="subtle"
                                                                    onClick={() => removeBudget(work.id, task.id, budget.id)}
                                                                    disabled={task.budgets.length === 1}
                                                                >
                                                                    <Trash size={18} />
                                                                </ActionIcon>
                                                            </Group>
                                                        ))}
                                                    </Stack>
                                                    <Group justify="center">
                                                        <ActionIcon
                                                            size="lg"
                                                            color="blue"
                                                            variant="light"
                                                            onClick={() => addBudget(work.id, task.id)}
                                                            disabled={task.budgets.length >= 4}
                                                            radius="xl"
                                                        >
                                                            <Plus size={20} />
                                                        </ActionIcon>
                                                    </Group>
                                                </Stack>
                                            </Paper>
                                        ))}
                                    </Stack>
                                    <Group justify="center">
                                        <ActionIcon
                                            size="lg"
                                            color="blue"
                                            variant="light"
                                            onClick={() => addTask(work.id)}
                                            radius="xl"
                                        >
                                            <Plus size={20} />
                                        </ActionIcon>
                                    </Group>
                                </Stack>
                            </Paper>
                        ))}
                        <Group justify="center">
                            <ActionIcon
                                size="lg"
                                color="blue"
                                variant="light"
                                onClick={addWork}
                                radius="xl"
                            >
                                <Plus size={20} />
                            </ActionIcon>
                        </Group>
                    </Stack>
                </ScrollArea>
                <div
                    style={{
                        borderTop: '1px solid #dee2e6',
                        padding: '20px',
                        backgroundColor: 'white',
                        marginTop: 'auto',
                    }}
                >
                    <Group position="right" spacing="md">
                        <Button variant="outline" onClick={closeEdit}>
                            Annuler
                        </Button>
                        <Button onClick={handleSave}>Enregistrer</Button>
                    </Group>
                </div>
            </div>
        </Modal>
    );
};

export default EditQuote;