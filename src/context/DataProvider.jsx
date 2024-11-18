import React, { createContext, useContext, useState } from 'react';

// Create the context
const DataContext = createContext();

// Create a custom hook to use the context
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// Create the provider component
export const DataProvider = ({ children }) => {
    // Initialize state for all data types
    const [projectData, setProjectData] = useState([
        {
            id: 1,
            nom_projet: "Construction Hôpital",
            client_id: 1,
            chiffre_affaire: 200000,
            phase_projet: "realisation",
            description_projet: "Construction d'un nouvel hôpital avec des installations modernes.",
            adresse_chantier: "123 Rue de la Santé, Ville A",
            created_at: "2024-10-29"
        },
        {
            id: 2,
            nom_projet: "Rénovation Clinique",
            client_id: 2,
            chiffre_affaire: 150000,
            phase_projet: "devis",
            description_projet: "Rénovation de la clinique existante pour améliorer les services.",
            adresse_chantier: "45 Avenue de la Clinique, Ville B",
            created_at: "2024-10-29"
        },
        {
            id: 3,
            nom_projet: "Extension Urgences",
            client_id: 1,
            chiffre_affaire: 180000,
            phase_projet: "preparation",
            description_projet: "Extension de l'aile des urgences pour augmenter la capacité.",
            adresse_chantier: "678 Boulevard de l'Hôpital, Ville A",
            created_at: "2024-10-29"
        },
        {
            id: 4,
            nom_projet: "Modernisation Services",
            client_id: 3,
            chiffre_affaire: 220000,
            phase_projet: "realisation",
            description_projet: "Modernisation des services hospitaliers pour un meilleur confort des patients.",
            adresse_chantier: "89 Rue des Services, Ville C",
            created_at: "2024-10-29"
        },
        // ... other project data
    ]);

    const [clientData, setClientData] = useState([
        {
            id: 1,
            nom_client: "Centre Hospitalier Universitaire",
            email: 'chu@gouv.fr',
            contact_client: '+261 21 22 222 22',
            created_at: '2024-07-25'
        },
        {
            id: 2,
            nom_client: "Clinique Saint-Joseph",
            email: 'csj@clinique.org',
            contact_client: '+261 21 22 222 22',
            created_at: '2024-07-30'
        },
        {
            id: 3,
            nom_client: "Hôpital Privé de l'Est",
            email: 'hpe@sanu.fr',
            contact_client: '+261 21 22 222 22',
            created_at: '2024-10-25'
        }
        // ... other client data
    ]);

    const [quoteData, setQuoteData] = useState([
        {
            id: 1,
            projet_id: 1,
            date_creation: "2024-10-30",
            etat_devis: "valide",
        },
        {
            id: 2,
            projet_id: 2,
            date_creation: "2024-10-30",
            etat_devis: "en_attente",
        },
        {
            id: 3,
            projet_id: 1,
            date_creation: "2024-10-31",
            etat_devis: "refuse",
        },
        {
            id: 4,
            projet_id: 4,
            date_creation: "2024-11-01",
            etat_devis: "en_attente",
        },
        // ... autres données de devis
    ]);

    const [workData, setWorkData] = useState([
        {
            id: 1,
            devis_id: 1,
            nom_ouvrage: "Infrastructure",
            description_ouvrage: "Ouvrage concernant les infrastructures basiques",
        },
        {
            id: 2,
            devis_id: 1,
            nom_ouvrage: "Installation électrique",
            description_ouvrage: "Ouvrage concernant la mise en place du système électrique",
        },
        {
            id: 3,
            devis_id: 2,
            nom_ouvrage: "Isolement",
            description_ouvrage: "Isolement de la clinique",
        },
        // ... other work data
    ]);

    const [taskData, setTaskData] = useState([
        {
            id: 1,
            ouvrage_id: 1,
            nom_tache: 'Fondation',
            budget_mo_previsionnel: 1000,
            budget_materiaux_previsionnel: 500,
            budget_materiel_previsionnel: 700,
            budget_sous_traitance_previsionnel: 800,
            budget_mo_reel: 50000,
            budget_materiaux_reel: 40000,
            budget_materiel_reel: 30000,
            budget_sous_traitance_reel: 40000,
            etat_tache: "termine",
            description_tache: "Fondations",
            date_debut_prevue: "2024-10-31",
            date_fin_prevue: "2024-11-12",
            date_debut_reelle: "2024-11-01",
            date_fin_reelle: "2024-11-14",
        },
        {
            id: 2,
            ouvrage_id: 1,
            nom_tache: 'Murs',
            budget_mo_previsionnel: 1000,
            budget_materiaux_previsionnel: 500,
            budget_materiel_previsionnel: 700,
            budget_sous_traitance_previsionnel: 800,
            budget_mo_reel: 50000,
            budget_materiaux_reel: 40000,
            budget_materiel_reel: 30000,
            budget_sous_traitance_reel: 40000,
            etat_tache: "termine",
            description_tache: "Fondations",
            date_debut_prevue: "2024-10-31",
            date_fin_prevue: "2024-11-12",
            date_debut_reelle: "2024-11-01",
            date_fin_reelle: "2024-11-14",
        },
        {
            id: 3,
            ouvrage_id: 2,
            nom_tache: 'Installation des branchements électriques',
            budget_mo_previsionnel: 1000,
            budget_materiaux_previsionnel: 500,
            budget_materiel_previsionnel: 700,
            budget_sous_traitance_previsionnel: 800,
            budget_mo_reel: 30000,
            budget_materiaux_reel: 20000,
            budget_materiel_reel: 15000,
            budget_sous_traitance_reel: 25000,
            etat_tache: "en_cours",
            description_tache: "Électricité",
            date_debut_prevue: "2024-11-15",
            date_fin_prevue: "2024-11-22",
            date_debut_reelle: "2024-11-23",
            date_fin_reelle: "2024-11-27",
        },
        {
            id: 4,
            ouvrage_id: 3,
            nom_tache: "Isolement des murs",
            budget_mo_previsionnel: 1000,
            budget_materiaux_previsionnel: 500,
            budget_materiel_previsionnel: 700,
            budget_sous_traitance_previsionnel: 800,
            budget_mo_reel: 25000,
            budget_materiaux_reel: 30000,
            budget_materiel_reel: 20000,
            budget_sous_traitance_reel: 35000,
            etat_tache: "en_attente",
            description_tache: "Isolement des murs",
            date_debut_prevue: "2024-10-31",
            date_fin_prevue: "2024-11-12",
            date_debut_reelle: "2024-11-01",
            date_fin_reelle: "2024-11-14",
        },
    ]);

    // Example of the budget data structure
    const [budgetData, setBudgetData] = useState([
        {
            id: 1,
            tache_id: 1,
            type: 'previsionnel',
            subtype: 'budget_mo',
            prix_unitaire: 100,
            quantite: 10
        },
        {
            id: 2,
            tache_id: 1,
            type: 'previsionnel',
            subtype: 'budget_materiaux',
            prix_unitaire: 100,
            quantite: 5
        },
        {
            id: 3,
            tache_id: 1,
            type: 'previsionnel',
            subtype: 'budget_materiel',
            prix_unitaire: 70,
            quantite: 10
        },
        {
            id: 4,
            tache_id: 1,
            type: 'previsionnel',
            subtype: 'budget_sous_traitance',
            prix_unitaire: 80,
            quantite: 10
        },
        {
            id: 5,
            tache_id: 2,
            type: 'previsionnel',
            subtype: 'budget_mo',
            prix_unitaire: 100,
            quantite: 10
        },
        {
            id: 6,
            tache_id: 2,
            type: 'previsionnel',
            subtype: 'budget_materiaux',
            prix_unitaire: 100,
            quantite: 5
        },
        {
            id: 7,
            tache_id: 2,
            type: 'previsionnel',
            subtype: 'budget_materiel',
            prix_unitaire: 70,
            quantite: 10
        },
        {
            id: 8,
            tache_id: 2,
            type: 'previsionnel',
            subtype: 'budget_sous_traitance',
            prix_unitaire: 80,
            quantite: 10
        },
        // ... similar entries for other real budgets
    ]);

    const [jobs, setJobs] = useState([
        {
            id: 1,
            name: "Charpentier"
        },
        {
            id: 2,
            name: "Maçon"
        },
        {
            id: 3,
            name: "Plombier"
        },
        {
            id: 4,
            name: "Electricien"
        },
        {
            id: 5,
            name: "Menuisier"
        },
        {
            id: 6,
            name: "Peintre"
        },
        {
            id: 7,
            name: "Couvreur"
        },
        {
            id: 8,
            name: "Serrurier-métallier"
        }
    ]
    )

    const [teamMembers, setTeamMembers] = useState([
        {
            id: 1,
            photo: "image1.png",
            name: "DUPONT",
            firstname: "Jean",
            jobId: 1,
            created_at: '2024-10-25'
        },
        {
            id: 2,
            photo: "image2.png",
            name: "BEAUDELAIRE",
            firstname: "Claire",
            jobId: 2,
            created_at: '2024-10-25'
        },
        {
            id: 3,
            photo: "image3.png",
            name: "DAOUDA",
            firstname: "Marianne",
            jobId: 3,
            created_at: '2024-10-25'
        },
        {
            id: 4,
            photo: "image4.png",
            name: "LECLERC",
            firstname: "François",
            jobId: 4,
            created_at: '2024-10-25'
        },
        {
            id: 5,
            photo: "image5.png",
            name: "VERSTAPPEN",
            firstname: "Maxime",
            jobId: 5,
            created_at: '2024-10-25'
        },
        {
            id: 6,
            photo: "image6.png",
            name: "CREST",
            firstname: "Lester",
            jobId: 6,
            created_at: '2024-10-25'
        },
        {
            id: 7,
            photo: "image7.png",
            name: "HAMILTON",
            firstname: "Louis",
            jobId: 7,
            created_at: '2024-10-25'
        },
        // ... other team members
    ]);

    // Add this to your DataProvider.jsx
    const [messageData, setMessageData] = useState([
        {
            id: 1,
            content: "Bonjour! Je suis votre assistant d'optimisation budgétaire. Comment puis-je vous aider aujourd'hui?",
            isBot: true,
            timestamp: new Date('2024-01-01T09:00:00')
        },
        {
            id: 2,
            content: "Je peux vous aider à analyser les budgets prévisionnels et réels de vos projets pour identifier des opportunités d'optimisation.",
            isBot: true,
            timestamp: new Date('2024-01-01T09:00:01')
        }
    ]);

    // New schedule data state
    const [scheduleData, setScheduleData] = useState([
        // Example entry:
        {
            id: 1,                    // Unique identifier for the schedule entry
            tache_id: 1,                // References taskData.id
            ouvrier_id: 1,              // References teamMembers.id
            date_edt: "2024-10-31",    // The date of the assignment
            heure_debut: "08:00",      // Start time of the work
            heure_fin: "17:00",        // End time of the work
            created_at: "2024-10-25", // When this assignment was created
            status: "assigned"         // Status of the assignment (assigned, completed, cancelled)
        }
    ]);

    // Helper function to get workers assigned to a specific task
    const getTaskWorkers = (tache_id) => {
        const assignments = scheduleData.filter(schedule => schedule.tache_id === tache_id);
        return teamMembers.filter(worker =>
            assignments.some(assignment => assignment.ouvrier_id === worker.id)
        );
    };

    // Helper function to get tasks assigned to a specific worker
    const getWorkerTasks = (ouvrier_id) => {
        const assignments = scheduleData.filter(schedule => schedule.ouvrier_id === ouvrier_id);
        return taskData.filter(task =>
            assignments.some(assignment => assignment.tache_id === task.id)
        );
    };

    // Helper function to add new task assignments
    const assignWorkersToTask = (tache_id, workerIds, date, startTime = "08:00", endTime = "17:00") => {
        const newAssignments = workerIds.map(ouvrier_id => ({
            id: Math.max(0, ...scheduleData.map(s => s.id)) + 1, // Generate new ID
            tache_id,
            ouvrier_id,
            date_edt: date,
            heure_debut: startTime,
            heure_fin: endTime,
            created_at: new Date().toISOString().split('T')[0],
            status: "assigned"
        }));

        setScheduleData(prev => [...prev, ...newAssignments]);
        return newAssignments;
    };

    // Helper function to update assignment status
    const updateAssignmentStatus = (assignmentId, newStatus) => {
        setScheduleData(prev => prev.map(schedule =>
            schedule.id === assignmentId
                ? { ...schedule, status: newStatus }
                : schedule
        ));
    };

    // Helper function to remove assignments
    const removeAssignments = (tache_id, workerIds = null) => {
        setScheduleData(prev => prev.filter(schedule => {
            if (schedule.tache_id !== tache_id) return true;
            if (workerIds === null) return false;
            return !workerIds.includes(schedule.ouvrier_id);
        }));
    };

    // Create methods to update the data
    const addProject = (newProject) => {
        setProjectData(prev => [...prev, { ...newProject, id: prev.length + 1 }]);
    };

    const updateProject = (updatedProject) => {
        setProjectData(prev => prev.map(project =>
            project.id === updatedProject.id ? updatedProject : project
        ));
    };

    const deleteProject = (projet_id) => {
        setProjectData(prev => prev.filter(project => project.id !== projet_id));
    };

    const addTask = (newTask) => {
        setTaskData(prev => [...prev, { ...newTask, id: prev.length + 1 }]);
    };

    const updateTask = (updatedTask) => {
        setTaskData(prev => prev.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        ));
    };

    const deleteTask = (tache_id) => {
        setTaskData(prev => prev.filter(task => task.id !== tache_id));
    };

    // Add similar methods for other data types as needed

    const getQuoteData = (devis_id) => {
        const quote = quoteData.find((q) => q.id === devis_id);
        const works = workData.filter((w) => w.devis_id === devis_id);
        const tasks = taskData.filter((t) => works.some((w) => w.id === t.ouvrage_id));
        const budgets = budgetData.filter((b) => tasks.some((t) => t.id === b.tache_id));

        return {
            quote,
            works,
            tasks,
            budgets,
        };
    };


    const value = {
        projectData,
        clientData,
        quoteData,
        workData,
        taskData,
        setTaskData,
        jobs,
        teamMembers,
        budgetData,
        messageData,
        setMessageData,
        //SCHEDULING
        scheduleData,
        setScheduleData,
        // Helper functions
        getTaskWorkers,
        getWorkerTasks,
        assignWorkersToTask,
        updateAssignmentStatus,
        removeAssignments,
        /////////////////
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        // Add other methods as needed
        getQuoteData,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;