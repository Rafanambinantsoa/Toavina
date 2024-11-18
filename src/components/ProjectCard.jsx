import React from 'react';
import { Card, Badge, Menu, ActionIcon, RingProgress, Text } from '@mantine/core';
import { Edit, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useData } from '../context/DataProvider';
import '../styles/projects/projectcard.css';
import EditProject from './modals/EditProject';
import DetailsProject from './modals/DetailsProject';

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();
    const { clientData, taskData, workData, quoteData } = useData();

    const [opened, { open, close }] = useDisclosure(false);
    const [detailsOpened, { open: detailsOpen, close: detailsClose }] = useDisclosure(false);

    const projectClient = clientData.find(client => client.id === project.client_id);

    // Get quotes for this project
    const projectQuotes = quoteData.filter(quote => quote.projet_id === project.id);

    // Get works through quotes
    const projectWorks = projectQuotes.flatMap(quote =>
        workData.filter(work => work.devis_id === quote.id)
    );

    // Get tasks through works
    const projectTasks = projectWorks.flatMap(work =>
        taskData.filter(task => task.ouvrage_id === work.id)
    );

    // Calculate progress
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(task => task.etat_tache === 'termine').length;
    const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate total expenses
    const totalExpenses = projectTasks.reduce((sum, task) => {
        return sum + task.budget_mo_reel + task.budget_materiaux_reel +
            task.budget_materiel_reel + task.budget_sous_traitance_reel;
    }, 0);

    const handleCardClick = () => {
        navigate(`/projects/${project.id}`);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        open();
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
        detailsOpen();
    };

    return (
        <>
            <Card
                className="project-card-list-item"
                onClick={handleCardClick}
                padding="xl"
                radius='xl'
                withBorder
            >
                <div className="project-card-header">
                    <div className="project-card-title-container">
                        <Text className="project-title">{project.nom_projet}</Text>
                        <Text size='sm' c="dimmed" mt={4}>{projectClient.nom_client}</Text>
                    </div>
                    <div className="project-actions">
                        <ActionIcon variant="subtle" onClick={handleEditClick}>
                            <Edit size={18} />
                        </ActionIcon>
                        <Menu position="bottom-end">
                            <Menu.Target>
                                <ActionIcon variant="subtle" onClick={handleMenuClick}>
                                    <MoreVertical size={18} />
                                </ActionIcon>
                            </Menu.Target>
                        </Menu>
                    </div>
                </div>

                <div className="progress-section">
                    <Badge
                        className="phase-badge"
                        variant="filled"
                        color={project.phase_projet === 'realisation' ? 'green' :
                            project.phase_projet === 'devis' ? 'yellow' : 'blue'}
                    >
                        {project.phase_projet}
                    </Badge>
                    <RingProgress
                        size={64}
                        thickness={6}
                        roundCaps
                        sections={[{ value: progress, color: 'blue' }]}
                        label={
                            <Text c="blue" fw={700} ta="center" size="sm">
                                {progress}%
                            </Text>
                        }
                    />
                </div>

                <div className="financial-info">
                    <div className="info-item">
                        <Text size="sm" c="dimmed">Chiffre d'affaires</Text>
                        <Text>{project.chiffre_affaire.toLocaleString()} €</Text>
                    </div>
                    <div className="info-item">
                        <Text size="sm" c="dimmed">Dépenses</Text>
                        <Text>{totalExpenses.toLocaleString()} €</Text>
                    </div>
                </div>
            </Card>
            <EditProject
                opened={opened}
                onClose={close}
                projectData={project}
                clientData={clientData}
            />
            <DetailsProject
                opened={detailsOpened}
                onClose={detailsClose}
                projectData={project}
                clientData={clientData}
            />
        </>
    );
};

export default ProjectCard;