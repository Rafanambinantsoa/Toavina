import React, { useState, useMemo } from 'react';
import { Modal, Select, Button, MultiSelect, Avatar } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useData } from '../../context/DataProvider';

const PlanningModal = ({ isOpen, onClose, workData, taskData, onPlan }) => {
    const { teamMembers } = useData();
    const [selectedTask, setSelectedTask] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedWorkers, setSelectedWorkers] = useState([]);

    const selectData = useMemo(() => {
        // Keep track of which task IDs we've seen
        const seenTaskIds = new Set();

        const data = workData
            .map(work => {
                const workTasks = taskData
                    .filter(task => task.ouvrage_id === work.id)
                    .map(task => {
                        const taskValue = `task-${task.id}`;

                        // Skip if we've already seen this task ID
                        if (seenTaskIds.has(taskValue)) {
                            console.warn(`Duplicate task ID found: ${taskValue} in work ${work.nom_ouvrage}`);
                            return null;
                        }

                        seenTaskIds.add(taskValue);

                        return {
                            value: taskValue,
                            label: task.nom_tache
                        };
                    })
                    .filter(Boolean); // Remove any null entries from duplicates

                if (workTasks.length === 0) {
                    return null;
                }

                return {
                    group: work.nom_ouvrage,
                    items: workTasks
                };
            })
            .filter(Boolean); // Remove null entries

        console.log('Grouped task data:', data);
        console.log('All task IDs:', Array.from(seenTaskIds));

        return data;
    }, [workData, taskData]);

    const handleSubmit = () => {
        if (!selectedTask || !startDate || !endDate) return;

        const tache_id = parseInt(selectedTask.replace('task-', ''));

        onPlan({
            tache_id,
            date_debut_prevue: startDate,
            date_fin_prevue: endDate,
            workers: selectedWorkers
        });

        // Reset form
        setSelectedTask('');
        setStartDate(null);
        setEndDate(null);
        setSelectedWorkers([]);
        onClose();
    };


    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Planifier une tâche"
            size="lg"
            styles={{
                title: {
                    fontSize: '1.2rem',
                    fontWeight: 600
                }
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Select
                    label="Sélectionnez une tâche"
                    placeholder="Choisir une tâche"
                    value={selectedTask}
                    onChange={setSelectedTask}
                    data={selectData}
                    searchable
                    required
                    styles={{
                        label: {
                            marginBottom: '8px'
                        }
                    }}
                />

                <div style={{ display: 'flex', gap: '15px' }}>
                    <DateInput
                        label="Date de début"
                        placeholder="Sélectionner une date"
                        value={startDate}
                        onChange={setStartDate}
                        required
                        style={{ flex: 1 }}
                    />
                    <DateInput
                        label="Date de fin"
                        placeholder="Sélectionner une date"
                        value={endDate}
                        onChange={setEndDate}
                        required
                        style={{ flex: 1 }}
                        minDate={startDate || undefined}
                    />
                </div>

                <MultiSelect
                    label="Assigner des ouvriers"
                    placeholder="Sélectionner des ouvriers"
                    data={teamMembers.map(member => ({
                        value: member.id.toString(),
                        label: `${member.firstname} ${member.name}`,
                        photo: member.photo
                    }))}
                    value={selectedWorkers}
                    onChange={setSelectedWorkers}
                    itemComponent={({ photo, label }) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Avatar src={photo} size="sm" />
                            <span>{label}</span>
                        </div>
                    )}
                    searchable
                    clearable
                />

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '10px'
                }}>
                    <Button variant="subtle" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit}>
                        Planifier
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PlanningModal;