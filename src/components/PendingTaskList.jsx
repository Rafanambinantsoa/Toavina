import React from 'react';
import { ScrollArea } from '@mantine/core';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/dashboard/pending_tasks_list.css';

import { useData } from '../context/DataProvider';

const PendingTasksList = () => {
    const { taskData, projectData, workData, quoteData } = useData();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    };

    const getStatusText = (status) => {
        const statusMap = {
            en_attente: 'En attente',
            en_cours: 'En cours',
            termine: 'Terminée'
        };
        return statusMap[status] || status;
    };

    const getProjectName = (task) => {
        const work = workData.find(work => work.id === task.ouvrage_id);
        if (!work) return 'Unknown Project';

        const quote = quoteData.find(quote => quote.id === work.devis_id);
        if (!quote) return 'Unknown Project';

        const project = projectData.find(project => project.id === quote.projet_id);
        return project ? project.nom_projet : 'Unknown Project';
    };

    // Filter out completed tasks
    const pendingTasks = taskData.filter(task =>
        task.etat_tache === 'en_cours' || task.etat_tache === 'en_attente'
    );

    return (
        <>
            <ScrollArea.Autosize className="tasks-container">
                <div className="task-list">
                    {pendingTasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <div className="task-content">
                                <div className="task-header">
                                    <h4 className="task-title">{task.nom_tache}</h4>
                                </div>

                                <div className="task-meta">
                                    <span className="meta-item">
                                        <Clock size={16} />
                                        <span>{formatDate(task.date_fin_reelle)}</span>
                                    </span>

                                    <span className="meta-item">
                                        {task.status === 'en_attente' ? (
                                            <AlertCircle size={16} className="status-delayed" />
                                        ) : (
                                            <CheckCircle2 size={16} className="status-pending" />
                                        )}
                                        <span>{getStatusText(task.etat_tache)}</span>
                                    </span>

                                    <span className="meta-separator">•</span>
                                    <span className="project-name">{getProjectName(task)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea.Autosize>
        </>
    );
};

export default PendingTasksList;