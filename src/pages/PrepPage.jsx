import { Text, Image, ScrollArea } from "@mantine/core";
import noResultFound from '../assets/images/no_results.webp';
import { useData } from "../context/DataProvider";

import BudgetChatbot from "../components/BudgetChatbot";

import { PlanningGanttChart } from "../components/gantt-chart/PlanningGanttChart";


export default function PrepPage({ project }) {
    const { quoteData, workData, taskData } = useData();

    // Get the validated quote for the project
    const validatedQuote = quoteData.find(quote => quote.projet_id === project.id && quote.etat_devis === 'valide');

    // Get works through their quote associations
    const projectWorks = workData.filter(work => work.devis_id === validatedQuote?.id);
    console.log(projectWorks);
    // Get tasks through their work associations
    const getWorkTasks = (ouvrage_id) => {
        return taskData.filter(task => task.ouvrage_id === ouvrage_id);
    };

    return (
        <>
            <section className="main-title-cta">
                <div className="main-title-section" style={{ padding: 0, marginBottom: 24 }}>
                    <h1 className="main-title">Planning</h1>
                    <Text className="main-subtitle" color="dimmed">
                        Planning du projet: {project.nom_projet}
                    </Text>
                </div>
            </section>
            <section className="gantt-section">
                {validatedQuote ? (
                    <div className="gantt-section-content">
                        {/* Render the Gantt chart or other planning components here */}
                        {/* You can use the data from the passed props */}
                        {/* For example: project, projectQuotes, projectWorks, getWorkTasks */}
                        {/* <GanttChart
                            projectWorks={projectWorks}
                            getWorkTasks={getWorkTasks}
                        /> */}
                        <PlanningGanttChart
                            projectWorks={projectWorks}
                            getWorkTasks={getWorkTasks}
                        />

                    </div>
                ) : (
                    <div className="not-found">
                        <Image src={noResultFound} alt="No results found" />
                        <Text>No valid quote found for this project.</Text>
                    </div>
                )}
            </section>
            <BudgetChatbot />
        </>
    );
}