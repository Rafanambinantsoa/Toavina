import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs, Text, Tabs } from '@mantine/core';

import { useData } from '../context/DataProvider';

import '../styles/projects/projectpage.css'

import ProjectPhase from '../components/ProjectPhase';
import QuoteList from './QuoteList';
import PrepPage from './PrepPage';
import ExecPage from './ExecPage';

import { Receipt1, Calendar, Timer } from 'iconsax-react'

export default function ProjectPage() {
    const { id } = useParams();
    const {
        projectData,
        taskData,
        workData,
        clientData,
        quoteData
    } = useData();

    // Find the specific project and its client
    const project = projectData.find(p => p.id === parseInt(id));
    const projectClient = clientData.find(client => client.id === project?.client_id);

    // Get quotes associated with this project
    const projectQuotes = quoteData.filter(quote => quote.projet_id === parseInt(id));

    // Get works through their quote associations
    const projectWorks = workData.filter(work =>
        projectQuotes.some(quote => quote.id === work.devis_id)
    );

    // Get tasks through their work associations
    const getWorkTasks = (ouvrage_id) => {
        return taskData.filter(task => task.ouvrage_id === ouvrage_id);
    };

    // Get the first quote for display (you might want to handle multiple quotes differently)
    const projectQuote = projectQuotes[0];

    if (!project) {
        return <div>Project not found</div>;
    }

    const items = [
        { title: 'Projets', href: '/projects' },
        { title: `Projet: ${project.nom_projet}`, href: '#' },
    ].map((item, index) => (
        <Link to={item.href} key={index}>
            {item.title}
        </Link>
    ));

    // Helper function to get quote for a work
    const getQuoteForWork = (work) => {
        return quoteData.find(quote => quote.id === work.devis_id);
    };

    return (
        <div className='single-project-container'>
            <Breadcrumbs separator="→" separatorMargin="md" mt="xs" className='breadcrumbs-container'>
                {items}
            </Breadcrumbs>
            <section className="single-project-action-section">
                <Tabs defaultValue="devis" variant="pills" color='black' radius='xl'>
                    <Tabs.List>
                        <Tabs.Tab value="devis" leftSection={<Receipt1 size={16} />}>
                            Devis
                        </Tabs.Tab>
                        <Tabs.Tab value="preparation" leftSection={<Calendar size={16} />}>
                            Préparation
                        </Tabs.Tab>
                        <Tabs.Tab value="realisation" leftSection={<Timer size={16} />}>
                            Réalisation
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="devis">
                        <QuoteList
                            project={project}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="preparation">
                        <PrepPage
                            project={project}
                            projectQuotes={projectQuotes}
                            projectWorks={projectWorks}
                            getWorkTasks={getWorkTasks}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="realisation">
                        <ExecPage
                            project={project}
                            projectQuotes={projectQuotes}
                            projectWorks={projectWorks}
                            getWorkTasks={getWorkTasks}
                        />
                    </Tabs.Panel>
                </Tabs>
            </section>
            {/* <section className="project-phase-section">
                
            </section> */}
        </div>
    );
}