
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Task, TaskStatus, User, UserRole } from '../types';
import { api } from '../services/mockApi';

const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
        case TaskStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case TaskStatus.ARCHIVED: return 'bg-gray-100 text-gray-800';
    }
}

const TaskCard: React.FC<{ task: Task, assignee?: User, creator?: User }> = ({ task, assignee, creator }) => (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{task.description}</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 border-t border-gray-200 pt-3">
            <p>Assignee: <span className="font-medium text-gray-700">{assignee?.username || 'N/A'}</span></p>
            <p>Creator: <span className="font-medium text-gray-700">{creator?.username || 'N/A'}</span></p>
            <p>Created: <span className="font-medium text-gray-700">{new Date(task.createdAt).toLocaleDateString()}</span></p>
        </div>
    </div>
);


const TasksView: React.FC = () => {
    const { currentUser, users, tasks, loading, addTask } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [assigneeId, setAssigneeId] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const userMap = useMemo(() => new Map(users.map(user => [user.id, user])), [users]);

    const visibleTasks = useMemo(() => {
        if (!currentUser) return [];
        switch (currentUser.role) {
            case UserRole.ADMIN:
            case UserRole.MANAGER:
                return tasks;
            case UserRole.TEAM_LEADER:
                const teamMemberIds = users.filter(u => u.teamId === currentUser.teamId).map(u => u.id);
                return tasks.filter(task => teamMemberIds.includes(task.assigneeId));
            case UserRole.TEAM_MEMBER:
                return tasks.filter(task => task.assigneeId === currentUser.id);
            default:
                return [];
        }
    }, [currentUser, tasks, users]);
    
    const resetModal = () => {
        setIsModalOpen(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setAssigneeId('');
        setIsSubmitting(false);
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle || !assigneeId || !currentUser) return;
        
        setIsSubmitting(true);
        const newTaskData = {
            title: newTaskTitle,
            description: newTaskDesc,
            status: TaskStatus.PENDING,
            assigneeId: Number(assigneeId),
            creatorId: currentUser.id,
        };

        try {
            const createdTask = await api.createTask(newTaskData);
            addTask(createdTask);
            resetModal();
        } catch (error) {
            console.error("Failed to create task", error);
            setIsSubmitting(false);
        }
    };


    if (loading) return <div>Loading tasks...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    New Task
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleTasks.map(task => (
                    <TaskCard 
                        key={task.id} 
                        task={task}
                        assignee={userMap.get(task.assigneeId)}
                        creator={userMap.get(task.creatorId)}
                    />
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 transition-opacity">
                    <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Task</h2>
                        <form onSubmit={handleCreateTask}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input type="text" id="taskTitle" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="taskDesc" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea id="taskDesc" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
                                </div>
                                <div>
                                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assign To</label>
                                    <select id="assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                                        <option value="" disabled>Select a user</option>
                                        {users.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={resetModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
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