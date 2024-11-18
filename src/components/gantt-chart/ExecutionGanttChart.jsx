import { BaseGanttChart } from "./BaseGanttChart";

export const ExecutionGanttChart = ({ projectWorks, getWorkTasks }) => {
    return (
        <BaseGanttChart
            projectWorks={projectWorks}
            getWorkTasks={getWorkTasks}
            showRealTasks={true}
            isPrevisionalEditable={false}
            title="Diagramme de Gantt"
        />
    );
};