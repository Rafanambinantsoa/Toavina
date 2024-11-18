import React from 'react';
import { Card, Text, Progress, Avatar } from '@mantine/core';
import '../styles/dashboard/dashboard.css';
import '../styles/dashboard/dashboard_calendar.css';
import { ArrowCircleRight } from 'iconsax-react';
import PendingTasksList from '../components/PendingTaskList';
import QuoteCard from '../components/QuoteCard';
import ChartCard from '../components/ChartCard';
import { useData } from '../context/DataProvider';

const Dashboard = () => {
    //Access context
    const { taskData, teamMembers } = useData();

    // Calculate the number of completed tasks and total tasks
    const completedTasks = taskData.filter(task => task.etat_tache === 'termine').length;
    const totalTasks = taskData.length;
    const progressValue = (completedTasks / totalTasks) * 100;


    return (
        <div className="dashboard-container">
            <section className="main-title-section">
                <h1 className="main-title">Tableau de bord</h1>
                <Text className="main-subtitle" c="dimmed">Bienvenue 👋 !</Text>
            </section>

            <section className="bento-grid">
                <Card className="bento-item top-left" shadow="sm" padding="lg" withBorder>
                    <div className="project-card-container">
                        <Text className="main-subtitle" size='sm' c="dimmed">Projet en cours</Text>
                        <div className="project-card">
                            <div className="project-info">
                                <div className="project-title">
                                    <Text className="main-title" size='xl' weight={700} mt='sm'>{'Construction Mairie'}</Text>
                                    {/* <ArrowCircleRight
                                        className='arrow-right-icon'
                                        size={32}
                                    /> */}
                                </div>
                                <Avatar.Group>
                                    {teamMembers.slice(0, 3).map((member) => (
                                        <Avatar
                                            key={member.id}
                                            src={member.photo}
                                            size={32}
                                            alt={member.name}
                                        />
                                    ))}
                                    {teamMembers.length > 3 && (
                                        <Avatar size={32}>+{teamMembers.length - 3}</Avatar>
                                    )}
                                </Avatar.Group>
                            </div>
                            <div className="project-progress">
                                <Text size='md'>Tâches terminées : <span className='bold-title'>
                                    {completedTasks}
                                </span>
                                    /
                                    {totalTasks}
                                </Text>
                                <Progress size="xl" radius="xl" mt="lg" value={progressValue} />
                            </div>
                        </div>
                    </div>

                </Card>

                <Card className="bento-item top-right" shadow="sm" padding="lg" withBorder>
                    {/* Top right */}
                    <div className="project-card-container">
                        <Text className="main-subtitle" size='sm' c="dimmed">Tâches en attente</Text>
                        <div className="project-card">
                            <div className="pending-tasks-list">
                                <PendingTasksList />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="bento-item bottom-left" shadow="sm" padding="lg" withBorder>
                    {/* Bottom left */}
                    <div className="project-card-container">
                        <div className="project-card">
                            <div className="project-title">
                                <Text className="main-title" size='xl' weight={700} mt='sm'>{'Devis'}</Text>
                            </div>
                            <QuoteCard />
                        </div>
                    </div>
                </Card>

                <Card className="bento-item bottom-right" shadow="sm" padding="lg" withBorder>
                    {/* Bottom right */}
                    <div className="project-card-container">
                        <div className="project-card">
                            <div className="project-title">
                                <Text className="main-title" size='xl' weight={700} mt='sm'>Statistiques</Text>
                                <Text size='sm' weight={500} mb='md' c='dimmed'>Comparaison des budgets</Text>
                            </div>
                            <ChartCard budgetData={taskData} />
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default Dashboard;