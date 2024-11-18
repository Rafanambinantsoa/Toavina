import { BaseGanttChart } from "./BaseGanttChart";

export const PlanningGanttChart = ({ projectWorks, getWorkTasks }) => {
    return (
        <BaseGanttChart
            projectWorks={projectWorks}
            getWorkTasks={getWorkTasks}
            showRealTasks={false}
            isPrevisionalEditable={true}
            title="Diagramme de Gantt"
        />
    );
};