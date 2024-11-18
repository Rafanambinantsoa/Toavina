import React, { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Divider, ScrollArea, Card } from '@mantine/core';
import '../styles/projects/projects.css';

import TextInputComponent from '../components/TextInput';
import FilterComponent from '../components/FilterComponent';
import ButtonComponent from '../components/ButtonComponent';
import ProjectCard from '../components/ProjectCard';

import { SearchIcon } from 'lucide-react';
import { Add } from 'iconsax-react';

import AddProject from '../components/modals/AddProject';
import { useData } from '../context/DataProvider';

export default function Projects() {
    const { projectData, clientData, workData, taskData, quoteData } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);

    const filterCategoryData = [
        {
            group: 'Phase de projet',
            items: [...new Set(projectData.map(project => project.phase_projet))]
        },
        {
            group: 'Clients',
            items: clientData.map(client => client.nom_client)
        }
    ];

    // Helper function to get quotes for a project
    const getProjectQuotes = (projet_id) => {
        return quoteData.filter(quote => quote.projet_id === projet_id);
    };

    // Helper function to get works for a quote
    const getQuoteWorks = (devis_id) => {
        return workData.filter(work => work.devis_id === devis_id);
    };

    // Helper function to get tasks for a project through the quote and work relationships
    const getProjectTasks = (projet_id) => {
        // First, get all quotes associated with the project
        const projectQuotes = getProjectQuotes(projet_id);

        // Then, get all works associated with these quotes
        const works = projectQuotes.flatMap(quote =>
            getQuoteWorks(quote.id)
        );

        // Finally, get all tasks associated with these works
        const tasks = works.flatMap(work =>
            taskData.filter(task => task.ouvrage_id === work.id)
        );

        return tasks;
    };

    // Updated function to calculate project expenses
    const calculateProjectExpenses = (projet_id) => {
        const projectTasks = getProjectTasks(projet_id);
        return projectTasks.reduce((total, task) => {
            return total +
                task.budget_mo_reel +
                task.budget_materiaux_reel +
                task.budget_materiel_reel +
                task.budget_sous_traitance_reel;
        }, 0);
    };

    const normalizeText = (text) => {
        return text.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    const filteredProjects = useMemo(() => {
        return projectData.filter(project => {
            const normalizedProjectName = normalizeText(project.nom_projet);
            const normalizedSearchQuery = normalizeText(searchQuery);
            const client = clientData.find(c => c.id === project.client_id);

            const matchesSearch = normalizedProjectName.includes(normalizedSearchQuery);
            const matchesFilters = activeFilters.length === 0 || activeFilters.some(filter => {
                return project.phase_projet === filter ||
                    (client && client.nom_client === filter);
            });

            return matchesSearch && matchesFilters;
        });
    }, [projectData, searchQuery, activeFilters]);

    const enrichedFilteredProjects = filteredProjects.map(project => ({
        ...project,
        client: clientData.find(client => client.id === project.client_id),
        depenses: calculateProjectExpenses(project.id)
    }));

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleFilterChange = (selectedFilters) => {
        setActiveFilters(selectedFilters);
    };

    return (
        <div className="projects-container">
            <section className="main-title-section">
                <h1 className="main-title">Projets</h1>
                <h4 className="main-subtitle" c="dimmed">Liste des projets</h4>
            </section>
            <Divider className="divider" />
            <section className="projects-action-section">
                <div className="projects-filter-section">
                    <TextInputComponent
                        fieldname="Rechercher"
                        rightIcon={<SearchIcon size={8} />}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <FilterComponent
                        filterCategory={filterCategoryData}
                        onChange={handleFilterChange}
                        value={activeFilters}
                    />
                </div>
                <div className="projects-add-section">
                    <ButtonComponent
                        fieldname="Ajouter"
                        rightIcon={<Add />}
                        onClick={open}
                    />
                </div>
            </section>
            <section className="projects-list-section">
                <section className="projects-card-list">
                    <ScrollArea className="projects-card-list-scrollarea">
                        <div className="projects-grid">
                            {enrichedFilteredProjects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    tasks={getProjectTasks(project.id)}
                                    clients={clientData}
                                    works={workData.filter(work => {
                                        const quote = quoteData.find(q => q.id === work.devis_id);
                                        return quote && quote.projet_id === project.id;
                                    })}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </section>
            </section>
            <AddProject
                opened={opened}
                onClose={close}
                clientData={clientData}
            />
        </div>
    );
}