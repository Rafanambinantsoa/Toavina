import React from 'react';
import { Text } from '@mantine/core';
import { BarChart } from '@mantine/charts';

const ChartCard = ({ budgetData }) => {
    // Transform the data into the correct structure for the chart
    const chartData = [
        {
            category: "Main d'oeuvre",
            "Budget réel": budgetData.reduce((total, task) => total + task.budget_mo_reel, 0),
            "Budget prévisionnel": budgetData.reduce((total, task) => total + task.budget_mo_previsionnel, 0),
        },
        {
            category: "Matériaux",
            "Budget réel": budgetData.reduce((total, task) => total + task.budget_materiaux_reel, 0),
            "Budget prévisionnel": budgetData.reduce((total, task) => total + task.budget_materiaux_previsionnel, 0),
        },
        {
            category: "Matériels",
            "Budget réel": budgetData.reduce((total, task) => total + task.budget_materiel_reel, 0),
            "Budget prévisionnel": budgetData.reduce((total, task) => total + task.budget_materiel_previsionnel, 0),
        },
        {
            category: "Sous-Traitance",
            "Budget réel": budgetData.reduce((total, task) => total + task.budget_sous_traitance_reel, 0),
            "Budget prévisionnel": budgetData.reduce((total, task) => total + task.budget_sous_traitance_previsionnel, 0),
        },
    ];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100 %'
            }}
        >

            <BarChart
                h={250}
                data={chartData}
                dataKey="category"
                series={[
                    { name: 'Budget réel', color: '#40A7FF', dataKey: 'Budget réel' },
                    { name: 'Budget prévisionnel', color: '#FF8A3D', dataKey: 'Budget prévisionnel' }
                ]}
                orientation="horizontal"
                radius={6}
                gridAxis="y"
                tooltipProps={{
                    content: ({ payload, label }) => {
                        if (payload && payload.length > 0) {
                            return (
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '12px'
                                }}>
                                    <div>{label}</div>
                                    {payload.map((entry, index) => (
                                        <div key={index} style={{ color: entry.color }}>
                                            {entry.name}: {entry.value.toLocaleString()}€
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                        return null;
                    },
                }}
                tooltipAnimationDuration={200}
                yAxisProps={{
                    tickLine: false,
                    axisLine: false,
                }}
                xAxisProps={{
                    tickLine: false,
                    axisLine: false,
                }}
            />
        </div>
    );
};

export default ChartCard;