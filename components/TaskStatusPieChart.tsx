import React, { useMemo, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Task, TaskStatus } from '../types';

const STATUS_COLORS_LIGHT: Record<TaskStatus, string> = {
    [TaskStatus.PENDING]: '#FBBF24', // amber-400
    [TaskStatus.IN_PROGRESS]: '#3B82F6', // blue-500
    [TaskStatus.COMPLETED]: '#10B981', // emerald-500
    [TaskStatus.ARCHIVED]: '#6B7280', // gray-500
};

const STATUS_COLORS_DARK: Record<TaskStatus, string> = {
    [TaskStatus.PENDING]: '#F59E0B', // amber-500
    [TaskStatus.IN_PROGRESS]: '#60A5FA', // blue-400
    [TaskStatus.COMPLETED]: '#34D399', // emerald-400
    [TaskStatus.ARCHIVED]: '#9CA3AF', // gray-400
};


const PieChartSegment: React.FC<{ percentage: number; color: string; offset: number; radius: number; strokeWidth: number }> = ({ percentage, color, offset, radius, strokeWidth }) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
        <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth}) rotate(${offset * 3.6} ${radius + strokeWidth} ${radius + strokeWidth})`}
            className="transition-all duration-500 ease-in-out"
        />
    );
};

const TaskStatusPieChart: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const { theme } = useContext(AppContext);
    const colors = theme === 'dark' ? STATUS_COLORS_DARK : STATUS_COLORS_LIGHT;

    const statusCounts = useMemo(() => {
        return tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<TaskStatus, number>);
    }, [tasks]);

    const totalTasks = tasks.length;
    
    if (totalTasks === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center">
                 <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-600">
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7c0-1.1.9-2 2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                 </div>
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">No task data to display.</p>
            </div>
        );
    }
    
    const chartData = Object.values(TaskStatus).map(status => ({
        status,
        count: statusCounts[status] || 0,
        percentage: totalTasks > 0 ? ((statusCounts[status] || 0) / totalTasks) * 100 : 0,
        color: colors[status],
    })).filter(item => item.count > 0);

    let cumulativePercentage = 0;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 h-full">
            <div className="relative w-40 h-40 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="animate-spin-slow">
                    {chartData.map(({ percentage, color }) => {
                        const offset = cumulativePercentage;
                        cumulativePercentage += percentage;
                        return (
                           <PieChartSegment
                                key={color}
                                percentage={percentage}
                                color={color}
                                offset={offset}
                                radius={45}
                                strokeWidth={10}
                           />
                        );
                    })}
                </svg>
            </div>
            <div className="w-full">
                <ul className="space-y-2">
                    {chartData.map(({ status, count, percentage, color }) => (
                         <li key={status} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{status}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {count} ({percentage.toFixed(0)}%)
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskStatusPieChart;