import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Task, TaskStatus } from '../types';
import * as api from '../services/api';

const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case TaskStatus.COMPLETED: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const TaskCard: React.FC<{ task: Task; onStatusChange: (taskId: string, newStatus: TaskStatus) => void; onDelete: (taskId: string) => void }> = ({ task, onStatusChange, onDelete }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 flex flex-col justify-between h-full">
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 break-words">{task.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${getStatusColor(task.status)} flex-shrink-0 ml-2`}>
                    {task.status.replace('_', ' ')}
                </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{task.description}</p>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
             <div className="mb-3">
                <label htmlFor={`status-${task.id}`} className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Status</label>
                <select
                    id={`status-${task.id}`}
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                    className="mt-1 w-full text-sm rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:ring-opacity-50 py-2 pl-3 pr-8 capitalize"
                >
                    {Object.values(TaskStatus).map(status => (
                        <option key={status} value={status} className="capitalize">{status.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-between items-end">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>Created: <span className="font-medium text-gray-700 dark:text-gray-200">{new Date(task.created_at).toLocaleDateString()}</span></p>
                </div>
                 <button 
                    onClick={() => onDelete(task.id)}
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Delete task"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
);


const TasksView: React.FC = () => {
    const { searchTerm } = useContext(AppContext);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const fetchedTasks = await api.getTasks();
                setTasks(fetchedTasks);
            } catch (err) {
                setError("Failed to load tasks. Please try logging in again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const filteredTasks = useMemo(() => {
        if (!searchTerm) return tasks;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return tasks.filter(task => 
            task.title.toLowerCase().includes(lowercasedSearchTerm) ||
            (task.description && task.description.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [tasks, searchTerm]);
    
    const resetModal = () => {
        setIsModalOpen(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setIsSubmitting(false);
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        
        setIsSubmitting(true);
        try {
            const createdTask = await api.createTask({ title: newTaskTitle, description: newTaskDesc });
            setTasks(prevTasks => [createdTask, ...prevTasks]);
            resetModal();
        } catch (error) {
            console.error("Failed to create task", error);
            alert("Could not create task. Please try again.");
            setIsSubmitting(false);
        }
    };
    
    const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
        const originalTasks = [...tasks];
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === taskId ? {...t, status: newStatus} : t));

        try {
            await api.updateTask(taskId, { status: newStatus });
        } catch (error) {
            console.error("Failed to update task status", error);
            alert("Could not update task status. Reverting changes.");
            setTasks(originalTasks);
        }
    };
    
    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.deleteTask(taskId);
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } catch (error) {
                console.error("Failed to delete task", error);
                alert("Could not delete the task. Please try again.");
            }
        }
    };


    if (loading) return <div>Loading tasks...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Tasks</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    New Task
                </button>
            </div>
            
            {filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-50">No tasks found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? "Try adjusting your search." : "Get started by creating a new task."}
                    </p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 transition-opacity" onClick={resetModal}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Create New Task</h2>
                        <form onSubmit={handleCreateTask}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                    <input type="text" id="taskTitle" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="taskDesc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea id="taskDesc" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-gray-200"></textarea>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={resetModal} className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300">
                                    {isSubmitting ? 'Creating...' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksView;